/* Animated, trending welcome page. Re-runnable: replaces its own CSS block and only adds the JS hook once. Run from project root. */
const fs=require('fs');
const p='index.html';let s=fs.readFileSync(p,'utf8');
const A='/* Welcome page v2 start */',B='/* Welcome page v2 end */';
const stag=(sel,n)=>Array.from({length:n},(_,i)=>`${sel}:nth-child(${i+1}){animation-delay:${i*45}ms}`).join('\n');
const css=`${A}
@keyframes wGrad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes wRise{from{opacity:0;transform:translateY(22px) scale(.97)}to{opacity:1;transform:none}}
@keyframes wShine{0%{left:-60%}55%,100%{left:130%}}
@keyframes wPulse{0%,100%{box-shadow:0 8px 0 #b63258,0 16px 28px #ff5c8a66,0 0 0 0 #ff5c8a66}50%{box-shadow:0 8px 0 #b63258,0 16px 34px #ff5c8a99,0 0 0 14px #ff5c8a00}}
@keyframes wNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
@keyframes wFloat{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-16px) rotate(5deg)}}
@keyframes wOrb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,26px) scale(1.15)}}
@keyframes wMarq{to{transform:translateX(-50%)}}
@keyframes cardIn{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:none}}
@keyframes wText{to{background-position:300% 0}}
.welcome-hero{min-height:320px;background:linear-gradient(120deg,var(--w1,#d9efe8),var(--w2,#e4def7),var(--w3,#fbe6c9),var(--w1,#d9efe8))!important;background-size:300% 300%!important;animation:wGrad 16s ease-in-out infinite;border:3px solid #fff;box-shadow:0 18px 44px #6d5fc733}
.w-orbs i{position:absolute;border-radius:50%;filter:blur(38px);opacity:.6;pointer-events:none;animation:wOrb 13s ease-in-out infinite}
.w-orbs i:nth-child(1){width:210px;height:210px;background:#ff9ad5;left:-50px;top:-60px}
.w-orbs i:nth-child(2){width:250px;height:250px;background:#8fe7ff;right:8%;bottom:-110px;animation-delay:-4s}
.w-orbs i:nth-child(3){width:190px;height:190px;background:#ffe27a;left:42%;top:-80px;animation-delay:-8s}
.w-float{position:absolute;inset:0;pointer-events:none;z-index:1}
.w-float span{position:absolute;width:clamp(44px,6vw,74px);height:clamp(44px,6vw,74px);animation:wFloat calc(5s + var(--k)*.7s) ease-in-out infinite;animation-delay:calc(var(--k)*-1s);filter:drop-shadow(0 10px 10px #3b2f6b44)}
.w-float span img,.w-float span .ic-txt{width:100%;height:100%;object-fit:contain;font-size:48px}
.w-float span:nth-child(1){left:47%;top:9%}.w-float span:nth-child(2){left:60%;top:58%}.w-float span:nth-child(3){left:69%;top:7%}
.w-float span:nth-child(4){right:3%;top:5%}.w-float span:nth-child(5){left:39%;bottom:7%}.w-float span:nth-child(6){right:19%;bottom:9%}
.welcome-copy{background:#ffffff52;-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border:1.5px solid #ffffffc0;border-radius:30px;padding:22px 28px 26px!important;margin:18px 0 0 clamp(6px,2vw,22px);box-shadow:0 14px 40px #5e48a526;animation:wRise .8s cubic-bezier(.2,.9,.3,1.2) both}
.welcome-copy .eyebrow{display:inline-flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:5px 14px;font-weight:900;box-shadow:0 4px 0 #ece6ff}
.welcome-copy .eyebrow:before{content:"✨"}
.welcome-copy h2{animation:wRise .9s .08s cubic-bezier(.2,.9,.3,1.25) both}
.welcome-copy h2 em{background:linear-gradient(90deg,#ff5c8a,#ffb300,#22c55e,#2bb3ff,#8e44ad,#ff5c8a);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent!important;-webkit-text-fill-color:transparent;animation:wText 7s linear infinite}
.welcome-copy p{animation:wRise .9s .16s both}
.welcome-copy .teaser{background:#ffffffc0;border-radius:18px;box-shadow:0 6px 0 #ece6ff;animation:wRise .9s .24s both}
.welcome-start{position:relative;overflow:hidden;background:linear-gradient(135deg,#ff5c8a,#ff8a3d 55%,#ffc400)!important;color:#fff!important;border-radius:999px!important;padding:15px 30px!important;font-size:19px;font-weight:900;border:0;text-shadow:0 2px 0 #0003;animation:wPulse 2.4s ease-in-out infinite,wRise 1s .32s both!important;transition:transform .15s}
.welcome-start:hover{transform:translateY(-3px) scale(1.05)}
.welcome-start:after{content:"";position:absolute;top:0;left:-60%;width:38%;height:100%;background:linear-gradient(100deg,transparent,#fffa,transparent);transform:skewX(-20deg);animation:wShine 2.8s ease-in-out infinite}
.welcome-start b{display:inline-block;animation:wNudge 1s ease-in-out infinite}
.w-marquee{overflow:hidden;margin:16px 0 6px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.w-track{display:flex;gap:12px;width:max-content;animation:wMarq 34s linear infinite}
.w-marquee:hover .w-track{animation-play-state:paused}
.w-track span{white-space:nowrap;padding:9px 18px;border-radius:999px;background:#fff;font-weight:800;color:#4b3f8f;box-shadow:0 5px 0 #ece6ff,inset 0 0 0 2px #f1ecff}
.w-track span:nth-child(3n+1){background:#fff1f6;color:#b0285e;box-shadow:0 5px 0 #ffd6e6}
.w-track span:nth-child(3n+2){background:#eefaf4;color:#12794b;box-shadow:0 5px 0 #c9efdc}
.w-track span:nth-child(3n){background:#eef5ff;color:#2459b5;box-shadow:0 5px 0 #cfe0ff}
.stats .stat{transition:transform .2s,box-shadow .2s;animation:cardIn .6s both}
.stats .stat:hover{transform:translateY(-5px) rotate(-.6deg);box-shadow:0 14px 26px #5e48a526}
.stats .stat:nth-child(2){animation-delay:.1s}.stats .stat:nth-child(3){animation-delay:.2s}
.age-grid>*,.topic-grid>*{animation:cardIn .55s cubic-bezier(.2,.9,.3,1.2) both;transition:transform .2s,box-shadow .2s}
.age-grid>*:hover,.topic-grid>*:hover{transform:translateY(-6px) rotate(-.8deg);box-shadow:0 16px 28px #5e48a52b}
${stag('.age-grid>*',14)}
${stag('.topic-grid>*',14)}
@media(max-width:600px){.w-float span:nth-child(n+4){display:none}.welcome-copy{max-width:100%;margin-left:0}.welcome-hero{min-height:460px}}
@media(prefers-reduced-motion:reduce){.welcome-hero,.w-orbs i,.w-float span,.w-track,.welcome-start,.welcome-start:after,.welcome-start b,.welcome-copy,.welcome-copy *,.age-grid>*,.topic-grid>*,.stats .stat{animation:none!important}}
${B}
`;
const a=s.indexOf(A);
if(a>=0){const b=s.indexOf(B,a);s=s.slice(0,a)+css.trimEnd()+s.slice(b+B.length)}
else{const head=s.indexOf('</head>'),end=s.lastIndexOf('</style>',head);if(end<0)throw new Error('style end not found');s=s.slice(0,end)+css+s.slice(end)}

