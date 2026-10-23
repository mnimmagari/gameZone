// Independent answer checks on every published pool question
const T=require('./harness.js');const fails={};let checked=0,total=0;const num=s=>+String(s).replace(/[₹, cm]/g,'');
const fail=(k,g,t,l,q,why)=>{(fails[k]=fails[k]||[]).push(g+'/'+t+'/L'+l+': '+q.p+' | ans='+q.ans+' '+(why||''))};
const grades=process.argv[3]?process.argv[3].split(','):T.GRADE_OPTIONS.map(g=>g.id);
for(const g of grades){T.set(g,'SCERT','counting',1);for(const tp of T.gradeTopics()){T.set(g,'SCERT',tp.id,1);const pools=T.buildPools();
 for(const [l,qs] of Object.entries(pools))for(const q of qs){total++;const p=q.p,ans=String(q.ans);let m;const o=(q.options||[]).map(String);
  if(o.length&&(!o.includes(ans)||new Set(o).size!==o.length))fail('options',g,tp.id,l,q,o.join('|'));
  if(o.length&&o.length<3)fail('few-options',g,tp.id,l,q,o.join('|'));
  if(m=p.match(/^(\d+) \+ ___ = (\d+)$/)){checked++;if(num(ans)!==+m[2]-+m[1])fail('bond',g,tp.id,l,q)}
  else if(m=p.match(/^Count backwards: (\d+), (\d+), (\d+), ___/)){checked++;if(num(ans)!==+m[3]-1||+m[2]!==+m[1]-1)fail('countBack',g,tp.id,l,q)}
  else if(m=p.match(/^Count in \w+: ([\d, ]+), ___/)){checked++;const a=m[1].split(',').map(Number),d=a[1]-a[0];if(a.some((v,i)=>i&&v-a[i-1]!==d)||num(ans)!==a[a.length-1]+d)fail('skip',g,tp.id,l,q)}
  else if(m=p.match(/^There are (\d+) plates\. Each plate has (\d+) /)){checked++;const blocks=(q.vis.match(/emo-block/g)||[]).length,ics=(q.vis.match(/class="ic"/g)||[]).length;if(num(ans)!==+m[1]*+m[2]||(q.vis&&(blocks!==+m[1]||ics!==+m[1]*+m[2])))fail('eqGroups',g,tp.id,l,q,'blocks='+blocks+' icons='+ics)}
  else if(m=p.match(/^The dots are in (\d+) rows\. Each row has (\d+) dots/)){checked++;const c=(q.vis.match(/<circle/g)||[]).length;if(num(ans)!==+m[1]*+m[2]||c!==+m[1]*+m[2])fail('array',g,tp.id,l,q,'circles='+c)}
  else if(m=p.match(/^How many dots are there in all\?$/)){checked++;const c=(q.vis.match(/<circle/g)||[]).length;if(num(ans)!==c)fail('arrayCount',g,tp.id,l,q,'circles='+c)}
  else if(m=p.match(/^There are (\d+) dots in rows of (\d+)/)){checked++;const c=(q.vis.match(/<circle/g)||[]).length;if(c!==+m[1]||num(ans)!==+m[1]/+m[2])fail('arrayRows',g,tp.id,l,q)}
  else if(m=p.match(/^(?:[A-Z][a-z]+) shares (\d+) .* equally among (\d+) friends/)){checked++;if(num(ans)*+m[2]!==+m[1])fail('share',g,tp.id,l,q)}
  else if(m=p.match(/^(\d+) .* are put into bags\. Each bag holds (\d+)/)){checked++;if(num(ans)*+m[2]!==+m[1])fail('groupInto',g,tp.id,l,q)}
  else if((m=p.match(/^How many (?:(red|blue|yellow) )?(shapes|circles|squares) are there?$/))&&/[🔴🔵🟡🟥🟦🟨]/u.test(q.vis)){checked++;const MAP={'🔴':['red','circle'],'🔵':['blue','circle'],'🟡':['yellow','circle'],'🟥':['red','square'],'🟦':['blue','square'],'🟨':['yellow','square']};const items=[...q.vis.matchAll(/🔴|🔵|🟡|🟥|🟦|🟨/gu)].map(x=>MAP[x[0]]);const sh=m[2].replace(/s$/,'');const c=items.filter(x=>(!m[1]||x[0]===m[1])&&(sh==='shape'||x[1]===sh)).length;if(c!==num(ans))fail('sortTwo',g,tp.id,l,q,'recount='+c)}
  else if(m=p.match(/^What is (one-half|half|one-third|one-quarter|one-fifth) of (\d+) /)){checked++;const d={half:2,'one-half':2,'one-third':3,'one-quarter':4,'one-fifth':5}[m[1]];if(num(ans)*d!==+m[2])fail('fSetOf',g,tp.id,l,q)}
  else if(m=p.match(/^Which number is "(\w+)"\?/)){checked++;const W=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];if(W[num(ans)]!==m[1])fail('numWord',g,tp.id,l,q)}
  else if(m=p.match(/^(\d+) \+ (\d+) = \?$/)){checked++;if(num(ans)!==+m[1]+ +m[2])fail('add',g,tp.id,l,q)}
  else if(m=p.match(/^(\d+) [−-] (\d+) = \?$/)){checked++;if(num(ans)!==+m[1]-+m[2])fail('sub',g,tp.id,l,q)}
  else if(m=p.match(/^I am thinking of a number\. When I (add|take away) (\d+)(?: to it)?, I get (\d+)/)){checked++;const r=m[1]==='add'?+m[3]-+m[2]:+m[3]+ +m[2];if(num(ans)!==r)fail('riddle',g,tp.id,l,q)}
  else if(m=p.match(/^A (?:\w+) costs ₹(\d+) and a (\w+) costs ₹(\d+)\. Which costs (more|less)/)){}
 }}}
console.log('questions',total,'independently checked',checked);for(const k in fails)console.log('FAIL',k,fails[k].length,'e.g.',fails[k].slice(0,2).join(' ## '));if(!Object.keys(fails).length)console.log('no failures');
