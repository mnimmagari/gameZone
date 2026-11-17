# Move & Explore: real art (images and clips)

The built-in drawing is stylised 2D code art. For the look of a rendered 3D film (like the glowing
mushroom-forest reference image), generate the art with an AI image/video tool or a 3D tool and drop
it into `assets/move/<theme>/`. The app uses it automatically and keeps the combo, beat lane, pose
panel, voice, music and recording on top. No code change is needed. Themes: `forest`, `desert`,
`ocean`, `snow`, `space`. If a theme has no `manifest.json`, the built-in drawing is used.

Only use art you have the right to use (check your generator's terms). Do not use characters,
scenes or audio from films or YouTube videos; use them only as a style reference.

## Folder layout
```
assets/move/forest/
  manifest.json
  bg.png                 scene picture(s)
  bg-near.png            optional foreground layer (drawn in front of the child)
  bg.mp4                 optional animated background clip (muted, loops)
  moves/kneeLift.png     pose sheet for one movement (PNG with transparent background)
  moves/stepJack.mp4     or a green-screen clip for one movement
```

## manifest.json
```json
{
  "version": 1,
  "buddy": false,
  "layers": [
    { "src": "bg.png", "pan": true, "panSpeed": 0.05 },
    { "src": "mist.png", "speed": 0.3, "h": 540 }
  ],
  "foreground": [ { "src": "bg-near.png", "speed": 1.0 } ],
  "bgVideo": { "src": "bg.mp4" },
  "character": {
    "height": 300, "anchorY": 1,
    "moves": {
      "kneeLift": { "sheet": "moves/kneeLift.png", "cols": 4, "rows": 2, "frames": 8, "fps": 10 },
      "stepJack": { "clip": "moves/stepJack.mp4", "scale": 1.0 }
    }
  }
}
```
| Field | Meaning |
| --- | --- |
| `layers[]` | Drawn back to front. `pan: true` slowly pans a wide picture (best for AI panoramas). Without `pan`, the picture tiles horizontally and scrolls at `speed` (0 = still, 1 = ground speed); it must tile seamlessly. `h` = drawn height in the 960 x 540 stage (default 540). |
| `foreground[]` | Same as layers, but drawn after the child (grass, leaves, glow). Use transparent PNGs. |
| `bgVideo` | Animated background clip, drawn before `layers`. Use H.264 MP4 or WebM, about 1920 x 1080, 10 to 20 s, loops. |
| `buddy` | `false` hides the built-in fox/camel/penguin buddy. |
| `character.height` | Drawn height of the child in stage pixels (about 260 to 300 looks right). |
| `moves.<id>` | Art for one movement. Movements without art fall back to the built-in child. `sheet` = PNG grid (`cols` x `rows`, `frames` used, `fps`). `clip` = video on a pure green (#00FF00) background, keyed out live. |

Movement ids used by Forest Level 1: `breathe`, `shoulderRoll`, `armCircle`, `march`, `stepTouch`,
`reach`, `sideBend`, `twist`, `kneeLift`, `stepJack`, `stepOver`, `duck`, `squat`, `bounce`,
`walkSlow`, `fold`. (All ids: see `MX_MOVES` in `index.html`.)

## Image sizes
- Scene picture: 3840 x 1080 or wider (ratio 3:1 or more), no characters, an empty path in the middle,
  keep the top 35% calm (the instruction card sits there) and the bottom 15% simple (the beat lane).
- Pose sheet: frames about 256 x 384, transparent background, same character, same camera, feet on the
  same baseline, an 8 to 12 frame loop that returns to the first pose.
- Clip: 16:9, locked camera, full body in frame, plain bright green background, 3 to 6 s seamless loop.

## Prompts (adapt to your tool; keep the character description identical everywhere)
**Character (generate once, reuse as the reference image for every move):**
> 3D animated children's film style, a joyful 8-year-old girl explorer with voluminous dark curly
> hair, big expressive brown eyes, warm tan skin, white t-shirt with a colourful rainbow emblem and
> pink-trimmed sleeves, denim shorts, white socks and sneakers, small maroon backpack with teal
> straps. Full body, front view, neutral standing pose, soft studio lighting, plain background.

**Forest scene plate (matches the reference image):**
> 3D animated film style enchanted twilight forest, giant red spotted mushrooms with glowing gills,
> small bioluminescent mushrooms in cyan, magenta and orange, fireflies, soft blue mist, mossy
> ground, a winding pink-brown dirt path in the centre, volumetric light shafts, rich teal and
> purple colours, very detailed, wide panorama 3:1, no people, no animals, no text, empty space in
> the upper third.

**Background clip (optional, for a living background):**
> Same scene, locked camera, gentle motion only: fireflies drifting, mushrooms glowing and pulsing,
> mist slowly moving, leaves swaying. Seamless 12 second loop. No characters.

**Movement clip (one per movement, same character reference image):**
> The girl explorer from the reference image, full body, front view, locked camera, plain bright
> green screen background (#00FF00), doing [KNEE LIFTS: lifts her knees high alternately while
> pumping bent arms] at a steady rhythm of about 110 beats per minute, smiling, 5 second seamless
> loop, no camera movement.

Movements to describe: shoulder rolls, big arm circles, marching on the spot, step-touch with a clap,
reaching both arms up high, side stretch with one arm over the head, gentle torso twist, high knees,
step jacks without jumping (one foot steps out with arms up, then back in), stepping over an
imaginary log, ducking under a branch, squat to a low stool position, soft knee bounce, slow walking,
slow forward fold, deep breath with arms rising.

## Turning a clip into a pose sheet (needs ffmpeg on your computer)
```
ffmpeg -i kneeLift.mp4 -t 0.8 -vf "fps=10,colorkey=0x00ff00:0.35:0.1,scale=256:-1,tile=4x2" -frames:v 1 moves/kneeLift.png
```
This keys out the green, takes 8 frames and tiles them 4 x 2. Or skip the sheet and use the clip
directly (`"clip"`); the sheet is lighter and cleaner on edges.
