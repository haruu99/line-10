import '@videojs/html/i18n';
import '@videojs/html/video/player';
import '@videojs/html/media/mux-video';
import '@videojs/html/media/hls-video';
import '@/skin.css';
import '@/video/skin';
import skinTemplate from '@/video/skin.html?raw';
import './site.css';

/*
 * The showcase. Every player on this page is the same skin.html, with different media,
 * a different line colour, a different width or a different language.
 */

type Route = {
  id: string;
  title: string;
  ratio: string;
  poster: string;
  media: string;
};

// LINE 10's own Mux asset: A Trip Down Market Street with the original score.
const MARKET_MUX_ID = 'knYphH43CPZ00OzhOl7GFDQ8ELyNi6V4v025Nw1s9009Rc';
// Video.js sandbox's Cosmic Dawn trailer.
const MUX_ID = '83EzHOvVzVN01AsrD01BCpiH02Pj3S8mfzBOu101w2nHC5s';

const ROUTES: Record<string, Route> = {
  market: {
    id: 'market',
    title: 'A Trip Down Market Street, 1906',
    ratio: '4 / 3',
    poster: './media/market/poster.jpg',
    media: `<mux-video src="https://stream.mux.com/${MARKET_MUX_ID}.m3u8" playsinline crossorigin preload="metadata">
      <track kind="chapters" label="Stops" srclang="en" src="./media/market/chapters.vtt" default>
      <track kind="metadata" label="thumbnails" src="./media/market/storyboard.vtt" default>
      <track kind="captions" label="English" srclang="en" src="./media/market/captions.en.vtt">
    </mux-video>`,
  },
  dawn: {
    id: 'dawn',
    title: 'Cosmic Dawn',
    ratio: '16 / 9',
    poster: `https://image.mux.com/${MUX_ID}/thumbnail.webp?time=69`,
    media: `<mux-video src="https://stream.mux.com/${MUX_ID}.m3u8" playsinline crossorigin>
      <track kind="chapters" label="Stops" srclang="en" src="./media/dawn/chapters.vtt" default>
    </mux-video>`,
  },
};

const MEDIA_PLACEHOLDER = '<!-- Add a compatible media component here. -->';

let playerCount = 0;

function makePlayer(route: Route): HTMLElement {
  const player = document.createElement('video-player');
  player.setAttribute('poster', route.poster);
  // Several players share this page, so every id the template uses (and every
  // trigger / commandfor that points at one) gets a per-player suffix.
  const n = ++playerCount;
  player.innerHTML = skinTemplate
    .replace(MEDIA_PLACEHOLDER, route.media)
    .replace(/\b(id|trigger|commandfor)="(l10-[\w-]+)"/g, `$1="$2-p${n}"`);
  // The title the top bar shows next to the destination blind.
  player.setAttribute('content-title', route.title);
  return player;
}

/** Mount a player into a slot; returns the i18n provider so its language can change. */
function mount(slot: HTMLElement, route: Route, lang?: string): HTMLElement {
  const i18n = document.createElement('media-i18n');
  if (lang) i18n.setAttribute('lang', lang);
  i18n.append(makePlayer(route));
  slot.replaceChildren(i18n);
  slot.style.setProperty('--ratio', route.ratio);
  slot.dataset.route = route.id;
  return i18n;
}

/* ------------------------------------------------------------ the main platform */
const stage = document.getElementById('stage')!;
let current = ROUTES.market;
let lang = 'en';
let provider = mount(stage, current, lang);

function setRoute(id: string) {
  const next = ROUTES[id];
  if (!next || next === current) return;
  current = next;
  provider = mount(stage, current, lang);
  document.querySelectorAll<HTMLButtonElement>('[data-route-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.routeBtn === id));
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-route-btn]').forEach((b) => {
  b.addEventListener('click', () => setRoute(b.dataset.routeBtn!));
});

/* Line colour: one token, every player on the page follows it. */
document.querySelectorAll<HTMLInputElement>('input[name="line"]').forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    document.documentElement.style.setProperty('--line', input.value);
    document.documentElement.dataset.line = input.dataset.name ?? '';
  });
});

/* Language: the provider's lang, which also sets direction. */
const langSelect = document.getElementById('lang') as HTMLSelectElement;
langSelect.addEventListener('change', () => {
  lang = langSelect.value;
  provider.setAttribute('lang', lang);
});

/* ------------------------------------------------------------ the platform gallery */
document.querySelectorAll<HTMLElement>('[data-mini]').forEach((slot) => {
  mount(slot, ROUTES[slot.dataset.mini!] ?? current, slot.dataset.lang);
});
