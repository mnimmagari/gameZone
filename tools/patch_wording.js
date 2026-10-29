/* Removes the words "level" / "level number" from everything the child sees (sets are shown by name, not number). Re-runnable. */
const fs=require('fs');
let s=fs.readFileSync('index.html','utf8');
const all=(o,n)=>{if(s.includes(o))s=s.split(o).join(n)};
all('20 gentle levels','20 gentle sets');
all('Levels passed','Sets completed');
all('Next level →','Next set →');
all('All levels','All sets');
all('Start a level and','Start a set and');
all("' levels, Basic to Advanced · '","' sets, Basic to Advanced · '");
all('First level','First set');all('Five levels','Five sets');all('Ten levels','Ten sets');
all('Reset saved stars and levels','Reset saved stars and sets');
all('A new colour look each level','A new colour look each set');
all('stay the same for the whole level','stay the same for the whole set');
/* the "Level N" chip on the quiz screen */
all("t.textContent='Level '+(availableLevels().indexOf(level)+1||level);","t.textContent='';t.style.display='none';");
/* set buttons: a name instead of "Set N" */
all("b.setAttribute('aria-label','Question set '+shown+(r?.passed","const nm=exploreOf(topic)?(XSET_NAMES[shown-1]||'Bonus'):SET_NAMES[l-1];b.setAttribute('aria-label','Question set: '+nm+(r?.passed");
all("'<strong>Set '+shown+'</strong><span>'","'<strong>'+nm+'</strong><span>'");
all("+tier+' · '+(exploreOf(topic)?'Fun facts '+shown:SET_NAMES[l-1])+'","+tier+'");
if(!s.includes('.lvl-tag{display:none!important}'))s=s.replace('.vis-row{display:flex;',()=>'.lvl-tag{display:none!important}\n.vis-row{display:flex;');
fs.writeFileSync('index.html',s);
/* keep the generator in step */
let g=fs.readFileSync('tools/patch_themes.js','utf8');
g=g.split('A new colour look each level').join('A new colour look each set').split('stay the same for the whole level').join('stay the same for the whole set');
if(!g.includes('var XSET_NAMES')){const a="var XL_OPTS=[";if(!g.includes(a))throw new Error('XL_OPTS anchor');g=g.replace(a,()=>"var XSET_NAMES=['Starter','Explorer','Challenger','Champion','Master','Genius','Legend','Wizard'];\n"+a)}
fs.writeFileSync('tools/patch_themes.js',g);
[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));
const left=[];for(const m of s.matchAll(/(['"`>])([^'"`<>\n]{0,60}\b[Ll]evels?\b[^'"`<>\n]{0,60})(['"`<])/g)){const t=m[2].trim();if(/^[a-z-]+$/.test(t)||/level-|levelPools|\.level|question-level|levelGrid|levelsHeading|level%|level=|,level|\(level|level\)|level\]|level;/.test(t))continue;left.push(t)}
console.log('wording patched; remaining mentions of "level" in strings:',left.length);left.slice(0,12).forEach(x=>console.log('  ',x));
