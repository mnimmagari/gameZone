/* "My Own Quiz": a menu entry + two-step form (10 questions x 4 options, optional picture each; then colours / layout / picture style)
   that saves a playable quiz on this device. Re-runnable. Needs patch_themes.js to have been applied first. Run: node tools/patch_custom.js */
const fs=require('fs');
let s=fs.readFileSync('index.html','utf8');
const must=(o,label)=>{if(!s.includes(o))throw new Error('anchor missing: '+(label||o.slice(0,60)))};
const once=(o,n,label)=>{if(s.includes(n))return;must(o,label);s=s.replace(o,()=>n)};

/* ---- HTML: menu entries and the page ---- */
once('  <button data-page="progress">','  <div class="side-label nav-sub">My Quizzes</div>\n  <button data-page="custom"><span class="ico">✍️</span>Make my own quiz</button>\n  <div id="myQuizNav"></div>\n  <button data-page="progress">','nav progress button');
once(' <section id="quizPage" class="hidden">',' <section id="customPage" class="hidden"></section>\n <section id="quizPage" class="hidden">','quiz page section');

/* ---- wiring in existing functions ---- */
once("['home','ages','topic','quiz','progress'].forEach","['home','ages','topic','quiz','progress','custom'].forEach",'page() list');
once("progress:'My progress'})[p]","progress:'My progress',custom:'My own quiz'})[p]",'breadcrumb map');
once("if(b.dataset.page==='ages'){page('ages');renderGrades('gradeGrid')}else{","if(b.dataset.page==='ages'){page('ages');renderGrades('gradeGrid')}else if(b.dataset.page==='custom'){openCustom()}else{",'nav click');
once("(id==='topicChooser'&&exploreOf(topic)?EXPLORE:gradeTopics())","(id==='topicChooser'&&exploreOf(topic)?(isCustom(topic)?CUSTOM:EXPLORE):gradeTopics())",'renderTopics list');
once("exploreOf(t)?'Explore & Learn · Fun facts for curious kids':","exploreOf(t)?(isCustom(t)?'My own quiz · made by you':'Explore & Learn · Fun facts for curious kids'):",'topic subtitle');
once("exploreOf(t)?'Two short sets of fun questions. Pick one and play! Progress is saved for each set.':","exploreOf(t)?(isCustom(t)?'Your own questions, in the order you wrote them. Progress is saved on this device.':'Short sets of fun questions. Pick one and play! Progress is saved for each set.'):",'topic description');
once("const nm=exploreOf(topic)?(XSET_NAMES[shown-1]||'Bonus'):SET_NAMES[l-1];","const nm=exploreOf(topic)?(isCustom(topic)?exploreOf(topic).name:(XSET_NAMES[shown-1]||'Bonus')):SET_NAMES[l-1];",'set button name');
once("function exploreOf(t){return (EXPLORE||[]).find(x=>x.id===t)}","function exploreOf(t){return (EXPLORE||[]).concat(typeof CUSTOM!=='undefined'&&CUSTOM||[]).find(x=>x.id===t)}",'exploreOf');

