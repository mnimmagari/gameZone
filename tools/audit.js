const T=require('./harness.js');const rows=[];let dupes=0,totalLevels=0,combos=0,short=0;const t0=Date.now();
for(const cur of (process.argv[3]||'SCERT').split(',')){
for(const g of T.GRADE_OPTIONS){T.set(g.id,cur,'counting',1);for(const tp of T.gradeTopics()){T.set(g.id,cur,tp.id,1);const pools=T.buildPools(),au=T.levelAudit();
 const seenT=new Map(),seenS=new Map();let bad=0;
 for(const [l,qs] of Object.entries(pools)){if(qs.length<10)short++;for(const q of qs){const k=T.normQ(q),sk=T.structKey(q);if(seenT.has(k)&&seenT.get(k)!==l)bad++;if(sk&&seenS.has(sk)&&seenS.get(sk)!==l)bad++;seenT.set(k,l);if(sk)seenS.set(sk,l)}}
 dupes+=bad;combos++;totalLevels+=Object.keys(pools).length;rows.push(`${cur} ${g.id}/${tp.id}: levels=${Object.keys(pools).length}/20 kept=${au.kept} dupRemoved=${au.removed} crossLevelDupes=${bad}`)}}}
console.log(rows.join('\n'));console.log('combos',combos,'total levels',totalLevels,'cross-level dupes',dupes,'levels<10q',short,'secs',(Date.now()-t0)/1000);
