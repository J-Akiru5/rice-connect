import type { Config } from 'tailwindcss';

/* Colors come only from CSS variables generated from design/tokens.json (src/styles/tokens.css).
   Components reference them as arbitrary values: bg-[var(--fill-strong)], border-[color:var(--text-muted)]. */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
