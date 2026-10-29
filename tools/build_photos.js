/* Finds a free-to-use photo (public domain or CC0 only, so no credit is ever needed) for every 'P:' / 'S:' entry in visual_plan.js.
   A spec is tried left to right, e.g. '!P:Apple|S:red apple fruit' (a leading ! only means "reveal after answering" and is ignored here):
     P:Title  = lead image of that Wikipedia article, if it is public domain / CC0
     S:query  = Wikimedia Commons image search; only public-domain / CC0 photos whose file name matches the subject are accepted
   A 'P:' entry with no 'S:' also gets an automatic Commons search for the same subject.
   No picture is ever used twice. Results are cached in photos_cache.json (re-runs resume).
   Usage: node tools/build_photos.js [--no-fetch]   ->   writes tools/photos.json */
const fs=require('fs'),path=require('path');
const plan=require('./visual_plan.js');
const cacheFile=path.join(__dirname,'photos_cache.json');
let cache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile,'utf8')):{};
const UA={headers:{'User-Agent':'GameZoneQuiz/1.0 (educational kids quiz)'}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const strip=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/\s+/g,' ').trim();
const FREE=/^(public domain|pd\b|cc0|cc by(?!-n)|cc by-sa)/i;   /* free to use; CC BY / CC BY-SA need credit, which goes on the app's Image credits page */
const NOCREDIT=/^(public domain|pd\b|cc0)/i;
/* files reviewed by hand and rejected (wrong subject, map, patent, painting, wires, sandwich...) */
const BLOCK=/purple rain|nagasawa|india and adjacent|patent granted|bicycle helmet protection|peanut-butter|eb1911|swan panasia|light switch wiring|hp deskjet|birchwood slavnoe|prodromus|orion[ _]constellation|eagle nebula|r136|ngc 2070|crab nebula|white dove|mars,? as seen|seat belt use|one-way traffic|colou?red|negro|computed tomography|heart frontally|hp tablet pc|[ఀ-౿]/i;
const BLOCK2=/berann|denali|crater|ocd[ _]handwash|moons[ _]of[ _]solar|night[ _]sky[ _]festival|1861[ _]comet|signature|sunset[ _]over[ _]the[ _]gulf|sharm|ma[ _]mania|mars[,_ ]+as[ _]seen|grand[ _]portage|efta|nebulae|bullae|lady[ _]with[ _]a[ _]parrot|early[ _]view[ _]of[ _]comet|rainier|escalators|broken[ _]heart/i;
const NOTPHOTO=/(diagram|map of|\bmap\b|logo|icon|svg|drawing|illustration|engraving|sketch|poster|chart|stamp|cartoon|painting|lithograph|schematic|infographic|book|plate|page|screenshot)/i;
async function getJson(u){for(let t=0;t<3;t++){try{const r=await fetch(u,Object.assign({signal:AbortSignal.timeout(20000)},UA)),x=await r.text();return JSON.parse(x)}catch(e){await sleep(2000*(t+1))}}return null}
const entry=(ii,fn)=>{const em=ii.extmetadata||{},lic=strip(em.LicenseShortName&&em.LicenseShortName.value);return FREE.test(lic)?{src:ii.thumburl.split('?')[0],license:lic,author:strip(em.Artist&&em.Artist.value).slice(0,70)||'Wikimedia Commons contributor',page:ii.descriptionurl,file:fn}:null};
/* Wikipedia lead image (if public domain / CC0) */
async function wiki(title){
 const j=await getJson('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title));
 if(!j)return{err:'network'};if(j.type==='https://mediawiki.org/wiki/HyperSwitch/errors/not_found')return{cands:[]};const src=j.originalimage&&j.originalimage.source;if(!src)return{cands:[]};
 const parts=src.split('?')[0].split('/'),fn=decodeURIComponent(src.includes('/thumb/')?parts[parts.length-2]:parts.pop());
 if(!/\.(jpe?g|png)$/i.test(fn)||NOTPHOTO.test(fn))return{cands:[]};
 await sleep(500);
 const m=await getJson('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url|mime&iiurlwidth=800&titles='+encodeURIComponent('File:'+fn));
 if(!m)return{err:'network'};const page=m.query&&Object.values(m.query.pages)[0],ii=page&&page.imageinfo&&page.imageinfo[0];
 const e=ii&&entry(ii,fn);return{cands:e?[e]:[]};
}
/* Commons search: up to 15 files in one request, licence checked per file, file name must contain the subject word */
async function commons(q){
 const j=await getJson('https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=20&gsrsearch='+encodeURIComponent('filetype:bitmap '+q)+'&prop=imageinfo&iiprop=extmetadata|url|mime|size&iiurlwidth=800');
 if(!j)return{err:'network'};const pages=j.query?Object.values(j.query.pages).sort((a,b)=>a.index-b.index):[];
 const key=q.toLowerCase().split(/\s+/).filter(w=>w.length>3&&!/^(with|from|that|this|photo|picture|image)$/.test(w));
 const cands=[];
 for(const p of pages){const ii=p.imageinfo&&p.imageinfo[0];if(!ii||!/^image\/(jpeg|png)$/.test(ii.mime)||(ii.width||0)<700||(ii.height||0)<450)continue;
  const name=p.title.replace(/^File:/,'');if(NOTPHOTO.test(name))continue;
  if(key.length&&!key.some(w=>name.toLowerCase().includes(w.slice(0,Math.max(4,w.length-1)))))continue;
  const e=entry(ii,name);if(e)cands.push(e)}
 cands.sort((a,b)=>NOCREDIT.test(b.license)-NOCREDIT.test(a.license));return{cands:cands.slice(0,6)};
}
const attempts=spec=>{const a=spec.replace(/^!/,'').split('|').filter(x=>/^[PS]:/.test(x));
 if(a.length&&!a.some(x=>x.startsWith('S:'))){const p=a.find(x=>x.startsWith('P:'));if(p){const t=p.slice(2).replace(/_/g,' '),m=t.match(/^(.*?)\s*\((.*)\)\s*$/);a.push('S:'+(m?m[1]+' '+m[2]:t))}}return a};
const cacheKey=k=>k.startsWith('P:')?'P:'+k.slice(2):k;
(async()=>{
 /* old-format entries (single photo, or Openverse results) are dropped; Wikipedia ones are upgraded */
 for(const k of Object.keys(cache)){const v=cache[k];if((k.startsWith('S:')&&!v.cands)||(!v.cands&&!v.src)||(v.src&&!/wikimedia\.org/.test(v.src)))delete cache[k];else if(v.src&&!v.cands){cache['P:'+k]=FREE.test(v.credit||'')?{cands:[{src:v.src,license:'Public domain',page:v.page,file:v.file}]}:{cands:[]};delete cache[k]}else if(!k.startsWith('P:')&&!k.startsWith('S:')&&v.cands){cache['P:'+k]=v;delete cache[k]}}
 const keys=[...new Set(Object.values(plan).flat().flatMap(attempts))];
 if(!process.argv.includes('--no-fetch'))for(const k of keys){const ck=cacheKey(k);if(cache[ck])continue;
  const r=k.startsWith('P:')?await wiki(k.slice(2)):await commons(k.slice(2));
  if(r.err){console.log(k,'-> network error, will retry next run');continue}
  cache[ck]=r;fs.writeFileSync(cacheFile,JSON.stringify(cache,null,1));console.log(k,'->',r.cands.length?r.cands.length+' free photo(s): '+r.cands[0].file.slice(0,50):'none');await sleep(1200)}
 /* assign, never reusing a picture */
 const used=new Set(),out={};
 for(const [tp,arr] of Object.entries(plan))out[tp]=arr.map(spec=>{for(const k of attempts(spec)){const c=cache[cacheKey(k)];if(!c||!c.cands)continue;const e=c.cands.find(x=>NOCREDIT.test(x.license||"")&&!used.has(x.src)&&!BLOCK.test(x.file)&&!BLOCK2.test(x.file));if(e){used.add(e.src);return{src:e.src,file:e.file,page:e.page,author:e.author,license:e.license}}}return{}});
 fs.writeFileSync(path.join(__dirname,'photos.json'),JSON.stringify(out));
 const n=Object.values(out).flat().filter(x=>x.src).length,tot=Object.values(plan).flat().filter(x=>attempts(x).length).length;
 console.log('done: questions with a free photo',n,'of',tot);
})();
