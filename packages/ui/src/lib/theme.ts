export const THEME_KEY = 'rc-theme';
/** Inline script that applies the saved theme before paint; every app layout imports this one copy. */
export const THEME_BOOT = `try{if(localStorage.getItem('${THEME_KEY}')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`;
