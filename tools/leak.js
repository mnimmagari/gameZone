// Flags questions whose picture contains the answer as text, which would give the answer away.
// Usage: node leak.js ../index.html
const T=require('./harness.js');
const by={};let total=0,withVis=0;
const strip=h=>String(h||'').replace(/<svg[\s\S]*?<\/svg>/g,' ').replace(/<[^>]*>/g,' ');
const tokens=t=>String(t).toLowerCase().split(/[^a-z0-9.₹%\/]+/).filter(Boolean).map(x=>x.replace(/^₹/,'').replace(/%$/,''));
for(const g of T.GRADE_OPTIONS){
  T.set(g.id,'SCERT','counting',1);
  for(const tp of T.gradeTopics()){
    T.set(g.id,'SCERT',tp.id,1);
    const pools=T.buildPools();
    for(const qs of Object.values(pools))for(const q of qs){
      total++;if(!q.vis)continue;withVis++;
      const vt=tokens(strip(q.vis)),pt=tokens(q.p),at=tokens(q.ans);
      if(!at.length||!vt.length)continue;
      const inVis=at.every(a=>vt.includes(a)),inPrompt=at.every(a=>pt.includes(a));
      if(inVis&&!inPrompt){const k=g.id+'/'+tp.id;(by[k]=by[k]||[]).push(q.p.slice(0,80)+' | picture text: '+vt.slice(0,6).join(' ')+' | ans='+q.ans)}
    }
  }
}
console.log('questions',total,'with picture',withVis);
const ks=Object.keys(by);
console.log('class/topic combinations with a possible leak:',ks.length);
ks.slice(0,40).forEach(k=>console.log(k,by[k].length,'e.g.',by[k][0]));
