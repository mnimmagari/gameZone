const T=require('./harness.js');const out=[];let nonMono=0,tot=0;
for(const g of T.GRADE_OPTIONS){T.set(g.id,'SCERT','counting',1);for(const tp of T.gradeTopics()){T.set(g.id,'SCERT',tp.id,1);const pools=T.buildPools();const ls=Object.keys(pools).map(Number);
 const avg=ls.map(l=>{let d=0,c=0;pools[l].forEach(q=>{(q.p.match(/\d+/g)||[]).forEach(n=>{d+=n.length;c++});});return c?d/c:0});
 const h=Math.ceil(avg.length/2),first=avg.slice(0,h).reduce((a,b)=>a+b,0)/h,last=avg.slice(avg.length-h).reduce((a,b)=>a+b,0)/h;
 tot++;if(ls.length>3&&last+0.01<first){nonMono++;out.push(g.id+'/'+tp.id+' levels='+ls.length+' first-half='+first.toFixed(2)+' second-half='+last.toFixed(2))}}}
console.log('combos',tot,'second half easier than first (digits):',nonMono);console.log(out.join('\n'));
