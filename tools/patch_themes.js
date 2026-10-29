/* One-off patch: 14 quiz themes (3 layouts), gallery picker, realistic 3D images. Run from project root: node tools/patch_themes.js <emoji-map.json> */
const fs=require('fs');
const p='index.html';let s=fs.readFileSync(p,'utf8');
const map=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
/* questions + what each one shows (photo with credit, 3D icon, or nothing) */
const plan=require('./visual_plan.js'),photos=require('./photos.json');
const colors={x_evs:'#22c55e',x_space:'#7c4dff',x_animals:'#ff8a00',x_eco:'#00c2a8',x_tech:'#2979ff',x_india:'#ff4d6d',x_road:'#ffc400',x_health:'#ff5c8a'};
const bank=require('./explore_bank.js').concat(require('./explore_bank2.js'));
bank.forEach(t=>{t.color=colors[t.id];t.qs=t.qs.map((q,i)=>{const sp0=plan[t.id][i],rev=sp0.startsWith('!'),sp=rev?sp0.slice(1):sp0,ph=photos[t.id][i];return[q[0],q[1],q[2],q[3],sp==='N'?'':q[4],ph&&ph.src?{s:ph.src}:0,rev&&sp!=='N'?1:0]})});
const P='body #quizPage #recStage .quiz-panel[id="quizPanel"]';
const PL='body #quizPage #recStage:not(.portrait)>.quiz-panel[id="quizPanel"]:not(.hidden)';
const PP='body #quizPage #recStage.portrait>.quiz-panel[id="quizPanel"]:not(.hidden)';

