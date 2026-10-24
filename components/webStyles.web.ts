import { themes } from '@/constants/theme';

// Page-level rules React Native can't express, added once in the browser: a
// focus ring that appears instantly for keyboard users, and no sideways
// scroll. Colors come from the theme tokens.
const css = `
:root { --color-focus: ${themes.light.focus}; --color-select: ${themes.light.accentSoft}; --color-caret: ${themes.light.accent}; }
@media (prefers-color-scheme: dark) { :root { --color-focus: ${themes.dark.focus}; --color-select: ${themes.dark.accentSoft}; --color-caret: ${themes.dark.accent}; } }
::selection { background: var(--color-select); }
input, textarea { caret-color: var(--color-caret); }
html, body { overflow-x: clip; }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; transition: none; }
`;

if (typeof document !== 'undefined' && !document.getElementById('code-sync-web-styles')) {
  const style = document.createElement('style');
  style.id = 'code-sync-web-styles';
  style.textContent = css;
  document.head.appendChild(style);
}
