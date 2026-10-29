/* One-off patch: adds safety topics, six bright quiz templates with a picker, and highlighted diagram frames. Run from the project root. */
const fs=require('fs');
const p='index.html';let s=fs.readFileSync(p,'utf8');
const bank=require('./explore_bank.js').concat(require('./explore_bank2.js'));
const colors={x_evs:'#22c55e',x_space:'#7c4dff',x_animals:'#ff8a00',x_eco:'#00c2a8',x_tech:'#2979ff',x_india:'#ff4d6d',x_road:'#ffc400',x_health:'#ff5c8a'};
bank.forEach(t=>t.color=colors[t.id]);

const rep=(o,n)=>{const i=s.indexOf(o);if(i<0)throw new Error('missing: '+o.slice(0,70));if(s.indexOf(o,i+1)>=0)throw new Error('dup: '+o.slice(0,70));s=s.slice(0,i)+n+s.slice(i+o.length)};

/* 1. swap the question bank */
const a=s.indexOf('var EXPLORE='),b=s.indexOf('\nfunction exploreOf');
if(a<0||b<0)throw new Error('bank not found');
s=s.slice(0,a)+'var EXPLORE='+JSON.stringify(bank)+';'+s.slice(b);

/* 2. menu buttons for the new topics (after India Explorer) */
rep('India Explorer</button>','India Explorer</button>\n'+bank.slice(6).map(t=>'  <button data-topic="'+t.id+'" style="--xc:'+t.color+'"><span class="ico">'+t.icon+'</span>'+t.name+'</button>').join('\n'));
/* colour every explore menu button */
bank.slice(0,6).forEach(t=>{s=s.replace('<button data-topic="'+t.id+'">','<button data-topic="'+t.id+'" style="--xc:'+t.color+'">')});

/* 3. template list, picker and cards */
rep('function exploreOf(t){',`var XT_META={candy:['Candy Pop','linear-gradient(135deg,#ff8ad8,#ffd86b)'],jungle:['Jungle Fun','linear-gradient(135deg,#7be495,#25c7b5)'],sunset:['Sunset Show','linear-gradient(135deg,#ff9966,#ff5e62,#8e44ad)'],ocean:['Ocean Splash','linear-gradient(135deg,#a8edff,#2bb3ff)'],neon:['Neon Night','linear-gradient(135deg,#14123d,#ff2bd6)'],sticker:['Comic Sticker','linear-gradient(135deg,#ffe94d,#ff5c8a)']},XT=Object.keys(XT_META),lastXT='',XT_PICK='random';
try{const v=localStorage.getItem('xtPick');if(v&&(v==='random'||XT_META[v]))XT_PICK=v}catch(e){}
function nextXT(){if(XT_PICK!=='random')return XT_PICK;let t;do{t=XT[Math.floor(Math.random()*XT.length)]}while(t===lastXT);return lastXT=t}
function renderXtPicker(){let el=document.getElementById('xtPicker');const on=!!exploreOf(topic);if(!el){if(!on)return;el=document.createElement('div');el.id='xtPicker';const h=document.getElementById('levelsHeading');h.parentNode.insertBefore(el,h)}
 el.classList.toggle('hidden',!on);if(!on)return;
 el.innerHTML='<strong>🎨 Choose a look</strong><div class="xt-chips">'+['random'].concat(XT).map(k=>'<button type="button" class="xt-chip'+(XT_PICK===k?' on':'')+'" data-xt="'+k+'" style="--sw:'+(k==='random'?'conic-gradient(#ff5c8a,#ffc400,#22c55e,#2bb3ff,#8e44ad,#ff5c8a)':XT_META[k][1])+'"><i></i>'+(k==='random'?'🎲 Surprise me':XT_META[k][0])+'</button>').join('')+'</div>';
 el.onclick=e=>{const c=e.target.closest('.xt-chip');if(!c)return;XT_PICK=c.dataset.xt;try{localStorage.setItem('xtPick',XT_PICK)}catch(err){}renderXtPicker()}}
function exploreOf(t){`);
rep(`renderTopics('homeTopics');stats();page('topic')}`,`renderTopics('homeTopics');renderXtPicker();stats();page('topic')}`);
rep(`el.innerHTML='';(id==='topicChooser'&&exploreOf(topic)?EXPLORE:gradeTopics()).forEach(t=>{const b=document.createElement('button');`,`el.innerHTML='';(id==='topicChooser'&&exploreOf(topic)?EXPLORE:gradeTopics()).forEach(t=>{const b=document.createElement('button');if(t.color)b.style.setProperty('--xc',t.color);`);

