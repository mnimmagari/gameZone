/* Finds public-domain / CC0 photos (no credit needed) for Explore questions that still have none.
   Uses Wikimedia Commons structured-data licence filters. Writes tools/photos_fix.json {topic:{index:entry}} */
const fs=require('fs');
const Q={x_evs:{28:'watering can garden plants|watering plant',9:'oak tree|oak tree'},x_eco:{4:'trees forest sunlight|trees forest',15:'compost bin food waste|compost bin',29:'glass bottles recycling|glass bottle recycl'},x_health:{16:'children playing outdoors|children playing',0:'child sleeping bed|sleeping bed'},x_tech:{20:'typing on keyboard|keyboard typing',19:'inkjet printer|printer'},x_space:{22:'constellation stars night sky|constellation stars'},x_road:{2:'child crossing road zebra|crossing'}};
const BAD=/(efta|deskjet|beer|wine|alcohol|nude|bikini|cigarette|diagram|map|logo|icon|svg|drawing|illustration|engraving|sketch|poster|chart|stamp|cartoon|painting|lithograph|schematic|infographic|book|plate|page|screenshot|mosaic|miniature|relief|bowl|MET[ _]|sf19|naturen|statue|coin|manuscript|stained|fresco|woodcut|print|album|art[ _]project|usfws-.*(growth|series)|cover|scan|wiring|nebula|portrait of)/i;
const UA={headers:{'User-Agent':'GameZoneQuiz/1.0 (educational kids quiz)'}};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=/^(public domain|pd\b|cc0)/i;
const strip=h=>String(h||'').replace(/<[^>]+>/g,'').trim();
async function search(q,st){const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch='+encodeURIComponent('filetype:bitmap '+q+' haswbstatement:'+st)+'&prop=imageinfo&iiprop=extmetadata|url|mime|size&iiurlwidth=960';
 for(let t=0;t<3;t++){try{const j=await (await fetch(u,UA)).json();return j.query?Object.values(j.query.pages).sort((a,b)=>a.index-b.index):[]}catch(e){await sleep(2000)}}return[]}
(async()=>{const out={},used=new Set();{const h=fs.readFileSync(__dirname+'/../index.html','utf8');for(const m of h.matchAll(/"file":"([^"]+)"/g))used.add(m[1])}
 for(const [tp,m] of Object.entries(Q)){out[tp]={};for(const [i,spec] of Object.entries(m)){const [q,keys]=spec.split('|');const kw=keys.split(/\s+/);let got=null;
  for(const st of ['P275=Q6938433','P6216=Q19652']){const ps=await search(q,st);await sleep(700);
   for(const p of ps){const ii=p.imageinfo&&p.imageinfo[0];if(!ii||!/^image\/(jpeg|png)$/.test(ii.mime)||ii.width<700||ii.height<450)continue;const name=p.title.slice(5);if(BAD.test(name)||used.has(name))continue;if(!kw.some(w=>name.toLowerCase().includes(w)))continue;
    const lic=strip(ii.extmetadata&&ii.extmetadata.LicenseShortName&&ii.extmetadata.LicenseShortName.value);if(!ok.test(lic))continue;
    got={s:ii.thumburl.split('?')[0],page:'https://commons.wikimedia.org/wiki/'+encodeURIComponent(name.replace(/ /g,'_')),license:/^cc0/i.test(lic)?'CC0':'Public domain',file:name,author:''};used.add(name);break}
   if(got)break}
  out[tp][i]=got;console.log(tp,i,q,'->',got?got.file.slice(0,70):'NONE')}}
 fs.writeFileSync(__dirname+'/photos_fix.json',JSON.stringify(out,null,1))})();
