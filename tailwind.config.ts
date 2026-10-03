import type { Config } from 'tailwindcss';

/* Colors come only from CSS variables generated from design/tokens.json (src/styles/tokens.css).
   Components reference them as arbitrary values: bg-[var(--fill-strong)], border-[color:var(--text-muted)]. */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  /* Breakpoints: <768 mobile, 768-1199 tablet, >=1200 desktop (xl/2xl for 1440/1920 tuning). */
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1200px', xl: '1440px', '2xl': '1920px' },
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
