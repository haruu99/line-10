/*
 * LINE 10 custom parts. Each one reads player state through PlayerController, like the
 * built-in components, and either mirrors an accessible built-in (aria-hidden visuals) or is
 * a real control with a name and keyboard support.
 */
import {
  I18nController,
  PlayerController,
  UIElement,
  i18nContext,
  playerContext,
  selectError,
  selectPlayback,
  selectPlaybackRate,
  selectTextTrack,
  selectTime,
  selectVolume,
  type PropertyValues,
} from '@videojs/html';

type Cue = { startTime: number; endTime: number; text: string };

export function formatTime(seconds: number, withHours = false): string {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 || withHours ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

function cueIndexAt(cues: readonly Cue[], t: number): number {
  for (let i = cues.length - 1; i >= 0; i--) if (t >= cues[i]!.startTime - 0.05) return i;
  return -1;
}

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------------------------------ */
/* <l10-flap type="current|duration|remaining">: a split-flap board that mirrors a time value. */
/* Purely visual (aria-hidden); a visually hidden <media-time> beside it carries the meaning.  */
/* ------------------------------------------------------------------------------------------ */
class L10FlapElement extends UIElement {
  #time = new PlayerController(this, playerContext, selectTime);
  #chars: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  update(changed: PropertyValues) {
    super.update(changed);
    const time = this.#time.value;
    if (!time) return;
    const type = this.getAttribute('type') ?? 'current';
    const dur = time.duration || 0;
    const hours = dur >= 3600;
    let text: string;
    if (type === 'duration') text = formatTime(dur, hours);
    else if (type === 'remaining') text = '-' + formatTime(dur - time.currentTime, hours);
    else text = formatTime(time.currentTime, hours);
    this.#render(text);
  }

  #render(text: string) {
    const next = [...text];
    if (next.length !== this.#chars.length) {
      this.replaceChildren(
        ...next.map((c) => {
          const tile = document.createElement('span');
          tile.className = /\d/.test(c) ? 'l10-flap-tile' : 'l10-flap-sep';
          tile.dataset.char = c;
          tile.textContent = c;
          return tile;
        })
      );
      this.#chars = next;
      return;
    }
    next.forEach((c, i) => {
      if (c === this.#chars[i]) return;
      const tile = this.children[i] as HTMLElement;
      tile.dataset.prev = this.#chars[i] ?? '';
      tile.dataset.char = c;
      tile.textContent = c;
      if (!reducedMotion() && tile.classList.contains('l10-flap-tile')) {
        tile.removeAttribute('data-flip');
        void tile.offsetWidth; // restart the fold
        tile.setAttribute('data-flip', '');
      }
    });
    this.#chars = next;
  }
}

/* ------------------------------------------------------------------------------------------ */
/* <l10-station mode="current|next|terminus">: the station name for the playhead, the next   */
/* stop, or the end of the line. Falls back to nothing when the media has no chapters.        */
/* ------------------------------------------------------------------------------------------ */
class L10StationElement extends UIElement {
  #tracks = new PlayerController(this, playerContext, selectTextTrack);
  #time = new PlayerController(this, playerContext, selectTime);

  update(changed: PropertyValues) {
    super.update(changed);
    const cues = (this.#tracks.value?.chaptersCues ?? []) as Cue[];
    const t = this.#time.value?.currentTime ?? 0;
    const mode = this.getAttribute('mode') ?? 'current';
    let cue: Cue | undefined;
    if (mode === 'terminus') cue = cues[cues.length - 1];
    else {
      const i = cueIndexAt(cues, t);
      cue = mode === 'next' ? cues[i + 1] : cues[Math.max(0, i)];
    }
    const text = cue?.text.trim() ?? '';
    if (this.textContent !== text) this.textContent = text;
    this.toggleAttribute('data-empty', !text);
    this.closest('[data-l10-station-wrap]')?.toggleAttribute('data-empty', !text);
  }
}

/* ------------------------------------------------------------------------------------------ */
/* <l10-stops>: fills a <media-menu-content> with one <media-menu-item> per chapter, so the   */
/* timetable gets the menu's roving focus, typeahead, Escape and focus return for free.       */
/* ------------------------------------------------------------------------------------------ */
class L10StopsElement extends UIElement {
  #tracks = new PlayerController(this, playerContext, selectTextTrack);
  #time = new PlayerController(this, playerContext, selectTime);
  #i18n = new I18nController(this, i18nContext);
  #key = '';

