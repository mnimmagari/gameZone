# Move & Explore (work in progress)

A new, independent module inside GameZone: guided 15-minute animated movement adventures
(5 min warm-up, 7 min adventure, 3 min slow down). Five themes: Forest, Desert, Ocean,
Snowy Mountain, Space. Level 1 exists for all five. Levels 2 and 3 are shown as "coming soon".

## What it is, and what it is not
- All visuals are **original vector art drawn live on a `<canvas>`** at the stage's real pixel
  size (up to 3840 px wide on a 4K screen). Scenery scrolls in parallax layers, a child
  character and an animal buddy demonstrate each movement, and props (logs, branches, stars,
  bubbles, snowflakes, comets) move with the action.
- It is **not pre-rendered 4K video**. No video clips are included. Real 4K clips would need
  generated or licensed footage plus a CSP change (`media-src` currently allows only `blob:`).
- The recorded video is whatever the existing recorder produces (the `#recStage` area at
  1280 x 720, 16:9). Screen capture cannot exceed what the browser shares.

## Reused existing GameZone parts
| Need | Reused |
| --- | --- |
| Voice | `say()` (honours the Voice on/off button) |
| Music | `musicStop()`, `pickTrack()`, `musicStart()`, `musicCtxGet()`, `note()` |
| Recording | `recAsk()` dialog, `recOnStart()`, `recOnFinish()`, `recAfterSpeech()`, `recStop()`, the `#endControls` download link |
| Navigation | `page()` (now knows `move`), the `#nav` click handler |
| Frame | `#recStage` (16:9, scaled by `--s`) |

## Changes to existing code (all small and guarded by `mx&&...`)
`page()` calls `mxOnPage()` and lists `move`; `startQuizNow()` hands over when a Move &
Explore start is pending; `stageScale()` forces landscape during an adventure; the recorder
bitrate is 3.5 Mbps (instead of 6) during an adventure to keep a 15-minute file smaller; the
nav click handler opens the new page. Everything else is in one block marked
`Move & Explore` at the end of the main script, plus CSS prefixed `.mx-` / `#movePage`.

## Forest Level 1 rework (style reference: glowing twilight mushroom forest)
- New original scenery: giant spotted mushrooms that sway and pulse with the beat, glowing small
  mushrooms, light shafts, drifting mist, pollen, fireflies, pink forest path.
- New original explorer: curly hair that bounces, backpack, white tee, denim shorts, big expressive
  eyes; breathing, head sway, squash and stretch on every step, dust puffs where feet land.
- Beat-synced sparkle bursts, a gentle camera zoom, and a fox buddy that hops and wags to the beat.
- Real exercises with how-to voice lines, counting and mid-move coaching: breathing, shoulder rolls,
  arm circles, march, step-touch with clap, reach, side stretch, torso twist, high knees, step jacks
  (no jumping), squats, bounce, forward fold, and step-over / duck props. A 4-dot beat counter shows
  the tempo.
- The exercise forms are standard children's warm-up moves. The reference YouTube video could not be
  watched, so its exact choreography was not copied.
- Still procedural 2D canvas art: it cannot match a rendered 3D film look. Reaching that needs
  pre-rendered or generated animation clips.

## Rhythm-game style HUD (all themes)
Based on a dance-rhythm game reference: a glowing **silhouette "Your pose" panel** that mimics the
current move, a **"Next" pose preview**, a **beat lane** where notes slide toward a hit ring under
the child (steady beats for rhythmic moves, long bars for slow stretches), a **MOVE COMBO** counter
with cheers ("Super!", "Wow!"), and a soft screen pulse on each beat, in each theme's neon colours.
There is no fail state and no scoring of the child: the app cannot see the child's body (no camera),
so the combo only counts beats of movement and always goes up. The end screen shows "N beats moved".

## Safety
Safety screen before every start (grown-up nearby, clear space, comfy footwear, pause/stop any
time, water, skip any move). Every movement is low impact and done in place, shows an "easy
way" line, and Pause / Stop buttons are always available. WHO guidance for children and teens
(about 60 minutes of activity a day) is mentioned as context; this adventure is a gentle part
of that, not a replacement.

## External assets and licences
None. No images, video, audio or fonts were downloaded. Music and chimes come from the
existing in-app synthesiser; voice comes from the browser's speech synthesis.

## Testing status (as of this commit)
Checked in the preview browser:
- Menu opens, five animated theme previews render, theme selection works.
- Safety screen, then the recording dialog (worded for the adventure), then "No, just play".
- Stage is 16:9; welcome, 3-2-1 countdown, warm-up and adventure phases start; instruction
  card, phase chip, countdown ring, per-move bar, phase bar, buddy and the duck-under-branch
  prop render; no console errors.
- Timelines for all five themes add up to exactly 300 / 420 / 180 seconds.

**Not yet verified:** a full real-time 15-minute run; the recording with real screen share and
the downloaded video; the end/completion screen and its auto-finish; Pause/Stop; Desert, Ocean,
Snow and Space visuals during a session (only their menu previews were seen); the other
existing quizzes after this change; voice output. `?mxdebug&mxspeed=N` (test only) enables a
debug hook and an N-times faster clock.
