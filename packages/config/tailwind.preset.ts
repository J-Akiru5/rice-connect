import type { Config } from 'tailwindcss';

/* Shared Tailwind preset. Colors come only from CSS variables generated from the design tokens
   (@rc/ui src/styles/tokens.css); components use arbitrary values like bg-[var(--fill-strong)].
   Breakpoints: <768 mobile, 768-1199 tablet, >=1200 desktop. Each app sets its own `content` globs. */
const preset: Partial<Config> = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1200px', xl: '1440px', '2xl': '1920px' },
    extend: { fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] } },
  },
  plugins: [],
};
export default preset;
