# Surya Namaskar for kids (next Move & Explore level): build status

Four stages, each approved before the next starts.

| Stage | Scope | Status |
| --- | --- | --- |
| 1 | One consistent 3D character: appearance, proportions, outfit | Done and approved (then rebuilt with human proportions, fingered hands and a smoother hairstyle on request) |
| 2 | Poses 1 to 4: joints, foot placement, transitions | Done |
| 3 | All 12 poses, including the reverse-side (left leg back) lunge | Done: all 12 poses and 11 transitions pass the measured checks |
| 4 | Voice instructions, breathing guidance, pose labels, timing (6 rounds in the 15 minutes), music, recording, environment (sunrise yoga room) | Built and tested in the preview: full 15-minute timeline, all voice lines, both leg orders. Not yet tested: a real screen recording and listening to the voice |

## Files
- `assets/move/yoga/yoga-kid.js`: the rigged 3D child (Three.js). Same skeleton for every pose.
- `assets/move/yoga/yoga-room.js`: the sunrise yoga room (arched alcove, shelves, vases, candle, pampas grass, palm plant, window with a rising sun, platform, mat that unrolls, water bottle). Stage 4.
- `assets/move/yoga/yoga-poses.js`: the pose engine and the 12 poses. Each pose is a spec of where the feet and hands must be and how the hips, spine and head are placed; the legs and arms are solved with two-bone IK, so planted feet and hands do not slide. Between poses everything is blended and a travelling foot is lifted.
- `tools/yoga-character-preview.html`: character turnaround (front, side, three-quarter).
- `tools/yoga-poses-preview.html`: all 12 poses, play-through, and the measured pose and transition tables.
- `tools/yoga-sequence-sheet.html`: one picture of the 12 poses in order.
- `assets/move/yoga/_v1/`: the first (clay-doll) version of the character, kept for reference.
- All pages need the local server (`python -m http.server`) to load their files.

## The 12 poses (traditional order)
1 Pranamasana (prayer) · 2 Hasta Uttanasana (raised arms) · 3 Hastapadasana (forward bend) · 4 Ashwa Sanchalanasana (lunge, one leg back) · 5 Dandasana (plank) · 6 Ashtanga Namaskara (eight-limbed) · 7 Bhujangasana (cobra) · 8 Parvatasana (mountain / downward dog) · 9 Ashwa Sanchalanasana (lunge, other leg back) · 10 Hastapadasana · 11 Hasta Uttanasana · 12 Pranamasana.
Breath: out, in, out, in, hold (plank), out and hold (eight-limbed), in, out, in, out, in, out. The plank version of the sequence is used (Dandasana at 5, Parvatasana at 8).

## Measured checks (what "pass" means)
Feet and hands that must touch the mat read 0 to 3 cm from it; nothing sinks more than 2 cm into the mat; every solved foot and hand lands within 2.5 cm of its target; the back knee in the lunges is within 5.5 cm of the mat; in transitions a planted foot or hand drifts less than 3 cm.

## Known compromises
- Pose 6 (eight-limbed) keeps the chest about 11 cm above the mat, because the hands, knees and chin cannot all touch with a child's arm length; chin and knees are close to the mat.
- Poses 4 and 9: the torso leans forward with hands on the mat, so they read as a low crawling lunge rather than an upright adult lunge.
- In the forward bend (3, 10) the ponytail hangs over her head.
- Poses 2 and 11 use arms straight up beside the ears (palms facing); palms joined overhead pushed the arms through her head.

## Stage 4: the level inside Move & Explore (theme card "Surya Namaskar")
Code is in `index.html` (search `MXY` and `mxY`). It needs WebGL; if 3D cannot start, the child sees a short message and a Back button (there is no 2D version).