/* ---- JS block (kept between markers so the patch can be re-run) ---- */
const A='/* custom quiz start */',B='/* custom quiz end */';
const js=String.raw`${A}
var CUSTOM=[];try{CUSTOM=JSON.parse(localStorage.getItem('myQuizzes')||'[]')}catch(e){CUSTOM=[]}
function isCustom(t){return CUSTOM.some(c=>c.id===t)}
function cqEsc(t){return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function cqSaveAll(){try{localStorage.setItem('myQuizzes',JSON.stringify(CUSTOM));return true}catch(e){return false}}
function renderMyNav(){const box=document.getElementById('myQuizNav');if(!box)return;box.innerHTML=CUSTOM.map(c=>'<button data-topic="'+c.id+'" style="--xc:#6d4dff"><span class="ico">✍️</span>'+cqEsc(c.name)+'</button>').join('')}
var cqEditId=null,cqDraft=null;
function openCustom(){cqEditId=null;cqDraft=null;cqHome();page('custom')}
function cqBlank(){return{name:'',qs:Array.from({length:10},()=>({q:'',o:['','','',''],c:-1,h:'',img:'',hide:false}))}}
function cqFromEntry(c){return{name:c.name,qs:c.form.map((f,i)=>({q:f.q,o:f.o.slice(),c:f.c,h:f.h||'',hide:!!f.hide,img:(c.qs[i][5]&&c.qs[i][5].s)||''}))}}
function cqHome(){const el=document.getElementById('customPage');
 el.innerHTML='<div class="section-head"><div><h3>✍️ My Own Quiz</h3><p>Type your own 10 questions, add pictures, pick a look and play!</p></div><button class="primary" id="cqNew">➕ Make a new quiz</button></div>'+
  (CUSTOM.length?'<div class="topic-grid">'+CUSTOM.map(c=>'<div class="topic-card cq-saved" style="--xc:#6d4dff"><span class="age-emoji">✍️</span><strong>'+cqEsc(c.name)+'</strong><small>'+c.qs.length+' questions</small><span class="cq-actions"><button type="button" class="secondary" data-cq="play" data-id="'+c.id+'">▶ Play</button><button type="button" class="secondary" data-cq="edit" data-id="'+c.id+'">✏️ Edit</button><button type="button" class="secondary" data-cq="del" data-id="'+c.id+'">🗑️ Delete</button></span></div>').join('')+'</div>':'<p class="cq-empty">You have not made a quiz yet. Tap the button above to start!</p>');
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='cqNew'){cqEditId=null;cqDraft=cqBlank();cqForm()}else if(b.dataset.cq){const id=b.dataset.id;if(b.dataset.cq==='play')openTopic(id);else if(b.dataset.cq==='edit'){const c=CUSTOM.find(x=>x.id===id);if(c&&c.form){cqEditId=id;cqDraft=cqFromEntry(c);cqForm()}}else if(b.dataset.cq==='del'&&confirm('Delete this quiz?')){CUSTOM=CUSTOM.filter(x=>x.id!==id);delete levelPools['x|'+id];cqSaveAll();renderMyNav();cqHome()}}}}
function cqCard(x,i){const L=['A','B','C','D'];
 return '<div class="cq-card" data-i="'+i+'"><h4>Question '+(i+1)+'</h4><input class="cq-q" data-f="q" maxlength="160" placeholder="Type your question here" value="'+cqEsc(x.q)+'">'+
  '<div class="cq-opts">'+L.map((l,k)=>'<label class="cq-opt"><input type="radio" name="cqc'+i+'" data-f="c" value="'+k+'"'+(x.c===k?' checked':'')+' title="This is the right answer"><span class="cq-letter">'+l+'</span><input type="text" data-f="o" data-k="'+k+'" maxlength="80" placeholder="Option '+l+'" value="'+cqEsc(x.o[k])+'"></label>').join('')+'</div>'+
  '<input class="cq-q cq-hint" data-f="h" maxlength="120" placeholder="Hint (optional)" value="'+cqEsc(x.h)+'">'+
  '<div class="cq-img"><strong>🖼️ Picture</strong><span class="cq-note">(optional)</span><input type="file" accept="image/*" data-f="file"><input type="text" class="cq-url" data-f="url" placeholder="or paste a picture link (https://...)" value="'+(x.img&&/^https?:/.test(x.img)?cqEsc(x.img):'')+'"><img class="cq-prev'+(x.img?'':' hidden')+'" src="'+(x.img?cqEsc(x.img):'')+'" alt=""><button type="button" class="secondary" data-f="clear">Remove picture</button><label class="cq-hide"><input type="checkbox" data-f="hide"'+(x.hide?' checked':'')+'> Hide the picture until the answer is chosen</label></div></div>'}
function cqPrev(card,x){const im=card.querySelector('.cq-prev');if(x.img){im.src=x.img;im.classList.remove('hidden')}else{im.removeAttribute('src');im.classList.add('hidden')}}
function cqReadImg(file,cb){if(!/^image\//.test(file.type)){alert('Please choose a picture file.');return}const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.82))};im.onerror=()=>alert('That picture could not be read.');im.src=fr.result};fr.readAsDataURL(file)}
function cqForm(){const d=cqDraft,el=document.getElementById('customPage');
 el.innerHTML='<div class="section-head"><div><h3>'+(cqEditId?'✏️ Edit my quiz':'✍️ Make my quiz')+'</h3><p>Step 1 of 2 · Fill in all 10 questions. Tap the round button next to the right answer.</p></div><button class="secondary" id="cqBack">← My quizzes</button></div>'+
  '<div class="cq-card"><h4>Quiz name</h4><input class="cq-q" id="cqName" maxlength="40" placeholder="For example: My Class Quiz" value="'+cqEsc(d.name)+'"></div>'+d.qs.map(cqCard).join('')+'<div class="cq-err hidden" id="cqErr"></div><div class="cq-bar"><button class="primary" id="cqNext">Next: choose a look →</button></div>';
 const upd=e=>{const t=e.target;if(t.id==='cqName'){d.name=t.value;return}const card=t.closest&&t.closest('.cq-card[data-i]');if(!card)return;const x=d.qs[+card.dataset.i],f=t.dataset.f;
  if(f==='q')x.q=t.value;else if(f==='o')x.o[+t.dataset.k]=t.value;else if(f==='c')x.c=+t.value;else if(f==='h')x.h=t.value;else if(f==='hide')x.hide=t.checked;
  else if(f==='url'){x.img=t.value.trim();cqPrev(card,x)}
  else if(f==='file'&&t.files&&t.files[0])cqReadImg(t.files[0],data=>{x.img=data;card.querySelector('.cq-url').value='';cqPrev(card,x)})};
 el.oninput=upd;el.onchange=upd;
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='cqBack'){cqHome()}else if(b.dataset.f==='clear'){const card=b.closest('.cq-card'),x=d.qs[+card.dataset.i];x.img='';card.querySelector('.cq-url').value='';card.querySelector('input[type=file]').value='';cqPrev(card,x)}else if(b.id==='cqNext'){const errs=cqValidate(),box=document.getElementById('cqErr');if(errs.length){box.innerHTML=errs.map(cqEsc).join('<br>');box.classList.remove('hidden');box.scrollIntoView({block:'center'})}else cqStep2()}};
 window.scrollTo(0,0)}
function cqValidate(){const d=cqDraft,errs=[];if(!d.name.trim())errs.push('Give your quiz a name.');
 d.qs.forEach((x,i)=>{const n=i+1;if(!x.q.trim())errs.push('Question '+n+': type the question.');const o=x.o.map(s=>s.trim());if(o.some(s=>!s))errs.push('Question '+n+': fill in all 4 options.');else if(new Set(o.map(s=>s.toLowerCase())).size<4)errs.push('Question '+n+': the 4 options must all be different.');if(x.c<0)errs.push('Question '+n+': tap the round button next to the right answer.');if(x.img&&!/^(data:image\/|https?:\/\/)/.test(x.img))errs.push('Question '+n+': the picture link must start with https://')});return errs}
function cqLookRender(){const e=document.getElementById('cqLook');if(!e)return;e.innerHTML=xtPickerHTML();xtPickerBind(e,cqLookRender)}
function cqStep2(){const el=document.getElementById('customPage');
 el.innerHTML='<div class="section-head"><div><h3>🎨 Choose a look</h3><p>Step 2 of 2 · Pick the colours, layout and picture style for "'+cqEsc(cqDraft.name)+'".</p></div><button class="secondary" id="cqBack2">← Back to questions</button></div><div id="cqLook" class="cq-look"></div><div class="cq-bar"><button class="primary" id="cqCreate">✨ Create my quiz</button></div>';
 el.oninput=el.onchange=null;cqLookRender();
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='cqBack2')cqForm();else if(b.id==='cqCreate')cqCreate()};window.scrollTo(0,0)}
function cqCreate(){const d=cqDraft,id=cqEditId||('x_my_'+Date.now().toString(36));
 const qs=d.qs.map(x=>{const o=x.o.map(s=>s.trim()),ans=o[x.c];return[x.q.trim(),ans,o.filter((_,k)=>k!==x.c),(x.h||'').trim()||'Think carefully, you can do it!','',x.img?{s:x.img}:0,x.img&&x.hide?1:0]});
 const entry={id:id,name:d.name.trim(),icon:'✍️',desc:'My own quiz',color:'#6d4dff',custom:1,qs:qs,form:d.qs.map(x=>({q:x.q,o:x.o,c:x.c,h:x.h,hide:x.hide}))};
 const old=CUSTOM.slice(),i=CUSTOM.findIndex(c=>c.id===id);if(i>=0)CUSTOM[i]=entry;else CUSTOM.push(entry);delete levelPools['x|'+id];
 if(!cqSaveAll()){CUSTOM=old;alert('This device has no space left for more pictures. Try smaller pictures, or fewer pictures.');return}
 renderMyNav();levelLook=null;openTopic(id)}
renderMyNav();
${B}`;
{const a=s.indexOf(A);if(a>=0){const b=s.indexOf(B,a);s=s.slice(0,a)+js+s.slice(b+B.length)}
 else{const line="function exploreOf(t){return (EXPLORE||[]).concat(typeof CUSTOM!=='undefined'&&CUSTOM||[]).find(x=>x.id===t)}";must(line,'exploreOf line');s=s.replace(line,()=>line+'\n'+js)}}

