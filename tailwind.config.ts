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
        navy: '#0f1c2e',
        'navy-light': '#1a2a3e',
        'navy-dark': '#0a1420',
        'navy-row': '#162636',
        cream: '#f7f4ef',
        orange: '#d4622a',
        'orange-light': '#e07a3a',
        'red-brown': '#8b3a2a',
        'tier-free': '#a8c9b0',
        'tier-mostly-free': '#c5d4bb',
        'tier-moderate': '#e6b85c',
        'tier-restrictive': '#c47a3f',
        'tier-highly-restrictive': '#b04e2f',
        'tier-most-restrictive': '#8b3a2a',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'content': '1080px',
        'prose': '960px',
      },
      fontSize: {
        'stat': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    },
  },
  plugins: [],
};
export default config;
