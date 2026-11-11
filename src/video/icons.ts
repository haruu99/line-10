import { registerIcons } from '@videojs/html/icons';

/*
 * LINE 10 pictograms. One 24-unit grid, filled shapes plus 2.25-unit round strokes,
 * drawn like transit wayfinding pictograms: heavy, simple, readable at a glance.
 * The play triangle is shifted right by 1 unit so it sits optically centred in a roundel.
 */
const svg = (body: string, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"${extra}>${body}</svg>`;
const S = 'stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"';

export const line10Icons = {
  play: svg('<path fill="currentColor" d="M8.2 4.6c0-1 1.1-1.6 1.95-1.07l10.1 6.4c.8.5.8 1.66 0 2.16l-10.1 6.4c-.85.53-1.95-.08-1.95-1.08z"/>'),
  pause: svg('<rect x="5.5" y="4.25" width="4.5" height="15.5" rx="1.25" fill="currentColor"/><rect x="14" y="4.25" width="4.5" height="15.5" rx="1.25" fill="currentColor"/>'),
  // Ride again: a loop line returning to its own station.
  restart: svg(`<path ${S} d="M5.6 9.2A7 7 0 1 1 5 13.5"/><path fill="currentColor" d="M3.1 4.9 3.4 10.6l5.4-1.8z"/>`),
  'volume-high': svg(`<path fill="currentColor" d="M3 9.2c0-.6.5-1.1 1.1-1.1H7l4.3-3.6c.7-.6 1.8-.1 1.8.8v13.4c0 .9-1.1 1.4-1.8.8L7 15.9H4.1c-.6 0-1.1-.5-1.1-1.1z"/><path ${S} d="M16.2 9.1a4 4 0 0 1 0 5.8M18.9 6.4a7.8 7.8 0 0 1 0 11.2"/>`),
  'volume-low': svg(`<path fill="currentColor" d="M3 9.2c0-.6.5-1.1 1.1-1.1H7l4.3-3.6c.7-.6 1.8-.1 1.8.8v13.4c0 .9-1.1 1.4-1.8.8L7 15.9H4.1c-.6 0-1.1-.5-1.1-1.1z"/><path ${S} d="M16.2 9.1a4 4 0 0 1 0 5.8"/>`),
  'volume-off': svg(`<path fill="currentColor" d="M3 9.2c0-.6.5-1.1 1.1-1.1H7l4.3-3.6c.7-.6 1.8-.1 1.8.8v13.4c0 .9-1.1 1.4-1.8.8L7 15.9H4.1c-.6 0-1.1-.5-1.1-1.1z"/><path ${S} d="m16.3 9.3 5 5.4m0-5.4-5 5.4"/>`),
  'captions-off': svg(`<rect x="2.6" y="5" width="18.8" height="14" rx="2.6" ${S}/><path ${S} d="M10.3 10.2a2.3 2.3 0 1 0 0 3.6M16.6 10.2a2.3 2.3 0 1 0 0 3.6"/>`),
  'captions-on': svg('<path fill="currentColor" fill-rule="evenodd" d="M4.8 3.9h14.4a3.7 3.7 0 0 1 3.7 3.7v8.8a3.7 3.7 0 0 1-3.7 3.7H4.8a3.7 3.7 0 0 1-3.7-3.7V7.6a3.7 3.7 0 0 1 3.7-3.7zm4.4 6.05a1.15 1.15 0 0 1 .4.1 1.1 1.1 0 0 0 1.5-1.6 3.4 3.4 0 1 0 0 5.1 1.1 1.1 0 1 0-1.5-1.6 1.2 1.2 0 1 1-.4-2zm6.3 0a1.2 1.2 0 0 1 .4.1 1.1 1.1 0 1 0 1.5-1.6 3.4 3.4 0 1 0 0 5.1 1.1 1.1 0 1 0-1.5-1.6 1.2 1.2 0 1 1-.4-2z"/>'),
  'fullscreen-enter': svg(`<path ${S} d="M4 9V5.2C4 4.5 4.5 4 5.2 4H9M15 4h3.8c.7 0 1.2.5 1.2 1.2V9M20 15v3.8c0 .7-.5 1.2-1.2 1.2H15M9 20H5.2C4.5 20 4 19.5 4 18.8V15"/>`),
  'fullscreen-exit': svg(`<path ${S} d="M9 4v3.8C9 8.5 8.5 9 7.8 9H4M20 9h-3.8C15.5 9 15 8.5 15 7.8V4M15 20v-3.8c0-.7.5-1.2 1.2-1.2H20M4 15h3.8c.7 0 1.2.5 1.2 1.2V20"/>`),
  'pip-enter': svg(`<path ${S} d="M20.5 11V6.6c0-.9-.7-1.6-1.6-1.6H5.1c-.9 0-1.6.7-1.6 1.6v10.8c0 .9.7 1.6 1.6 1.6H9"/><rect x="12.5" y="13.5" width="9" height="6.5" rx="1.3" fill="currentColor"/>`),
  'pip-exit': svg(`<path ${S} d="M20.5 11V6.6c0-.9-.7-1.6-1.6-1.6H5.1c-.9 0-1.6.7-1.6 1.6v10.8c0 .9.7 1.6 1.6 1.6H9"/><rect x="12.5" y="13.5" width="9" height="6.5" rx="1.3" ${S}/><path ${S} d="m9.5 9.5 3.5 3.5m-3.5 0v-3.5H13"/>`),
  gear: svg('<circle cx="12" cy="12" r="8.4" stroke="currentColor" stroke-width="3.4" stroke-dasharray="2.64 2.64"/><circle cx="12" cy="12" r="6.2" stroke="currentColor" stroke-width="2.6"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>'),
  chevron: svg(`<path ${S} d="m9 5.5 6.5 6.5L9 18.5"/>`),
  check: svg(`<path ${S} stroke-width="2.75" d="m4.8 12.6 4.6 4.6 9.8-10.4"/>`),
  // Seek: a short line segment with an arrow, read like a "this way" sign.
  seek: svg(`<path ${S} d="M18.4 9.2A7 7 0 1 0 19 13.5"/><path fill="currentColor" d="M20.9 4.9 20.6 10.6l-5.4-1.8z"/>`),
  spinner: svg(`<circle cx="12" cy="12" r="8" ${S} opacity=".3"/><path ${S} d="M12 4a8 8 0 0 1 8 8" style="transform-box:view-box;transform-origin:center;animation:var(--media-spinner-animation, l10-spin .9s linear infinite)"/>`, ''),
  speech: svg(`<path ${S} d="M4 6.6C4 5.7 4.7 5 5.6 5h12.8c.9 0 1.6.7 1.6 1.6v8.3c0 .9-.7 1.6-1.6 1.6H11l-4.5 3.2v-3.2h-.9C4.7 16.5 4 15.8 4 14.9z"/>`),
  // Service pattern: a gauge needle.
  speed: svg(`<path ${S} d="M4.2 16.5a8.4 8.4 0 1 1 15.6 0"/><path ${S} d="m12 13.2 4-4.6"/><circle cx="12" cy="13.6" r="1.9" fill="currentColor"/>`),
  switches: svg(`<path ${S} d="M4 7.5h9m4 0h3M4 16.5h3m4 0h9"/><circle cx="15" cy="7.5" r="2.3" ${S}/><circle cx="9" cy="16.5" r="2.3" ${S}/>`),
  'airplay-enter': svg(`<path ${S} d="M7 17H5.2c-.9 0-1.7-.8-1.7-1.7V6.2c0-.9.8-1.7 1.7-1.7h13.6c.9 0 1.7.8 1.7 1.7v9.1c0 .9-.8 1.7-1.7 1.7H17"/><path fill="currentColor" d="M11.2 13.6a1 1 0 0 1 1.6 0l3.6 5c.5.7 0 1.6-.8 1.6H8.4c-.8 0-1.3-.9-.8-1.6z"/>`),
  'airplay-exit': svg(`<path ${S} d="M7 17H5.2c-.9 0-1.7-.8-1.7-1.7V6.2c0-.9.8-1.7 1.7-1.7h13.6c.9 0 1.7.8 1.7 1.7v9.1c0 .9-.8 1.7-1.7 1.7H17"/><path fill="currentColor" d="M11.2 13.6a1 1 0 0 1 1.6 0l3.6 5c.5.7 0 1.6-.8 1.6H8.4c-.8 0-1.3-.9-.8-1.6z"/><rect x="6.5" y="7.5" width="11" height="3" rx="1" fill="currentColor"/>`),
  'cast-enter': svg(`<path ${S} d="M3.5 8V6.6C3.5 5.7 4.2 5 5.1 5h13.8c.9 0 1.6.7 1.6 1.6v10.8c0 .9-.7 1.6-1.6 1.6H14"/><path ${S} d="M3.5 12a7 7 0 0 1 7 7M3.5 15.5A3.5 3.5 0 0 1 7 19"/><circle cx="3.9" cy="18.6" r="1.3" fill="currentColor"/>`),
  'cast-exit': svg(`<path ${S} d="M3.5 8V6.6C3.5 5.7 4.2 5 5.1 5h13.8c.9 0 1.6.7 1.6 1.6v10.8c0 .9-.7 1.6-1.6 1.6H14"/><path ${S} d="M3.5 12a7 7 0 0 1 7 7M3.5 15.5A3.5 3.5 0 0 1 7 19"/><circle cx="3.9" cy="18.6" r="1.3" fill="currentColor"/><rect x="9" y="8" width="8.5" height="7" rx="1" fill="currentColor"/>`),
  // Stops: a line diagram with three stations, used for the chapter list.
  stops: svg(`<path ${S} d="M7 4.5v15"/><circle cx="7" cy="6" r="2.4" fill="currentColor"/><circle cx="7" cy="12" r="2.4" fill="var(--l10-plate, #0e0f11)" ${S}/><circle cx="7" cy="18" r="2.4" fill="currentColor"/><path ${S} d="M12.5 6h7M12.5 12h5M12.5 18h7"/>`),
};

registerIcons('line10', line10Icons);