/* id, label, layout, css variables, extra css (relative to .xt-<id>) */
const THEMES=[
['candy','Candy Pop','split','--xbg:linear-gradient(160deg,#ff8ad8,#ffd86b);--xq:#ff2e93;--xnum:#ff2e93;--x1:#ff3d81;--x2:#ffb300;--x3:#00b8ff;--x4:#8e44ff;--xink:#4a1042;--xfill:#ff3d81','.answer{border-radius:999px;box-shadow:0 6px 0 var(--c)}'],
['aurora','Aurora Split','split','--xbg:repeating-conic-gradient(from 0deg at 55% 75%,#ffffff12 0 8deg,transparent 8deg 16deg),linear-gradient(155deg,#0fb5ae,#4b3fc4);--xqbg:linear-gradient(90deg,#ff5d73,#ff2f92);--xqink:#fff;--xqts:0 3px 0 #0006;--xq:#9ff3ff;--xnum:#c6f432;--xnumink:#1c2b00;--x1:#c8f4ff;--x2:#c8f4ff;--x3:#c8f4ff;--x4:#c8f4ff;--xmix:100%;--xink:#12264d;--xlet:#ff5d73;--xletink:#fff;--xbd:#fff;--xfill:repeating-linear-gradient(115deg,#c6f432 0 14px,#d9ff62 14px 28px)','.answer{border-radius:16px}.answer:before{border-radius:12px!important}.question{border-radius:26px!important}'],
['cloud','Cloud Pop','grid','--xbg:radial-gradient(circle at 12% 22%,#ffffff55 0 42px,transparent 43px),radial-gradient(circle at 88% 74%,#ffffff44 0 58px,transparent 59px),radial-gradient(circle at 60% 12%,#ffffff33 0 30px,transparent 31px),linear-gradient(#4fb3ff,#2f7bff);--xqbg:transparent;--xqink:#fff;--xqts:0 3px 0 #123a9c;--xq:#fff;--xnum:#ff8a3d;--x1:#fff;--x2:#fff;--x3:#fff;--x4:#fff;--xmix:100%;--xink:#12306b;--xlet:#2f7bff;--xletink:#fff;--xbd:#fff;--xfill:#ff8a3d','.question{border-color:transparent!important;box-shadow:none!important}.answer{border-radius:22px;box-shadow:0 6px 0 #0003}'],
['sunbeam','Sunbeam','grid','--xbg:repeating-conic-gradient(from 0deg at 50% 110%,#ffffff1c 0 6deg,transparent 6deg 12deg),linear-gradient(#ffd166,#ff9f5a);--xqbg:#fff;--xqink:#5a2a00;--xq:#7a3b00;--xnum:#0f766e;--xnumink:#fff;--x1:#0f766e;--x2:#0f766e;--x3:#0f766e;--x4:#0f766e;--xmix:100%;--xink:#fff;--xats:0 2px 0 #00403a;--xlet:#ffd166;--xletink:#5a2a00;--xbd:#ffe9a8;--xfill:#0f766e','.answer{border-radius:14px;box-shadow:0 5px 0 #00403a}'],
['midnight','Midnight Plum','stack','--xbg:linear-gradient(180deg,#1d0b3b,#4a0f5c 70%,#2a0a3a);--xqbg:#fff7ea;--xqink:#2a0a3a;--xq:#ff4fa3;--xnum:#ff4fa3;--xnumink:#fff;--x1:#fffaf2;--x2:#fffaf2;--x3:#fffaf2;--x4:#fffaf2;--xmix:100%;--xink:#0e7c86;--xlet:#2a0a3a;--xletink:#fff;--xbd:#ffd6ec;--xfill:#ff4fa3','.answer{border-radius:14px}.question{border-radius:22px!important}'],
['ember','Ember Teal','split','--xbg:repeating-conic-gradient(from 0deg at 50% 100%,#ffffff10 0 7deg,transparent 7deg 14deg),linear-gradient(#0f2a3d,#1b5e6b);--xqbg:transparent;--xqink:#fff;--xqts:0 3px 0 #04141f;--xq:#ffb020;--xnum:#ffb020;--xnumink:#3b2300;--x1:#fff;--x2:#fff;--x3:#fff;--x4:#fff;--xmix:100%;--xink:#0f2a3d;--xlet:#ffb020;--xletink:#3b2300;--xbd:#fff;--xfill:repeating-linear-gradient(115deg,#ffb020 0 14px,#ffc75a 14px 28px)','.question{border-color:transparent!important;box-shadow:none!important}.answer{border-radius:999px;box-shadow:0 5px 0 #0004}.answer:before{border-radius:50%!important}'],
['lemon','Lemon Zest','grid','--xbg:linear-gradient(#fff6bf,#ffe98a);--xqbg:#fff;--xqink:#b45309;--xq:#ff9f1c;--xnum:#ff9f1c;--xnumink:#fff;--x1:#fff;--x2:#fff;--x3:#fff;--x4:#fff;--xmix:100%;--xink:#3a2a10;--xlet:#ffd9a0;--xletink:#b45309;--xbd:#ff9f1c;--xfill:#ff9f1c','.answer{border-radius:22px}.question{border-radius:24px!important}'],
['jungle','Jungle Fun','grid','--xbg:linear-gradient(160deg,#7be495,#25c7b5);--xq:#0f9d58;--xnum:#0f9d58;--x1:#ff7a00;--x2:#ffd400;--x3:#00c853;--x4:#2979ff;--xink:#0b3d2e;--xfill:#ffd400','.answer{border-radius:10px;border-width:5px!important;box-shadow:5px 5px 0 var(--c);transform:rotate(-.6deg)}.answer:nth-child(even){transform:rotate(.6deg)}'],
['sunset','Sunset Show','stack','--xbg:linear-gradient(160deg,#ff9966,#ff5e62 55%,#8e44ad);--xq:#ffd54f;--xnum:#ffd54f;--xnumink:#4a1a00;--x1:#ff4081;--x2:#ffab00;--x3:#7c4dff;--x4:#00b8d4;--xink:#3a0f3f;--xfill:#ffd54f','.answer{border-radius:16px;box-shadow:0 5px 0 var(--c)}'],
['ocean','Ocean Splash','grid','--xbg:linear-gradient(180deg,#a8edff,#2bb3ff 70%,#0077ff);--xq:#0091ff;--xnum:#0091ff;--x1:#00b8ff;--x2:#00d96b;--x3:#ffd400;--x4:#ff6e9c;--xink:#06335c;--xfill:#00d96b','.answer{border-radius:46px;box-shadow:inset 0 8px 0 #fff8,0 6px 0 color-mix(in srgb,var(--c) 70%,#003)}'],
['neon','Neon Night','grid','--xbg:radial-gradient(circle at 20% 10%,#2d2a8a,#14123d 70%);--xq:#00f0ff;--xqbg:#1d1a52;--xqink:#fff;--xnum:#00f0ff;--xnumink:#06103a;--x1:#00f0ff;--x2:#ff2bd6;--x3:#c6ff00;--x4:#ff9100;--xink:#fff;--xbase:#0c0a2e;--xmix:14%;--xvis:#12104a;--xfill:#ff2bd6','.answer{border-radius:14px;box-shadow:0 0 16px var(--c),inset 0 0 12px color-mix(in srgb,var(--c) 40%,transparent)}.answer.correct{color:#073d1b!important}.answer.wrong{color:#5b0909!important}'],
['sticker','Comic Sticker','grid','--xbg:#ffe94d;--xq:#111;--xnum:#111;--xnumink:#ffe94d;--x1:#ff5c8a;--x2:#4dd0ff;--x3:#7cff6b;--x4:#b388ff;--xink:#111;--xbd:#111;--xfill:#ff5c8a','.answer{border-radius:14px;box-shadow:6px 6px 0 #111}.answer:nth-child(odd){transform:rotate(-1deg)}.answer:nth-child(even){transform:rotate(1deg)}'],
['gameshow','Game Show','stack','--xbg:radial-gradient(circle at 50% 0,#2a52ff,#0b1450 72%);--xqbg:linear-gradient(#ffd54a,#ff9f00);--xqink:#1a1233;--xq:#ffe27a;--xnum:#ffd54a;--xnumink:#1a1233;--x1:#1f3bd6;--x2:#1f3bd6;--x3:#1f3bd6;--x4:#1f3bd6;--xmix:100%;--xink:#fff;--xlet:#ffd54a;--xletink:#1a1233;--xbd:#ffd54a;--xfill:#ffd54a','.answer{border-radius:999px;box-shadow:0 0 14px #5b7bff88}.answer:before{border-radius:50%!important}'],
['pastel','Soft Pastel','grid','--xbg:linear-gradient(160deg,#c9f7e6,#ffe3d1);--xqbg:#fff;--xqink:#3d3a6b;--xq:#ff9aa2;--xnum:#ff9aa2;--x1:#ffb3ba;--x2:#ffdfba;--x3:#baffc9;--x4:#bae1ff;--xmix:100%;--xink:#3d3a6b;--xbd:#fff;--xfill:#ff9aa2','.answer{border-radius:26px;box-shadow:0 5px 0 #0001}']
];
const LAYOUT_LABEL={grid:'4 tiles',stack:'Rows',split:'Picture + answers'};
const swatch=t=>{const m=t[3].match(/--xbg:((?:[^;(]|\([^)]*\))*);/);return m?m[1]:'#ccc'};
/* swatches: simple two-colour gradients for the gallery (the real backgrounds are busy) */
const SW={candy:'linear-gradient(135deg,#ff8ad8,#ffd86b)',aurora:'linear-gradient(135deg,#0fb5ae,#4b3fc4)',cloud:'linear-gradient(135deg,#4fb3ff,#fff)',sunbeam:'linear-gradient(135deg,#ffd166,#0f766e)',midnight:'linear-gradient(135deg,#1d0b3b,#ff4fa3)',ember:'linear-gradient(135deg,#0f2a3d,#ffb020)',lemon:'linear-gradient(135deg,#fff6bf,#ff9f1c)',jungle:'linear-gradient(135deg,#7be495,#25c7b5)',sunset:'linear-gradient(135deg,#ff9966,#8e44ad)',ocean:'linear-gradient(135deg,#a8edff,#0077ff)',neon:'linear-gradient(135deg,#14123d,#ff2bd6)',sticker:'linear-gradient(135deg,#ffe94d,#ff5c8a)',gameshow:'linear-gradient(135deg,#0b1450,#ffd54a)',pastel:'linear-gradient(135deg,#c9f7e6,#ffb3ba)'};
const META={};THEMES.forEach(t=>META[t[0]]=[t[1],SW[t[0]],t[2]]);

