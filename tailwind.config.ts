import type { Config } from "tailwindcss";

/**
 * Design tokens from docs/BUILD_BRIEF.md section 3.
 * Four colors (paper, ink, oxblood, green) plus the brief's supporting tones.
 * The legacy names below (navy, cream, orange, ...) are aliases so the desks built
 * before the redesign render inside the new shell without per-file edits. New code
 * uses the brief's names only.
 */
const paper = "#F4EFE6";
const paper2 = "#ECE5D8";
const ink = "#1C1B19";
const oxblood = "#8E1B1B";
const green = "#1F3A2E";
// Type decision B (Dutch, 2026-11-09): every text tone on paper is full ink; rules a shade darker.
const muted = ink;
const body = ink;
const hairline = "#B9AD93";
const gold = "#7A5A16";
const placeholder = "#DDD4C4";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/conTiers.ts",
  ],
  theme: {
    extend: {
      colors: {
        // The brief's palette
        paper,
        "paper-2": paper2,
        ink,
        oxblood,
        "oxblood-hover": "#A32020",
        green,
        muted,
        body,
        hairline,
        gold,
        placeholder,
        // Secondary text and rules on colored bands
        "green-text": "#C9BFA9",
        "green-text-2": "#E4DCCB",
        "green-rule": "#4A6355",
        "oxblood-text": "#E8CFC4",
        "oxblood-rule": "#B35A58",
        "ink-text": "#C9BFA9",
        "ink-text-2": "#E4DCCB",
        "ink-label": "#8C8577",

        // Legacy aliases (desks built before the redesign)
        navy: paper,
        "navy-light": paper2,
        "navy-dark": paper2,
        "navy-row": paper2,
        cream: ink,
        orange: oxblood,
        "orange-light": "#A32020",
        "red-brown": oxblood,
        card: paper2,
        "card-alt": paper2,
        border: hairline,
        dark: paper2,
        darkest: paper,
        redflag: oxblood,
        "redflag-bg": paper2,
        // CON restrictiveness tiers, free to most restrictive
        "tier-free": green,
        "tier-mostly-free": "#4A6355",
        "tier-moderate": gold,
        "tier-restrictive": "#B35A58",
        "tier-highly-restrictive": oxblood,
        "tier-most-restrictive": "#5E1010",
        // States index map: single-hue oxblood ramp for CON tiers, freest (1) to most restrictive (5).
        // 1-3 carry ink text, 4-5 paper text (all AA). No-CON states are outlined, not filled.
        "con-ramp-1": "#F2DDD7",
        "con-ramp-2": "#E3B2A8",
        "con-ramp-3": "#CB7A6F",
        "con-ramp-4": "#A33A31",
        "con-ramp-5": "#6E1414",
      },
      fontFamily: {
        display: ['"Inter Tight"', "Inter", "system-ui", "sans-serif"],
        // Type decision B: Inter for body, data and labels; Inter Tight for card and table titles;
        // Bodoni only for the masthead, section headings at 40px and up, and big numbers;
        // EB Garamond only for long-form prose.
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        tight: ['"Inter Tight"', "Inter", "system-ui", "sans-serif"],
        prose: ['"EB Garamond"', "Garamond", "Georgia", "serif"],
        meta: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        // Inter sizes from type decision B: 17px body, 13px floor.
        xs: ["0.8125rem", { lineHeight: "1.45" }],
        sm: ["0.9375rem", { lineHeight: "1.5" }],
        base: ["1.0625rem", { lineHeight: "1.55" }],
        lg: ["1.1875rem", { lineHeight: "1.5" }],
        xl: ["1.375rem", { lineHeight: "1.4" }],
        stat: ["3rem", { lineHeight: "1.05", fontWeight: "400" }],
      },
      maxWidth: {
        content: "1200px",
        prose: "880px",
      },
    },
  },
  plugins: [],
};
export default config;