/* JS: floating stickers, marquee, hooked into renderWelcome */
if(!s.includes('function welcomeFx(')){
 const fx=`function welcomeFx(){const h=document.querySelector('.welcome-hero');if(!h||h.dataset.fx)return;h.dataset.fx='1';
 const ems=['🚀','🪐','🌈','🦋','🐬','🦁'];
 h.insertAdjacentHTML('beforeend','<div class="w-orbs" aria-hidden="true"><i></i><i></i><i></i></div><div class="w-float" aria-hidden="true">'+ems.map((e,k)=>'<span style="--k:'+k+'">'+xImg(e)+'</span>').join('')+'</div>');
 if(!document.querySelector('.w-marquee')){const it=[['🚀','Space Explorers'],['🦁','Wild Animals'],['🤖','Robots & AI'],['🌿','Nature & EVS'],['🚦','Road Safety'],['🥗','Healthy Habits'],['♻️','Eco Heroes'],['🪔','India Explorer'],['➕','Maths Magic'],['🔢','Counting Fun']],row=it.map(x=>'<span>'+x[0]+' '+x[1]+'</span>').join('');h.insertAdjacentHTML('afterend','<div class="w-marquee" aria-hidden="true"><div class="w-track">'+row+row+'</div></div>')}}
`;
 const o="function renderWelcome(){";if(s.split(o).length!==2)throw new Error('renderWelcome not found once');
 s=s.replace(o,()=>fx+o);
 const t="if(bb)bb.innerHTML=girlSvg(i)+'<span class=\"baby-name\">Hi there!</span>'}";
 if(s.split(t).length!==2)throw new Error('renderWelcome end not found');
 s=s.replace(t,()=>"if(bb)bb.innerHTML=girlSvg(i)+'<span class=\"baby-name\">Hi there!</span>';welcomeFx()}");
}
fs.writeFileSync(p,s);
[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));
console.log('welcome patched ok');