/* 4. pick a template for every question */
rep(`panel.style.setProperty('--j',(themeHue()%21)-10);`,`panel.style.setProperty('--j',(themeHue()%21)-10);XT.forEach(n=>panel.classList.remove('xt-'+n));panel.classList.remove('xt');if(exploreOf(quizTopic)){panel.classList.add('xt','xt-'+nextXT())}`);

/* 5. styles */
const P='body #quizPage #recStage .quiz-panel[id="quizPanel"]';
const T=(n,v)=>P+'.xt-'+n+'{'+v+'}\n';
const css=`
/* Explore & Learn: bright menu, template picker, six quiz looks, highlighted diagrams */
#nav button[data-topic^="x_"]{border-left:6px solid var(--xc,#8a7ddd);background:color-mix(in srgb,var(--xc,#8a7ddd) 12%,#fff);font-weight:800}
#nav button[data-topic^="x_"].active{background:var(--xc,#8a7ddd);color:#fff}
.topic-card[style*="--xc"]{border:3px solid var(--xc);background:linear-gradient(160deg,#fff,color-mix(in srgb,var(--xc) 22%,#fff));box-shadow:0 6px 0 color-mix(in srgb,var(--xc) 55%,transparent)}
#xtPicker{margin:6px 0 14px;padding:12px 14px;border-radius:20px;background:#fff;border:3px dashed #c9b8ff}
#xtPicker.hidden{display:none}
.xt-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.xt-chip{display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:999px;background:#f6f3ff;font-weight:800;color:#3b2f6b;border:3px solid transparent}
.xt-chip i{width:26px;height:26px;border-radius:50%;background:var(--sw);box-shadow:inset 0 0 0 2px #fff,0 0 0 2px #0002}
.xt-chip.on{border-color:#6d4dff;background:#fff;box-shadow:0 4px 0 #6d4dff55}
${P}.xt{background:var(--xbg)}
${P}.xt .question{background:var(--xqbg,#fff)!important;color:var(--xqink,#2b1f4d)!important;border-color:var(--xq)!important;box-shadow:0 7px 0 color-mix(in srgb,var(--xq) 50%,transparent),0 0 22px color-mix(in srgb,var(--xq) 40%,transparent)}
${P}.xt #questionCount{background:var(--xq)!important;border-color:var(--xq)!important;color:var(--xcnt,#fff)}
${P}.xt .progress-fill{background:var(--x2)!important}
${P}.xt .answer{background:var(--bg)!important;border:4px solid var(--c)!important;color:var(--xink)!important;font-weight:900}
${P}.xt .answer:nth-child(1){--c:var(--x1);--bg:color-mix(in srgb,var(--x1) 26%,var(--xbase,#fff))}
${P}.xt .answer:nth-child(2){--c:var(--x2);--bg:color-mix(in srgb,var(--x2) 26%,var(--xbase,#fff))}
${P}.xt .answer:nth-child(3){--c:var(--x3);--bg:color-mix(in srgb,var(--x3) 26%,var(--xbase,#fff))}
${P}.xt .answer:nth-child(4){--c:var(--x4);--bg:color-mix(in srgb,var(--x4) 26%,var(--xbase,#fff))}
${P}.xt .answer.correct{--c:#12b550!important;--bg:#c9ffdc!important;color:#073d1b!important}
${P}.xt .answer.wrong{--c:#ff3b3b!important;--bg:#ffd3d3!important;color:#5b0909!important}
${T('candy','--xbg:linear-gradient(160deg,#ff8ad8,#ffd86b);--xq:#ff2e93;--x1:#ff3d81;--x2:#ffb300;--x3:#00b8ff;--x4:#8e44ff;--xink:#4a1042')}${P}.xt-candy .answer{border-radius:999px;box-shadow:0 6px 0 var(--c)}
${T('jungle','--xbg:linear-gradient(160deg,#7be495,#25c7b5);--xq:#0f9d58;--x1:#ff7a00;--x2:#ffd400;--x3:#00c853;--x4:#2979ff;--xink:#0b3d2e')}${P}.xt-jungle .answer{border-radius:10px;border-width:5px!important;box-shadow:5px 5px 0 var(--c);transform:rotate(-.6deg)}${P}.xt-jungle .answer:nth-child(even){transform:rotate(.6deg)}
${T('sunset','--xbg:linear-gradient(160deg,#ff9966,#ff5e62 55%,#8e44ad);--xq:#ffd54f;--x1:#ff4081;--x2:#ffab00;--x3:#7c4dff;--x4:#00b8d4;--xink:#3a0f3f')}body #quizPage #recStage .quiz-panel[id="quizPanel"].xt-sunset .answers{grid-template-columns:1fr}${P}.xt-sunset .answer{border-radius:16px;min-height:58px;box-shadow:0 5px 0 var(--c)}
${T('ocean','--xbg:linear-gradient(180deg,#a8edff,#2bb3ff 70%,#0077ff);--xq:#0091ff;--x1:#00b8ff;--x2:#00d96b;--x3:#ffd400;--x4:#ff6e9c;--xink:#06335c')}${P}.xt-ocean .answer{border-radius:46px;box-shadow:inset 0 8px 0 #fff8,0 6px 0 color-mix(in srgb,var(--c) 70%,#003)}
${T('neon','--xbg:radial-gradient(circle at 20% 10%,#2d2a8a,#14123d 70%);--xq:#00f0ff;--xqbg:#1d1a52;--xqink:#fff;--xcnt:#06103a;--x1:#00f0ff;--x2:#ff2bd6;--x3:#c6ff00;--x4:#ff9100;--xink:#fff;--xbase:#1b1850')}${P}.xt-neon .answer{border-radius:14px;box-shadow:0 0 16px var(--c),inset 0 0 12px color-mix(in srgb,var(--c) 40%,transparent)}${P}.xt-neon .answer.correct{color:#073d1b!important}${P}.xt-neon .answer.wrong{color:#5b0909!important}
${T('sticker','--xbg:#ffe94d;--xq:#111;--xcnt:#ffe94d;--x1:#ff5c8a;--x2:#4dd0ff;--x3:#7cff6b;--x4:#b388ff;--xink:#111')}${P}.xt-sticker .answer{border-color:#111!important;border-radius:14px;box-shadow:6px 6px 0 #111}${P}.xt-sticker .answer:nth-child(odd){transform:rotate(-1deg)}${P}.xt-sticker .answer:nth-child(even){transform:rotate(1deg)}
/* diagrams stand out: glowing frame that gently pulses */
body #quizPage #recStage .quiz-panel[id="quizPanel"] .visual:has(.curriculum-diagram,.vis-row,svg,img){border:5px solid var(--xq,var(--level-accent,#8a7ddd))!important;background:#fff!important;box-shadow:0 0 0 6px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 25%,transparent),0 0 26px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 55%,transparent)!important;animation:xDiag 2.4s ease-in-out infinite}
@keyframes xDiag{50%{box-shadow:0 0 0 10px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 18%,transparent),0 0 34px color-mix(in srgb,var(--xq,var(--level-accent,#8a7ddd)) 70%,transparent)}}
@media(prefers-reduced-motion:reduce){body #quizPage #recStage .quiz-panel[id="quizPanel"] .visual{animation:none!important}}
`;
rep('.vis-row{display:flex;',css+'.vis-row{display:flex;');

fs.writeFileSync(p,s);
[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));
console.log('patched ok, topics:',bank.map(t=>t.id+':'+t.qs.length).join(' '));
