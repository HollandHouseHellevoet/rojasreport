#!/usr/bin/env node
/**
 * Build gate from the brief (docs/BUILD_BRIEF.md section 9): the build fails if a figure has no source.
 *
 * Scans every JSON data file under src/data and data. A figure is any object with a `basis` field and a
 * `value` or `amount`. Each must have a basis of reported, estimated or pending; reported and estimated
 * figures must also carry a non-empty `source` and `as_of`. Runs before `next build` (npm "prebuild").
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIRS = ['src/data', 'data'];
const BASES = new Set(['reported', 'estimated', 'pending']);

function files(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(files(p));
    else if (name.endsWith('.json')) out.push(p);
  }
  return out;
}

const problems = [];
let figures = 0;

function walk(node, path, file) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`, file));
    return;
  }
  if (node && typeof node === 'object') {
    if ('basis' in node && ('value' in node || 'amount' in node)) {
      figures += 1;
      const where = `${relative(ROOT, file)} ${path || '(root)'}`;
      if (!BASES.has(node.basis)) problems.push(`${where}: basis "${node.basis}" is not reported, estimated or pending`);
      else if (node.basis !== 'pending') {
        for (const k of ['source', 'as_of']) {
          if (typeof node[k] !== 'string' || node[k].trim() === '') problems.push(`${where}: ${node.basis} figure has no ${k}`);
        }
      }
    }
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k, file);
  }
}

for (const d of DIRS) {
  let list = [];
  try {
    list = files(join(ROOT, d));
  } catch {
    continue;
  }
  for (const f of list) {
    let data;
    try {
      data = JSON.parse(readFileSync(f, 'utf8'));
    } catch (e) {
      problems.push(`${relative(ROOT, f)}: not valid JSON (${e.message})`);
      continue;
    }
    walk(data, '', f);
  }
}

if (problems.length) {
  console.error(`check-sources: ${problems.length} figure(s) without a source:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check-sources: ${figures} figures, every reported or estimated one has a source and an as-of date.`);
