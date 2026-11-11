# LINE 10: design spec

## Thesis
The first films were *phantom rides*: a camera bolted to the front of a train or cable car.
LINE 10 (Video.js **v10**, so Line 10) is a player built like the line they rode.

Wayfinding signage is the most battle-tested accessible design system there is. It has to be
read at a glance, by anyone, in any light, while things move past it. A player's controls have
the same job over moving video. So every control is a piece of transit signage that does what
it looks like it does.

## Competitive position (62 entries reviewed 2026-11-11)
- Most entries put the player inside a big illustrated scene (phone, arcade, truck art,
  picnic, pop-up book, museum case). Impressive, but you couldn't drop one onto someone
  else's site.
- LINE 10 is a real skin: flat signage plates over the video, themable by "line colour",
  responsive by container query. You could ship it on a podcast, a museum or a news site.
- Unused metaphor: nobody has done transit or wayfinding. (Voyage uses a treasure-map route,
  which is antique and illustrative. This is Swiss signage.)

## Metaphor map (each one is a real control or real state)
| Player | Line 10 |
|---|---|
| Seek bar | The line diagram: played = solid line colour, buffered = laid track, the rest = planned |
| Chapters (VTT) | Stations: dots on the line, names on wide players, interchange ring on the current one |
| Thumb | "You are here" marker |
| Scrub preview | Station name sign + thumbnail + time |
| Time | Split-flap board (flips digit by digit, snaps with reduced motion) |
| Title / last chapter | Destination blind: "towards Ferry Building" |
| Chapter list | "Stops" timetable popover; Enter jumps to a stop. `[` `]` = previous/next stop |
| Speed menu | Service pattern: 0.5× Stopping · 1× Local · 1.25× Limited · 1.5× Express · 2× Rapid |
| Buffering | "Approaching", amber LED dots |
| Ended | "Terminates here", ride-again roundel |
| Muted | "Quiet carriage" on the LED strip |
| Error | "Service disruption": hazard-striped plate with title, message and dismiss |
| Captions | Passenger information display: amber text on a solid black plate |
| Seek/volume/status indicators | Roundels |

## Layout
- **Top** (with the controls): line bullet `10`, destination blind (towards {last stop}),
  media title. Right: PiP, AirPlay or Cast when available.
- **Bottom plate** (solid signage black): row 1 = line diagram (time slider). Row 2 = play
  roundel, back 10, fwd 10, volume (mute + vertical branch-line slider), flap time, current
  station readout · spacer · Stops, Captions, Service (speed), Settings (quality, audio,
  captions), Fullscreen.
- **Centre**: play roundel only before first play / when paused on touch.
- Container queries: ≥ 48rem full labels; 30–48rem station names hidden except the
  current one, seek buttons hidden; < 30rem compact row (play, time, CC, menu, fullscreen),
  44px targets.

## Type
- Barlow / Barlow Semi Condensed (OFL; drawn from California highway and transit signage) for
  everything, tabular numerals for time.
- Doto (OFL, dot matrix) only for the LED status strip, never for captions.
- Fallback: the system UI stack.

## Colour (tokens)
- `--l10-plate` #0E0F11 (signage black), `--l10-ink` #FFFFFF, `--l10-ink-2` #C9CDD3
- `--media-accent-color` = line colour. Default vermilion #F2542D. Demo lines: Blue
  #1F6FEB, Green #00995E, Gold #FFC21A (black text via contrast-color), Violet #8B5CF6.
- `--l10-led` #FFB21E amber.
- Text on plates ≥ 7:1, so it's legible over any frame because plates are ~94% opaque, not glass.

## Shape
- Plates: radius 8px; nested elements follow outer = inner + padding.
- Roundels: circles. Line: 6px with round caps. Terminus: a perpendicular end bar.

## Motion (all through tokens, all 0 under reduced motion)
- Controls hide: 180ms opacity, show instantly.
- Split-flap: 220ms per digit, top half folds down.
- Marker glides 120ms when seeking by keyboard; no glide while dragging.
- Menus grow from their trigger (transform-origin = trigger side), closing is faster than opening.

## Accessibility
- Built on Video.js components for every standard control (roles, labels, keys, announcer).
- Custom parts (flap, stops, station readout, LED): aria-hidden visuals that mirror
  accessible components, or real buttons with names. The Stops list is a popover of buttons
  with arrow-key roving focus and Escape back to the trigger.
- One focus ring everywhere: 2px white inside 2px black, so it shows on any frame.
- prefers-reduced-motion, prefers-reduced-transparency, prefers-contrast: more, forced-colors.
- Every visible string goes through Video.js i18n tokens (`line10.*`), translated for
  es, fr, de, ja, ar. RTL mirrors the row; the line direction follows the slider.

## Demo media (all public domain)
1. *A Trip Down Market Street* (Miles Brothers, 1906): bright daylight, cable car. Original
   solo-piano ragtime score.
2. *Interior N.Y. Subway, 14th St. to 42nd St.* (Biograph, 1905, Library of Congress): dark
   tunnel, then bright platforms. Original dark piano score.
3. NASA *Cosmic Dawn* (Mux): modern colour footage with Mux storyboard thumbnails.
