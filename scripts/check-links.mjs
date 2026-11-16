#!/usr/bin/env node
/**
 * Build gate from MERGER_PLAN.md (section 4.7): tafhc.org never links to the retired domain. The build fails if
 * any source file, data file or public text file contains "rojasreport.com" (the apex or any subdomain, read.
 * included: the site does not link the founder's personal newsletter). Runs before `next build` with check-sources.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIRS = ['src', 'public', 'netlify'];
const EXT = /\.(ts|tsx|js|mjs|json|css|txt|md|xml)$/;
const SKIP = new Set(['public/_redirects']); // the redirect rules are the one place the old host belongs
const NEEDLE = /rojasreport\.com/i;

function files(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(files(p));
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const d of DIRS) {
  let list = [];
  try {
    list = files(join(ROOT, d));
  } catch {
    continue;
  }
  for (const f of list) {
    const rel = relative(ROOT, f);
    if (SKIP.has(rel)) continue;
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (NEEDLE.test(line)) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
}

if (hits.length) {
  console.error(`check-links: ${hits.length} reference(s) to the retired domain:`);
  for (const h of hits) console.error(`  - ${h}`);
  process.exit(1);
}
console.log('check-links: no reference to the retired domain outside public/_redirects.');