const rep=(o,n)=>{const i=s.indexOf(o);if(i<0)throw new Error('missing: '+o.slice(0,70));if(s.indexOf(o,i+1)>=0)throw new Error('dup: '+o.slice(0,70));s=s.slice(0,i)+n+s.slice(i+o.length)};

/* ---------- CSS ---------- */
const cssStart=s.indexOf('/* Explore & Learn: bright menu');
const cssEnd=s.indexOf('.vis-row{display:flex;',cssStart);
if(cssStart<0||cssEnd<0)throw new Error('css block not found');
let css=`/* Explore & Learn: bright menu, theme gallery, 14 quiz themes, 3 layouts, highlighted diagrams */
#nav button[data-topic^="x_"]{border-left:6px solid var(--xc,#8a7ddd);background:color-mix(in srgb,var(--xc,#8a7ddd) 12%,#fff);font-weight:800}
#nav button[data-topic^="x_"].active{background:var(--xc,#8a7ddd);color:#fff}
.topic-card[style*="--xc"]{border:3px solid var(--xc);background:linear-gradient(160deg,#fff,color-mix(in srgb,var(--xc) 22%,#fff));box-shadow:0 6px 0 color-mix(in srgb,var(--xc) 55%,transparent)}
#xtPicker{margin:6px 0 14px;padding:14px;border-radius:20px;background:#fff;border:3px dashed #c9b8ff}
#xtPicker.hidden{display:none}
.xt-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(122px,1fr));gap:10px;margin-top:10px}
.xt-chip{display:flex;flex-direction:column;align-items:stretch;gap:5px;padding:6px;border-radius:16px;background:#f6f3ff;font-weight:800;color:#3b2f6b;border:3px solid transparent;text-align:center;font-size:13px}
.xt-chip i{display:block;height:46px;border-radius:11px;background:var(--sw);box-shadow:inset 0 0 0 2px #fff,0 0 0 2px #0002}
.xt-chip small{font-weight:700;opacity:.65;font-size:11px}
.xt-chip.on{border-color:#6d4dff;background:#fff;box-shadow:0 4px 0 #6d4dff55}
${P}.xt{background:var(--xbg)}
${P}.xt .question{background:var(--xqbg,#fff)!important;color:var(--xqink,#2b1f4d)!important;text-shadow:var(--xqts,none);border:4px solid var(--xq)!important;box-shadow:0 7px 0 color-mix(in srgb,var(--xq) 50%,transparent),0 0 22px color-mix(in srgb,var(--xq) 40%,transparent)}
${P}.xt #questionCount{background:var(--xnum,var(--xq))!important;border-color:var(--xnum,var(--xq))!important;color:var(--xnumink,#fff)!important}
${P}.xt .progress-fill{background:var(--xfill,var(--x2))!important}
${P}.xt .answer{background:var(--bg)!important;border:4px solid var(--xbd,var(--c))!important;color:var(--xink)!important;text-shadow:var(--xats,none);font-weight:900}
${P}.xt .answer:before{background:var(--xlet,var(--c))!important;color:var(--xletink,#fff)!important}
${P}.xt .answer{white-space:normal!important;text-align:center;line-height:1.1;text-wrap:balance;padding-top:3px!important;padding-bottom:3px!important}
${[1,2,3,4].map(n=>`${P}.xt.xt .answer:nth-child(${n}){--c:var(--x${n});--bg:color-mix(in srgb,var(--x${n}) var(--xmix,26%),var(--xbase,#fff))}`).join('\n')}
${P}.xt.xt .answer.correct{--c:#12b550!important;--bg:#c9ffdc!important;--xbd:#12b550;color:#073d1b!important;text-shadow:none}
${P}.xt.xt .answer.wrong{--c:#ff3b3b!important;--bg:#ffd3d3!important;--xbd:#ff3b3b;color:#5b0909!important;text-shadow:none}
/* layouts: grid = 2x2 tiles (default), stack = one row per answer, split = picture left and answers right (landscape only) */
${PL}.xl-stack .answers,${PP}.xl-stack .answers,${PP}.xl-split .answers{grid-template-columns:1fr!important}
${PL}.xl-split{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:56px 112px minmax(0,1fr) 34px;column-gap:18px}
${PL}.xl-stack{grid-template-columns:minmax(0,.62fr) minmax(0,1.38fr);grid-template-rows:56px 112px minmax(0,1fr) 34px;column-gap:18px}
${PL}.xl-split>.vid-banner,${PL}.xl-split .question,${PL}.xl-split .feedback,${PL}.xl-stack>.vid-banner,${PL}.xl-stack .question,${PL}.xl-stack .feedback{grid-column:1/-1}
${PL}.xl-split .visual,${PL}.xl-stack .visual{grid-row:3;grid-column:1}
${PL}.xl-split .answers,${PL}.xl-stack .answers{grid-row:3;grid-column:2;grid-template-columns:1fr!important}
${PL}.xl-split .feedback,${PL}.xl-stack .feedback{grid-row:4}
/* realistic 3D picture, framed by the theme colour so it fits every look */
${P} .visual .ximg{height:100%;max-height:100%;max-width:100%;width:auto;aspect-ratio:1;object-fit:contain;flex:0 1 auto;min-height:0;filter:drop-shadow(0 8px 8px #0005)}
${P} .visual:has(.curriculum-diagram,.vis-row,svg,img){border:5px solid var(--xq,var(--level-accent,#8a7ddd))!important;background:var(--xvis,#fff)!important;box-shadow:0 0 0 6px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 25%,transparent),0 0 26px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 55%,transparent)!important;animation:xDiag 2.4s ease-in-out infinite}
${P} .visual .curriculum-diagram:has(.ximg){height:100%;width:100%;min-height:0;min-width:0;padding:4px;display:flex;align-items:center;justify-content:center}
${P} .visual .curriculum-diagram:not(:has(.ximg)){max-width:100%}
/* real photos: rounded card that fills the frame height, credit tucked in the corner */
${P} .visual .curriculum-diagram{position:relative}
${P} .visual .ximg.xphoto{width:100%;height:100%;max-width:none;max-height:none;aspect-ratio:auto;object-fit:cover;object-position:center;border-radius:0;box-shadow:none;display:block}
${P}.xt .visual:has(.xphoto),${P}.xt .visual:has(.xmystery){padding:0!important}
${P} .visual .curriculum-diagram:has(.xphoto),${P} .visual .curriculum-diagram:has(.xmystery){padding:0;position:relative;overflow:hidden;border-radius:14px}
${P} .visual .curriculum-diagram:has(.xphoto):after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;box-shadow:inset 0 0 0 3px #ffffffb0,inset 0 -46px 46px -46px #0008,inset 0 36px 40px -40px #ffffff55}
${P}.xs-cartoon .visual .ximg.xphoto{filter:url(#xCartoon) contrast(1.04)}
/* a question without a picture: no picture area, answers use the full width */
${PL}.xl-split.novis,${PL}.xl-stack.novis,${PL}.xl-splitr.novis{grid-template-columns:minmax(0,1fr);grid-template-rows:0 minmax(0,1fr) minmax(0,1.35fr) 34px;column-gap:0}
${PL}.xl-split.novis .answers,${PL}.xl-stack.novis .answers,${PL}.xl-splitr.novis .answers{grid-row:3;grid-column:1/-1;grid-template-columns:1fr 1fr!important}
/* picture on the right, and a big picture on top */
${PL}.xl-splitr{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:56px 112px minmax(0,1fr) 34px;column-gap:18px}
${PL}.xl-splitr>.vid-banner,${PL}.xl-splitr .question,${PL}.xl-splitr .feedback{grid-column:1/-1}
${PL}.xl-splitr .visual{grid-row:3;grid-column:2}
${PL}.xl-splitr .answers{grid-row:3;grid-column:1;grid-template-columns:1fr!important}
${PL}.xl-splitr .feedback{grid-row:4}
${PP}.xl-splitr .answers{grid-template-columns:1fr!important}
${PL}.xl-hero{grid-template-rows:56px 92px minmax(0,1fr) 112px 34px}
${PL}.xl-hero.novis{grid-template-rows:0 250px 0 minmax(0,1fr) 34px}
/* question at the bottom (landscape) */
${PL}.xq-bottom.xl-grid,${PL}.xq-bottom.xl-hero{grid-template-rows:56px minmax(0,1fr) 112px 92px 34px}
${PL}.xq-bottom.xl-grid{grid-template-rows:56px 150px minmax(0,1fr) 100px 34px}
${PL}.xq-bottom.xl-grid .visual,${PL}.xq-bottom.xl-hero .visual{grid-row:2}
${PL}.xq-bottom.xl-grid .answers{grid-row:3}
${PL}.xq-bottom.xl-hero .answers{grid-row:3}
${PL}.xq-bottom.xl-grid .question,${PL}.xq-bottom.xl-hero .question{grid-row:4}
${PL}.xq-bottom.xl-grid .feedback,${PL}.xq-bottom.xl-hero .feedback{grid-row:5}
${PL}.xq-bottom.xl-split,${PL}.xq-bottom.xl-stack,${PL}.xq-bottom.xl-splitr{grid-template-rows:56px minmax(0,1fr) 100px 34px}
${PL}.xq-bottom.xl-split .visual,${PL}.xq-bottom.xl-stack .visual,${PL}.xq-bottom.xl-splitr .visual,${PL}.xq-bottom.xl-split .answers,${PL}.xq-bottom.xl-stack .answers,${PL}.xq-bottom.xl-splitr .answers{grid-row:2}
${PL}.xq-bottom.xl-split .question,${PL}.xq-bottom.xl-stack .question,${PL}.xq-bottom.xl-splitr .question{grid-row:3}
${PL}.xq-bottom.xl-split .feedback,${PL}.xq-bottom.xl-stack .feedback,${PL}.xq-bottom.xl-splitr .feedback{grid-row:4}
${PL}.xq-bottom.novis{grid-template-columns:minmax(0,1fr);grid-template-rows:0 minmax(0,1.3fr) 130px 34px;column-gap:0}
${PL}.xq-bottom.novis .answers{grid-row:2;grid-column:1/-1;grid-template-columns:1fr 1fr!important}
${PL}.xq-bottom.novis .question{grid-row:3;grid-column:1/-1}
${PL}.xq-bottom.novis .feedback{grid-row:4;grid-column:1/-1}
${PL}.xq-bottom .question{margin-right:0!important}
.xt-sec{margin-top:12px}.xt-sec>strong{display:block;color:#3b2f6b}
.xt-note{margin:12px 2px 0;font-size:12px;opacity:.7}
.xwire{display:block;width:100%;height:46px;background:#fff;border-radius:11px;box-shadow:inset 0 0 0 2px #e4dcff}
@keyframes xBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes xPop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
${P} .visual .curriculum-diagram:has(.xmystery){height:100%;width:100%;display:flex;align-items:center;justify-content:center;padding:6px}
${P} .visual .xmystery{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;border-radius:14px;border:4px dashed var(--xq,#8a7ddd);background:repeating-linear-gradient(45deg,#fff,#fff 10px,color-mix(in srgb,var(--xq,#8a7ddd) 14%,#fff) 10px 20px);color:var(--xq,#6d4dff)}
${P} .visual .xmystery b{font:900 clamp(34px,8vh,70px)/1 var(--font,system-ui);animation:xBob 1.4s ease-in-out infinite}
${P} .visual .xmystery span{font:800 12px var(--font,system-ui);opacity:.8}
${P} .visual .xrev{animation:xPop .55s cubic-bezier(.2,.9,.3,1.4)}
.xwire .wq{fill:#ff5c8a}.xwire .wp{fill:#6d4dff}.xwire .wa{fill:#c9b8ff}
${P} .visual .ic-txt{font-size:clamp(48px,11vh,92px)!important;line-height:1}
${P}.xt .visual:has(img){background:radial-gradient(circle at 50% 40%,#fff,color-mix(in srgb,var(--xq) 18%,#fff) 80%)!important}
${P}.xt-neon .visual:has(img){background:radial-gradient(circle at 50% 40%,#3a36a8,#12104a 80%)!important}
@keyframes xDiag{50%{box-shadow:0 0 0 10px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 18%,transparent),0 0 34px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 70%,transparent)}}
@media(prefers-reduced-motion:reduce){${P} .visual{animation:none!important}}
`;
THEMES.forEach(t=>{css+=`${P}.xt-${t[0]}{${t[3]}}\n`+t[4].split(/\}(?=[^}]*\{)/).map(r=>r.trim()).filter(Boolean).map(r=>`${P}.xt-${t[0]} ${r.endsWith('}')?r:r+'}'}`).join('\n')+'\n'});
s=s.slice(0,cssStart)+css+s.slice(cssEnd);

/* ---------- data: refresh the question bank ---------- */
{const ea=s.indexOf('var EXPLORE='),eb=s.indexOf('\nvar XT_META=',ea);if(ea<0||eb<0)throw new Error('bank not found');s=s.slice(0,ea)+'var EXPLORE='+JSON.stringify(bank)+';'+s.slice(eb)}
/* ---------- JS: themes + picker ---------- */
const jsStart=s.indexOf('var XT_META='),jsEnd=s.indexOf('function exploreOf(t){');
if(jsStart<0||jsEnd<0)throw new Error('js block not found');
const js=`var XT_META=${JSON.stringify(META)},XT=Object.keys(XT_META),lastXT='',levelXT='',levelLook=null,XT_PICK='candy',XL_PICK='auto',XQ_PICK='top',XS_PICK='cartoon';
try{const v=localStorage.getItem('xtPick');if(v&&(v==='random'||XT_META[v]))XT_PICK=v;const l=localStorage.getItem('xlPick');if(['auto','grid','stack','split','splitr','hero'].includes(l))XL_PICK=l;const q=localStorage.getItem('xqPick');if(q==='top'||q==='bottom')XQ_PICK=q;const st=localStorage.getItem('xsPick');if(['cartoon','realistic','icon'].includes(st))XS_PICK=st}catch(e){}
function nextXT(){if(XT_PICK!=='random')return XT_PICK;let t;do{t=XT[Math.floor(Math.random()*XT.length)]}while(t===lastXT);return lastXT=t}
var XL_OPTS=[['auto','🎯 Theme default','Each theme picks its own'],['grid','4 tiles','Picture, then 4 answers'],['stack','Rows','Small picture, answer rows'],['split','Picture left','Big picture + answers'],['splitr','Picture right','Answers + big picture'],['hero','Big picture on top','Large picture, answers below']],
 XQ_OPTS=[['top','Question on top','The classic place'],['bottom','Question at the bottom','Picture and answers first']],
 XS_OPTS=[['cartoon','🎨 Light cartoon','Real photo, gently illustrated'],['realistic','📷 Realistic','Photos as they are'],['icon','🧸 3D icons','Cute icons only']];
/* tiny wireframes so the layouts can be told apart at a glance */
function xWire(l,qb){const R=(x,y,w,h,c)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" class="'+c+'"/>',A=(x,y,w,n,g,h)=>Array.from({length:n},(_,i)=>R(x,y+i*(h+g),w,h,'wa')).join('');let b='';
 if(l==='grid'){b=R(2,2,56,7,'wq')+R(2,11,56,10,'wp')+R(2,23,27,5,'wa')+R(31,23,27,5,'wa')+R(2,30,27,5,'wa')+R(31,30,27,5,'wa')}
 else if(l==='stack'){b=R(2,2,56,7,'wq')+R(2,11,17,24,'wp')+A(21,11,37,4,2,4.5)}
 else if(l==='split'){b=R(2,2,56,7,'wq')+R(2,11,28,24,'wp')+A(32,11,26,4,2,4.5)}
 else if(l==='splitr'){b=R(2,2,56,7,'wq')+R(30,11,28,24,'wp')+A(2,11,26,4,2,4.5)}
 else if(l==='hero'){b=R(2,2,56,6,'wq')+R(2,10,56,16,'wp')+R(2,28,27,3,'wa')+R(31,28,27,3,'wa')+R(2,32,27,3,'wa')+R(31,32,27,3,'wa')}
 else if(qb){b=R(2,2,56,5,'wp')+R(2,9,56,14,'wa')+R(2,26,56,8,'wq')}
 else if(qb===false){b=R(2,2,56,8,'wq')+R(2,12,56,5,'wp')+R(2,19,56,14,'wa')}
 return '<svg class="xwire" viewBox="0 0 60 37" aria-hidden="true">'+b+'</svg>'}
function xtSave(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function renderXtPicker(){let el=document.getElementById('xtPicker');const on=!!exploreOf(topic);if(!el){if(!on)return;el=document.createElement('div');el.id='xtPicker';const h=document.getElementById('levelsHeading');h.parentNode.insertBefore(el,h)}
 el.classList.toggle('hidden',!on);if(!on)return;
 const sec=(title,key,cur,opts,vis)=>'<div class="xt-sec"><strong>'+title+'</strong><div class="xt-chips">'+opts.map(o=>'<button type="button" class="xt-chip'+(cur===o[0]?' on':'')+'" data-k="'+key+'" data-v="'+o[0]+'">'+vis(o[0])+o[1]+(o[2]?'<small>'+o[2]+'</small>':'')+'</button>').join('')+'</div></div>',
  none=()=>'',wire=l=>l==='auto'?'':xWire(l),
  th=[['random','🎲 Surprise me','A new colour look each level']].concat(XT.map(k=>[k,XT_META[k][0],XT_META[k][2]==='grid'?'':''])),
  sw=k=>'<i style="--sw:'+(k==='random'?'conic-gradient(#ff5c8a,#ffc400,#22c55e,#2bb3ff,#8e44ad,#ff5c8a)':XT_META[k][1])+'"></i>';
 el.innerHTML=sec('🎨 Colours ('+XT.length+' looks)','xt',XT_PICK,th,sw)+sec('🧩 Layout: where things go','xl',XL_PICK,XL_OPTS,wire)+sec('❓ Question position','xq',XQ_PICK,XQ_OPTS,k=>xWire('q',k==='bottom'))+sec('🖼️ Picture style','xs',XS_PICK,XS_OPTS,none)+'<p class="xt-note">Your choices stay the same for the whole level and are remembered on this device.</p>';
 el.onclick=e=>{const c=e.target.closest('.xt-chip');if(!c)return;const k=c.dataset.k,v=c.dataset.v;if(k==='xt')XT_PICK=v;else if(k==='xl')XL_PICK=v;else if(k==='xq')XQ_PICK=v;else XS_PICK=v;xtSave({xt:'xtPick',xl:'xlPick',xq:'xqPick',xs:'xsPick'}[k],v);renderXtPicker()}}
/* a fresh look for a new level: colours, layout, question position and picture style are all fixed until the level ends */
function xNewLook(){const t=nextXT();return{t:t,l:XL_PICK==='auto'?XT_META[t][2]:XL_PICK,q:XQ_PICK,s:XS_PICK}}
/* picture style "3D icons": swap a real photo for its icon */
function xApplyStyle(){const L=levelLook;if(!L||!exploreOf(quizTopic)||L.s!=='icon')return;const im=document.querySelector('#visualCount .xphoto');if(im&&im.dataset.alt){const a=im.dataset.alt;delete im.dataset.alt;im.classList.remove('xphoto');const cr=im.parentElement&&im.parentElement.querySelector('.xcredit');if(cr)cr.remove();im.src=a}}
/* cartoon effect for real photos: soften, boost colour, flatten into a few tones and draw dark outlines */
if(!document.getElementById('xCartoonSvg'))document.body.insertAdjacentHTML('beforeend','<svg id="xCartoonSvg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="xCartoon" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="b"/><feColorMatrix in="b" type="saturate" values="1.3" result="s"/><feComponentTransfer in="s" result="p"><feFuncR type="discrete" tableValues="0 .1 .2 .3 .4 .5 .6 .7 .8 .9 1"/><feFuncG type="discrete" tableValues="0 .1 .2 .3 .4 .5 .6 .7 .8 .9 1"/><feFuncB type="discrete" tableValues="0 .1 .2 .3 .4 .5 .6 .7 .8 .9 1"/></feComponentTransfer><feComposite in="p" in2="s" operator="arithmetic" k1="0" k2=".5" k3=".5" k4="0" result="m"/><feColorMatrix in="b" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0" result="g"/><feConvolveMatrix in="g" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" preserveAlpha="true" result="e"/><feColorMatrix in="e" type="matrix" values="-3.5 0 0 0 1 -3.5 0 0 0 1 -3.5 0 0 0 1 0 0 0 1 0" result="ink"/><feBlend in="m" in2="ink" mode="multiply"/></filter></defs></svg>');
var XMYST='<div class="curriculum-diagram"><div class="xmystery"><b>?</b><span>Think first!</span></div></div>';
/* a picture that would give the answer away is hidden until the child has answered */
function xReveal(){const q=questions[qi];if(!q||!q.reveal||!exploreOf(quizTopic))return;const v=document.getElementById('visualCount');v.innerHTML=q.reveal;if(v.firstElementChild)v.firstElementChild.classList.add('xrev');xApplyStyle()}
/* realistic 3D pictures (Microsoft Fluent Emoji, MIT licence); falls back to Noto, then plain text */
var XIMG=${JSON.stringify(map)};
/* e = emoji (3D icon), p = optional real photo {s: url, c: credit}. Fallback chain: photo -> 3D icon -> Noto icon -> text */
function xImg(e,p){const f=e&&XIMG[e],c=e?[...e].map(x=>x.codePointAt(0).toString(16)).filter(h=>h!=='fe0f').join('_'):'',icon=f?'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/'+f.split('/').map(encodeURIComponent).join('/'):'',noto=c?NOTO_CDN+c+'.svg':'';
 const esc=t=>String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
 if(p&&p.s)return '<img class="ximg xphoto" alt="" referrerpolicy="no-referrer" src="'+esc(p.s)+'"'+(icon?' data-alt="'+icon+'"':'')+(noto?' data-n="'+noto+'"':'')+(e?' data-t="'+e+'"':'')+'>';
 if(!f)return e?emoOne(e,96):'';
 return '<img class="ximg" alt="" data-n="'+noto+'" data-t="'+e+'" src="'+icon+'">'}
/* keep every diagram inside its frame: shrink (never enlarge) to the free area, centred, whenever the picture changes or loads */
function fitVisual(){const v=document.getElementById('visualCount'),d=v&&v.firstElementChild;if(!d||d.querySelector('.ximg'))return;d.style.transform='';d.style.transformOrigin='center center';const cs=getComputedStyle(v),aw=v.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-16,ah=v.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-16,w=d.scrollWidth,h=d.scrollHeight;if(w>0&&h>0&&aw>0&&ah>0){const k=Math.min(1,aw/w,ah/h);if(k<1)d.style.transform='scale('+k.toFixed(3)+')'}}
(function(){const v=document.getElementById('visualCount');if(!v||v.dataset.fitOn)return;v.dataset.fitOn='1';const run=()=>setTimeout(fitVisual,30);new MutationObserver(run).observe(v,{childList:true});v.addEventListener('load',run,true);window.addEventListener('resize',run)})();
`;
s=s.slice(0,jsStart)+js+s.slice(jsEnd);

/* picture from the new source */
if(!s.includes('xImg(r[4]')){const a=s.indexOf("'<div class=\"curriculum-diagram\">'+emoOne(r[4],96)"),b=s.indexOf("+'</div>',hint:r[3]",a);
if(a<0||b<0)throw new Error('pool picture not found');
s=s.slice(0,a)+"'<div class=\"curriculum-diagram\">'+xImg(r[4])"+s.slice(b)}
{const o=`'<div class="curriculum-diagram">'+xImg(r[4])+'</div>'`,n=`(r[4]||r[5]?'<div class="curriculum-diagram">'+xImg(r[4],r[5])+'</div>':'')`;if(s.includes(o))s=s.replace(o,()=>n)}
/* a photo that fails to load drops to the 3D icon and loses its credit */
if(!s.includes('im.dataset.alt'))rep("if(im&&im.tagName==='IMG'&&im.dataset&&im.dataset.n){const n=","if(im&&im.tagName==='IMG'&&im.dataset&&im.dataset.alt){const a=im.dataset.alt;delete im.dataset.alt;im.classList.remove('xphoto');const cr=im.parentElement&&im.parentElement.querySelector('.xcredit');if(cr)cr.remove();im.src=a;return}if(im&&im.tagName==='IMG'&&im.dataset&&im.dataset.n){const n=");
/* image fallback chain: photo -> 3D -> Noto -> text */
if(!s.includes('im.dataset.n){const n='))rep("if(im&&im.tagName==='IMG'&&im.dataset&&im.dataset.t){","if(im&&im.tagName==='IMG'&&im.dataset&&im.dataset.n){const n=im.dataset.n;delete im.dataset.n;im.src=n;return}if(im&&im.tagName==='IMG'&&im.dataset&&im.dataset.t){");
/* layout class: the look is chosen once per level (first question) and kept for all 10 questions */
const NEWQ="['grid','stack','split'].forEach(n=>panel.classList.remove('xl-'+n));panel.classList.remove('xt');if(exploreOf(quizTopic)){if(qi===0||!levelXT||!XT_META[levelXT])levelXT=nextXT();const n=levelXT;panel.classList.add('xt','xt-'+n,'xl-'+XT_META[n][2])}";
const OLDQ1="['grid','stack','split'].forEach(n=>panel.classList.remove('xl-'+n));panel.classList.remove('xt');if(exploreOf(quizTopic)){const n=nextXT();panel.classList.add('xt','xt-'+n,'xl-'+XT_META[n][2])}";
const OLDQ0="panel.classList.remove('xt');if(exploreOf(quizTopic)){panel.classList.add('xt','xt-'+nextXT())}";
if(s.includes(OLDQ1))rep(OLDQ1,NEWQ);else if(s.includes(OLDQ0))rep(OLDQ0,NEWQ);else if(!s.includes('levelXT=nextXT()')&&!s.includes('levelLook=xNewLook()'))throw new Error('showQ hook not found');
/* colours + layout + question position + picture style, all chosen once per level */
const NEW2="XT.forEach(n=>panel.classList.remove('xt-'+n));['grid','stack','split','splitr','hero'].forEach(n=>panel.classList.remove('xl-'+n));['cartoon','realistic','icon'].forEach(n=>panel.classList.remove('xs-'+n));panel.classList.remove('xt','xq-bottom');if(exploreOf(quizTopic)){if(qi===0||!levelLook||!XT_META[levelLook.t])levelLook=xNewLook();const L=levelLook;panel.classList.add('xt','xt-'+L.t,'xl-'+L.l,'xs-'+L.s);if(L.q==='bottom')panel.classList.add('xq-bottom')}";
if(s.includes(NEWQ))rep(NEWQ,NEW2);
if(!s.includes('xApplyStyle();'))rep("$('questionText').textContent=q.p;","$('questionText').textContent=q.p;xApplyStyle();");

if(s.includes("vis:(r[4]||r[5]?'<div class=\"curriculum-diagram\">'+xImg(r[4],r[5])+'</div>':''),hint:r[3]"))s=s.replace("vis:(r[4]||r[5]?'<div class=\"curriculum-diagram\">'+xImg(r[4],r[5])+'</div>':''),hint:r[3]",()=>"vis:(r[6]&&(r[4]||r[5])?XMYST:(r[4]||r[5]?'<div class=\"curriculum-diagram\">'+xImg(r[4],r[5])+'</div>':'')),reveal:(r[6]&&(r[4]||r[5]))?'<div class=\"curriculum-diagram\">'+xImg(r[4],r[5])+'</div>':'',hint:r[3]");
/* hooks: reveal after answering / timeout; fixed question order for Explore */
if(!s.includes('xReveal();')){const a1="function answer(btn,val){if(answered)return;answered=true;";if(!s.includes(a1))throw new Error('answer hook');s=s.replace(a1,()=>a1+'xReveal();');const t1="function timeExpired(){if(answered)return;answered=true;";if(!s.includes(t1))throw new Error('timeExpired hook');s=s.replace(t1,()=>t1+'xReveal();')}
if(!s.includes('return (buildPools()[level]||[]).slice()')){const c1="function createQuestions(){quizUsed=new Set();quizEmo=new Set();";if(!s.includes(c1))throw new Error('createQuestions hook');s=s.replace(c1,()=>c1+'if(exploreOf(topic)){return (buildPools()[level]||[]).slice()}')}
fs.writeFileSync(p,s);
[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));
console.log('patched ok; themes:',THEMES.length,'images:',Object.keys(map).length);