/* ---- CSS ---- */
const CA='/* custom quiz css start */',CB='/* custom quiz css end */';
const css=String.raw`${CA}
#customPage .cq-card{background:#fff;border-radius:22px;padding:16px 18px;margin:12px 0;border:3px solid #ece6ff;box-shadow:0 6px 0 #ece6ff}
#customPage .cq-card h4{margin:0 0 10px;color:#4b3f8f;font-size:17px}
.cq-q{width:100%;padding:11px 14px;border-radius:14px;border:2px solid #d9cff7;font:inherit;font-size:16px;background:#fff;color:#2b1f4d}
.cq-q:focus,.cq-opt input[type=text]:focus,.cq-url:focus{outline:3px solid #b9a8ff;outline-offset:1px}
.cq-hint{margin-top:10px;font-size:14px}
.cq-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.cq-opt{display:flex;align-items:center;gap:8px;background:#f7f4ff;border:2px solid #e4dcff;border-radius:14px;padding:6px 10px}
.cq-opt:has(input[type=radio]:checked){background:#e7fff0;border-color:#12b550}
.cq-opt input[type=text]{flex:1;min-width:0;border:0;background:transparent;font:inherit;font-size:15px;padding:6px 4px;color:#2b1f4d}
.cq-opt input[type=radio]{accent-color:#12b550;width:20px;height:20px;flex:0 0 auto}
.cq-letter{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:#8a6df0;color:#fff;display:grid;place-items:center;font-weight:900;font-size:13px}
.cq-img{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:12px;padding-top:12px;border-top:2px dashed #e4dcff}
.cq-note{opacity:.6;font-size:13px}
.cq-url{flex:1 1 220px;min-width:0;padding:8px 12px;border-radius:12px;border:2px solid #d9cff7;font:inherit;font-size:14px}
.cq-prev{width:92px;height:68px;object-fit:cover;border-radius:12px;border:2px solid #e4dcff;background:#f1eefb}
.cq-prev.hidden{display:none}
.cq-hide{flex:1 1 100%;font-size:14px;color:#4b3f8f}
.cq-err{margin:12px 0;padding:12px 16px;border-radius:14px;background:#ffe9e9;color:#a11d24;font-weight:700;line-height:1.6}
.cq-err.hidden{display:none}
.cq-bar{position:sticky;bottom:10px;display:flex;justify-content:center;padding:10px 0;z-index:5}
.cq-bar .primary{padding:14px 30px;font-size:17px;border-radius:999px;box-shadow:0 10px 24px #6d4dff55}
.cq-look{background:#fff;border:3px dashed #c9b8ff;border-radius:20px;padding:14px}
.cq-saved .cq-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.cq-saved .cq-actions button{padding:6px 10px;font-size:13px}
.cq-empty{background:#fff;border-radius:18px;padding:22px;text-align:center;color:#6b5fb0;font-weight:700}
@media(max-width:700px){.cq-opts{grid-template-columns:1fr}}
${CB}`;
{const a=s.indexOf(CA);if(a>=0){const b=s.indexOf(CB,a);s=s.slice(0,a)+css+s.slice(b+CB.length)}else{const k='.vis-row{display:flex;';must(k,'css anchor');s=s.replace(k,()=>css+'\n'+k)}}

fs.writeFileSync('index.html',s);
[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));
console.log('custom quiz patched ok');