  update(changed: PropertyValues) {
    super.update(changed);
    const cues = (this.#tracks.value?.chaptersCues ?? []) as Cue[];
    const time = this.#time.value;
    const t = time?.currentTime ?? 0;
    const current = cueIndexAt(cues, t);
    const key = cues.map((c) => `${c.startTime}|${c.text}`).join('~') + this.#i18n.locale;

    if (key !== this.#key) {
      this.#key = key;
      const t = this.#i18n.value;
      const label = t('line10.stopAt' as never, { default: 'Go to {stop}, {time}' } as never) as string;
      this.replaceChildren(
        ...cues.map((cue, i) => {
          const item = document.createElement('media-menu-item');
          item.className = 'media-menu-item l10-stop';
          item.style.setProperty('--l10-stop-i', String(i));
          const name = cue.text.trim();
          const at = formatTime(cue.startTime);
          item.setAttribute('aria-label', label.replace('{stop}', name).replace('{time}', at));
          item.innerHTML = `<span class="l10-stop-dot" aria-hidden="true"></span><span class="l10-stop-name"></span><span class="l10-stop-time" aria-hidden="true"></span>`;
          item.querySelector('.l10-stop-name')!.textContent = name;
          item.querySelector('.l10-stop-time')!.textContent = at;
          item.addEventListener('click', () => {
            this.#time.value?.seek(cue.startTime + 0.01);
          });
          return item;
        })
      );
    }
    [...this.children].forEach((el, i) => {
      el.toggleAttribute('data-passed', i < current);
      el.toggleAttribute('data-current', i === current);
      if (i === current) el.setAttribute('aria-current', 'location');
      else el.removeAttribute('aria-current');
    });
  }
}

/* ------------------------------------------------------------------------------------------ */
/* <l10-pid>: the passenger information display. One short LED line that says what the        */
/* service is doing. Visual only: the status announcer already speaks these changes.          */
/* ------------------------------------------------------------------------------------------ */
class L10PidElement extends UIElement {
  #playback = new PlayerController(this, playerContext, selectPlayback);
  #volume = new PlayerController(this, playerContext, selectVolume);
  #rate = new PlayerController(this, playerContext, selectPlaybackRate);
  #error = new PlayerController(this, playerContext, selectError);

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  update(changed: PropertyValues) {
    super.update(changed);
    const p = this.#playback.value;
    const v = this.#volume.value;
    const r = this.#rate.value?.playbackRate ?? 1;
    let state = 'ready';
    if (this.#error.value?.error) state = 'disruption';
    else if (p?.ended) state = 'terminus';
    else if (p?.waiting && p.started) state = 'approaching';
    else if (p && !p.started) state = 'ready';
    else if (p?.paused) state = 'held';
    else if (v?.muted || v?.volume === 0) state = 'quiet';
    else if (r > 1) state = 'express';
    else if (r < 1) state = 'stopping';
    else state = 'moving';
    if (this.dataset.state !== state) this.dataset.state = state;
    this.closest('.media-container')?.setAttribute('data-l10-service', state);
    this.style.setProperty('--l10-rate', String(r));
  }
}

/* ------------------------------------------------------------------------------------------ */
/* <l10-stop-keys>: [ and ] (or Shift+N / Shift+P) jump to the previous or next stop.         */
/* Supplements the Stops menu, which offers the same jump to every input method.              */
/* ------------------------------------------------------------------------------------------ */
class L10StopKeysElement extends UIElement {
  #tracks = new PlayerController(this, playerContext, selectTextTrack);
  #time = new PlayerController(this, playerContext, selectTime);
  #abort: AbortController | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.hidden = true;
    this.#abort?.abort();
    this.#abort = new AbortController();
    const root = this.closest('.media-container') ?? this.parentElement;
    root?.addEventListener('keydown', this.#onKey as EventListener, { signal: this.#abort.signal });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abort?.abort();
    this.#abort = null;
  }

