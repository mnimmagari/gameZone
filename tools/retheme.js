/* Edits tools/patch_themes.js: six original palettes in place of the ones that resembled the reference pictures, makes the patch re-runnable. */
const fs=require('fs');
const f='tools/patch_themes.js';let s=fs.readFileSync(f,'utf8');
const NEW={
madness:`['aurora','Aurora Split','split','--xbg:repeating-conic-gradient(from 0deg at 55% 75%,#ffffff12 0 8deg,transparent 8deg 16deg),linear-gradient(155deg,#0fb5ae,#4b3fc4);--xqbg:linear-gradient(90deg,#ff5d73,#ff2f92);--xqink:#fff;--xqts:0 3px 0 #0006;--xq:#9ff3ff;--xnum:#c6f432;--xnumink:#1c2b00;--x1:#c8f4ff;--x2:#c8f4ff;--x3:#c8f4ff;--x4:#c8f4ff;--xmix:100%;--xink:#12264d;--xlet:#ff5d73;--xletink:#fff;--xbd:#fff;--xfill:repeating-linear-gradient(115deg,#c6f432 0 14px,#d9ff62 14px 28px)','.answer{border-radius:16px}.answer:before{border-radius:12px!important}.question{border-radius:26px!important}'],`,
blitz:`['cloud','Cloud Pop','grid','--xbg:radial-gradient(circle at 12% 22%,#ffffff55 0 42px,transparent 43px),radial-gradient(circle at 88% 74%,#ffffff44 0 58px,transparent 59px),radial-gradient(circle at 60% 12%,#ffffff33 0 30px,transparent 31px),linear-gradient(#4fb3ff,#2f7bff);--xqbg:transparent;--xqink:#fff;--xqts:0 3px 0 #123a9c;--xq:#fff;--xnum:#ff8a3d;--x1:#fff;--x2:#fff;--x3:#fff;--x4:#fff;--xmix:100%;--xink:#12306b;--xlet:#2f7bff;--xletink:#fff;--xbd:#fff;--xfill:#ff8a3d','.question{border-color:transparent!important;box-shadow:none!important}.answer{border-radius:22px;box-shadow:0 6px 0 #0003}'],`,
quizone:`['sunbeam','Sunbeam','grid','--xbg:repeating-conic-gradient(from 0deg at 50% 110%,#ffffff1c 0 6deg,transparent 6deg 12deg),linear-gradient(#ffd166,#ff9f5a);--xqbg:#fff;--xqink:#5a2a00;--xq:#7a3b00;--xnum:#0f766e;--xnumink:#fff;--x1:#0f766e;--x2:#0f766e;--x3:#0f766e;--x4:#0f766e;--xmix:100%;--xink:#fff;--xats:0 2px 0 #00403a;--xlet:#ffd166;--xletink:#5a2a00;--xbd:#ffe9a8;--xfill:#0f766e','.answer{border-radius:14px;box-shadow:0 5px 0 #00403a}'],`,
night:`['midnight','Midnight Plum','stack','--xbg:linear-gradient(180deg,#1d0b3b,#4a0f5c 70%,#2a0a3a);--xqbg:#fff7ea;--xqink:#2a0a3a;--xq:#ff4fa3;--xnum:#ff4fa3;--xnumink:#fff;--x1:#fffaf2;--x2:#fffaf2;--x3:#fffaf2;--x4:#fffaf2;--xmix:100%;--xink:#0e7c86;--xlet:#2a0a3a;--xletink:#fff;--xbd:#ffd6ec;--xfill:#ff4fa3','.answer{border-radius:14px}.question{border-radius:22px!important}'],`,
purple:`['ember','Ember Teal','split','--xbg:repeating-conic-gradient(from 0deg at 50% 100%,#ffffff10 0 7deg,transparent 7deg 14deg),linear-gradient(#0f2a3d,#1b5e6b);--xqbg:transparent;--xqink:#fff;--xqts:0 3px 0 #04141f;--xq:#ffb020;--xnum:#ffb020;--xnumink:#3b2300;--x1:#fff;--x2:#fff;--x3:#fff;--x4:#fff;--xmix:100%;--xink:#0f2a3d;--xlet:#ffb020;--xletink:#3b2300;--xbd:#fff;--xfill:repeating-linear-gradient(115deg,#ffb020 0 14px,#ffc75a 14px 28px)','.question{border-color:transparent!important;box-shadow:none!important}.answer{border-radius:999px;box-shadow:0 5px 0 #0004}.answer:before{border-radius:50%!important}'],`,
kidsgreen:`['lemon','Lemon Zest','grid','--xbg:linear-gradient(#fff6bf,#ffe98a);--xqbg:#fff;--xqink:#b45309;--xq:#ff9f1c;--xnum:#ff9f1c;--xnumink:#fff;--x1:#fff;--x2:#fff;--x3:#fff;--x4:#fff;--xmix:100%;--xink:#3a2a10;--xlet:#ffd9a0;--xletink:#b45309;--xbd:#ff9f1c;--xfill:#ff9f1c','.answer{border-radius:22px}.question{border-radius:24px!important}'],`};
const lines=s.split('\n');
for(const old in NEW){const i=lines.findIndex(l=>l.startsWith("['"+old+"',"));if(i<0)throw new Error('theme not found: '+old);lines[i]=NEW[old]}
s=lines.join('\n');
/* swatches */
const sw=(o,n,g)=>{const i=s.indexOf(o+":'linear-gradient");if(i<0)throw new Error('swatch '+o);const e=s.indexOf("'",s.indexOf("'",i)+1);s=s.slice(0,i)+n+":'"+g+s.slice(e)};
sw('madness','aurora','linear-gradient(135deg,#0fb5ae,#4b3fc4)');
sw('blitz','cloud','linear-gradient(135deg,#4fb3ff,#fff)');
sw('quizone','sunbeam','linear-gradient(135deg,#ffd166,#0f766e)');
sw('night','midnight','linear-gradient(135deg,#1d0b3b,#ff4fa3)');
sw('purple','ember','linear-gradient(135deg,#0f2a3d,#ffb020)');
sw('kidsgreen','lemon','linear-gradient(135deg,#fff6bf,#ff9f1c)');
/* re-runnable: find the CSS block by its common start, skip steps already applied */
const rep=(o,n)=>{if(!s.includes(o))throw new Error('missing: '+o.slice(0,60));s=s.replace(o,()=>n)};
rep("s.indexOf('/* Explore & Learn: bright menu, template picker')","s.indexOf('/* Explore & Learn: bright menu')");
/* specificity fix and stack layout (applied by hand before) now live in the generator */
rep("${[1,2,3,4].map(n=>`${P}.xt .answer:nth-child(${n})","${[1,2,3,4].map(n=>`${P}.xt.xt .answer:nth-child(${n})");
rep("${P}.xt .answer.correct{","${P}.xt.xt .answer.correct{");
rep("${P}.xt .answer.wrong{","${P}.xt.xt .answer.wrong{");
fs.writeFileSync(f,s);console.log('retheme ok');