### Timeline (exactly 15:00, same 5 + 7 + 3 as every adventure)
- Warm-up 5:00: stand tall (24 s), three slow breaths with arms (36 s), the 12 poses taught one at a time (12 x 14 s), slow practice (24 s), breathing with the arms (48 s).
- Sun salutations 7:00: six rounds of the 12 poses at 5 s each (60 s per round), a 30 s water break after round 2 and a 30 s rest break after round 4.
- Slow down 3:00: reach up (20 s), forward fold (30 s), rise (20 s), calm breathing with eyes closed (80 s), thank the sun and drink water (30 s).

### Alternating legs
The foot that steps forward in the lunge changes every round: round 1 left, 2 right, 3 left, 4 right, 5 left, 6 right. In each round the second lunge (pose 9) uses the other foot. The pose engine swaps the pose 4 and pose 9 specs on even rounds; the HUD and the voice say which foot goes first.

### Voice (the existing cartoon kid voice, a little higher and slower for yoga)
- Get-ready checklist, read aloud step by step: roll out the mat on a flat clear floor, water bottle next to the mat, bare feet, comfy clothes and tied-back hair, tell a grown-up, rest any time (two breaks, pause button), stand at the front of the mat. The mat unrolls on screen while this is spoken. "I am ready" skips ahead.
- Warm-up: every pose is explained with its breath. Main rounds: round announcement, then a pose cue with the breath at every pose (full sentences in rounds 1 and 2, short ones after).
- Breaks and cool-down: water, rest, breathing counts (in 4, hold 2, out 4 or 6), wiggle fingers, thank the sun, sip water and rest.
- Voice off: everything is still on screen.

### On screen
Round counter, which foot leads, 12 numbered pose dots, pose name (English and Sanskrit), breath cue (in, out, out and hold), next pose, easy way for every pose, the usual phase ring and bars. The sun in the window rises over the 15 minutes; the water bottle glows during breaks.

### Recording
Uses the existing recorder unchanged (it records the stage only, no menus). The 3D canvas is part of the stage. Not yet tested with a real screen share.

### Debug
Open `index.html?mxdebug&mxspeed=30` to run at 30x; `MXDEBUG.validate()` lists the phase lengths of every theme (sun is 300/420/180).

## Joint limits and transition paths
The pose solver keeps every joint inside human range, in the poses and in every blended frame between them: wrist about 75 degrees forward, 80 back and 28 sideways; elbow and knee fold no further than about 150 degrees; ankle about 25 degrees up and 75 down. Kneeling feet use the toes-tucked angle; the cobra uses flat feet with straight legs and knees down. Hands that travel far (arms up to the floor, hands to the chest) swing on an arc around the shoulder instead of cutting through the head or body. `tools/yoga-transitions-sheet.html` shows the frames inside the main transitions. The audit (all 12 poses, all transitions, and the get-ready actions, every frame) reports no joint outside these limits.

## Calm exercise screen, three modes, sound (latest)
- **Screen:** during the exercise only a small chip ("Round 2 of 6 · pose 5 of 12"), the pose name with one short line, and a thin progress line are drawn on the stage. Pause, Stop and the Voice and Music volume sliders sit below the stage, so they are not in recordings. No butterflies, rainbow, dust, confetti, candy panels or side panels.
- **Camera:** front view for prayer and raised arms, three-quarter for the forward bends, side view for lunge, plank, eight-limbed, cobra and mountain. The camera lowers for floor poses so the whole child stays in frame. Rendering is capped at 1920 px wide for this level.
- **Modes** (chosen on the menu under the Surya Namaskar card): **Learn** (3 slower rounds, every pose explained), **Follow** (6 rounds, key cues only after round 1), **Practice** (6 rounds, round announcements and breaks only). All modes keep 5 + 7 + 3 minutes.
- **Voice:** cues are sparse; the lunge foot is also written on screen. Volume sliders for voice and music are independent and remembered. Chimes are one soft tone.
- **Poses:** pose 5 is now the plank (Dandasana). The lunge is more upright with the back leg straight and the knee lifted a few centimetres.
- **Not done yet (optional):** replay a single pose and a demonstration speed control; recorded child-voice clips.
