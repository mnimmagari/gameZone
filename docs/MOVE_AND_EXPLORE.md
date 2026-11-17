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

## Guided breathing
Every "breathe" movement shows a breathing orb with a seconds countdown and the child's arms follow
the same timing: **breathe in 4 s, hold 2 s, let it out 4 s** in the warm-up (6 s out in the slow-down).
The guide says "Breathe in.", "Hold.", "Now, slowly breathe out." at each stage; the first time, it
first explains the pattern. The first seconds show "Get ready" so the explanation is finished before
the first breath.

## Surya Namaskar (6th adventure, 3D yoga)
See docs/SURYA_NAMASKAR.md. Its own scene and character files are loaded only when it is played.

## Real-time 3D (Forest only for now)
Forest Level 1 now plays in real-time 3D using Three.js (MIT, `assets/vendor/three-mx.js`, licence in
`assets/vendor/THREE-LICENSE.txt`, loaded only when you start Forest):
- A 3D glowing mushroom forest: giant spotted mushrooms, glowing small ones, tree trunks, fireflies,
  light shafts, a path that scrolls, props (log, glowing vine, orbs, stars) and bloom lighting.
- An original 3D child and a fox buddy built from shapes (not a downloaded model). The child's joints
  are driven by the same exercise poses as before, so every movement keeps its exact form.
- The beat lane, pose panel, combo, voice, music and recording work unchanged on top of it.
- Resolution adapts to the screen (up to 4K where the device can keep up; lowers on slower machines,
  then drops the glow). Add `?mx3d=0` to the address to force the 2D version. If WebGL or the library
  file fails, the 2D version plays automatically. The other four themes are still 2D.
- AI video backdrop: put `bg.mp4` in `assets/move/forest/` with `"bgVideo": {"src": "bg.mp4"}` in
  `manifest.json` (see `docs/MOVE_ASSETS.md`); the 3D forest then plays it behind the 3D scene.
- The page security policy now also allows this site's own script file (`script-src 'self'`).
- Not yet done: swapping in a downloaded rigged model (for example a Mixamo character), 3D versions of
  the other four themes, a full real-time 15-minute run, and a real recording test of the WebGL view.

## Recording crop fix
When recording with voice (screen share), the recorder finds the stage by flashing magenta corner
squares and scanning the shared video for magenta. Glowing magenta/pink in the neon scene and HUD
fooled that scan, so the stage position fell back to a rough guess and the video was cropped.
`recCalibrate()` now (1) takes a marker-free reference frame first and ignores magenta already
there, (2) accepts a result only if it has the stage's own 16:9 shape, (3) retries up to 20 times,
and (4) the adventure freezes its picture while measuring. Proven with a synthetic frame test
(old method failed on the neon scene, new method found the exact stage). Not yet confirmed on a
real screen share, because the preview browser cannot do screen capture.

## Real art support
Layered scene pictures, background video, per-movement pose sheets or green-screen clips can be
dropped into `assets/move/<theme>/` (see `docs/MOVE_ASSETS.md`, including AI prompts). Tested with
placeholder art (removed). The page security policy now also allows this site's own images,
media and manifest files. No real art is included, so the built-in drawing is still what plays.
Built-in drawing got more depth: blurred far layers, framing ferns, a glow halo behind the child,
tube shading on limbs, hair highlights and mushroom gills.

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