  #onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    const dir = e.key === ']' || (e.shiftKey && e.key === 'N') ? 1 : e.key === '[' || (e.shiftKey && e.key === 'P') ? -1 : 0;
    if (!dir) return;
    const cues = (this.#tracks.value?.chaptersCues ?? []) as Cue[];
    const time = this.#time.value;
    if (!cues.length || !time) return;
    e.preventDefault();
    const t = time.currentTime;
    let i = cueIndexAt(cues, t);
    // "Previous" restarts the current stop unless we are within 3 s of its start.
    if (dir < 0 && i >= 0 && t - cues[i]!.startTime > 3) time.seek(cues[i]!.startTime + 0.01);
    else {
      i = Math.min(cues.length - 1, Math.max(0, i + dir));
      time.seek(cues[i]!.startTime + 0.01);
    }
  };
}


/* ------------------------------------------------------------------------------------------ */
/* <l10-station-labels>: station names printed along the line, like a line strip map.        */
/* Decorative (aria-hidden): the slider's chapter title and the Stops menu carry the names.  */
/* ------------------------------------------------------------------------------------------ */
class L10StationLabelsElement extends UIElement {
  #tracks = new PlayerController(this, playerContext, selectTextTrack);
  #time = new PlayerController(this, playerContext, selectTime);
  #key = '';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  update(changed: PropertyValues) {
    super.update(changed);
    const cues = (this.#tracks.value?.chaptersCues ?? []) as Cue[];
    const dur = this.#time.value?.duration ?? 0;
    const t = this.#time.value?.currentTime ?? 0;
    const usable = cues.length > 1 && dur > 0;
    this.toggleAttribute('data-empty', !usable);
    this.closest('.l10')?.toggleAttribute('data-l10-labels', usable);
    if (!usable) {
      if (this.childElementCount) this.replaceChildren();
      this.#key = '';
      return;
    }
    const key = cues.map((c) => `${c.startTime}|${c.text}`).join('~') + dur;
    if (key !== this.#key) {
      this.#key = key;
      this.replaceChildren(
        ...cues.map((cue, i) => {
          const el = document.createElement('span');
          el.className = 'l10-label';
          const start = (cue.startTime / dur) * 100;
          const end = ((cues[i + 1]?.startTime ?? dur) / dur) * 100;
          el.style.setProperty('--l10-label-start', `${start}%`);
          el.style.setProperty('--l10-label-width', `${end - start}%`);
          el.textContent = cue.text.trim();
          return el;
        })
      );
    }
    const current = cueIndexAt(cues, t);
    [...this.children].forEach((el, i) => {
      el.toggleAttribute('data-passed', i < current);
      el.toggleAttribute('data-current', i === current);
    });
  }
}

/*
 * Captions as a passenger information display. Media elements such as <hls-video> and
 * <mux-video> keep their <video> in a shadow root, where page CSS cannot reach ::cue,
 * so the cue style is adopted into each media element's shadow root as it appears.
 */
const CUE_CSS = `video::cue {
  background-color: rgb(5 5 6 / 0.92);
  color: #ffc04d;
  font-family: 'Barlow Semi Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif;
  font-weight: 600;
  line-height: 1.3;
}
@media (prefers-contrast: more) { video::cue { background-color: #000; color: #ffd27a; } }
@media (forced-colors: active) { video::cue { background-color: Canvas; color: CanvasText; } }`;

let cueSheet: CSSStyleSheet | null = null;
const styled = new WeakSet<ShadowRoot>();

class L10CueStyleElement extends HTMLElement {
  #observer: MutationObserver | null = null;
  #root: Element | null = null;
  #apply = () => {
    const root = this.#root;
    if (!root) return;
    if (!cueSheet) {
      cueSheet = new CSSStyleSheet();
      cueSheet.replaceSync(CUE_CSS);
    }
    for (const el of root.querySelectorAll('*')) {
      const shadow = el.shadowRoot;
      if (!shadow || styled.has(shadow) || !shadow.querySelector('video')) continue;
      shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, cueSheet];
      styled.add(shadow);
    }
  };

  connectedCallback() {
    this.hidden = true;
    this.#root = this.closest('video-player') ?? this.closest('.l10');
    if (!this.#root) return;
    this.#apply();
    this.#observer = new MutationObserver(this.#apply);
    this.#observer.observe(this.#root, { childList: true, subtree: true });
    // Shadow roots can attach after insertion; media events are a reliable late hook.
    for (const type of ['loadstart', 'loadedmetadata']) this.#root.addEventListener(type, this.#apply, true);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    for (const type of ['loadstart', 'loadedmetadata']) this.#root?.removeEventListener(type, this.#apply, true);
    this.#root = null;
  }
}

/* Flags short players (a 16:9 or 4:3 embed on a phone is 200-290px tall) so the skin can drop the
 * centre roundel instead of stacking it on the blind and the line. Width is handled by
 * container queries; the container is inline-size only, so height needs an observer. */
class L10FitElement extends HTMLElement {
  #ro: ResizeObserver | null = null;
  connectedCallback() {
    this.hidden = true;
    const root = this.closest('.l10');
    if (!root) return;
    this.#ro = new ResizeObserver(([entry]) => {
      root.toggleAttribute('data-l10-short', entry.contentRect.height < 300);
    });
    this.#ro.observe(root);
  }
  disconnectedCallback() {
    this.#ro?.disconnect();
  }
}

const define = (name: string, ctor: CustomElementConstructor) => {
  if (!customElements.get(name)) customElements.define(name, ctor);
};
define('l10-flap', L10FlapElement);
define('l10-station', L10StationElement);
define('l10-stops', L10StopsElement);
define('l10-pid', L10PidElement);
define('l10-stop-keys', L10StopKeysElement);
define('l10-station-labels', L10StationLabelsElement);
define('l10-cue-style', L10CueStyleElement);
define('l10-fit', L10FitElement);
