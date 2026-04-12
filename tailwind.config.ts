import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1a2a3a',
        cream: '#f7f4ef',
        orange: '#d4622a',
        'navy-light': '#243546',
        'navy-dark': '#111e2b',
        'navy-row': '#1e3040',
        'orange-light': '#e07a3a',
        'tier-free': '#22c55e',
        'tier-mostly-free': '#4ade80',
        'tier-moderate': '#facc15',
        'tier-restrictive': '#f97316',
        'tier-highly-restrictive': '#ef4444',
        'tier-most-restrictive': '#b91c1c',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'content': '1080px',
      },
      fontSize: {
        'stat': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
export default config;
