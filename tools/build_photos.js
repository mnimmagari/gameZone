/* Looks up an open-licence photo (Wikipedia lead image -> Wikimedia Commons licence + author) for every 'P:' entry in visual_plan.js.
   Slow on purpose (the API rate-limits); results are cached in photos_cache.json beside this file so a re-run resumes.
   Usage: node tools/build_photos.js   ->   writes tools/photos.json */
const fs=require('fs'),path=require('path');
const plan=require('./visual_plan.js');
const cacheFile=path.join(__dirname,'photos_cache.json');
const cache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile,'utf8')):{};
const UA={headers:{'User-Agent':'GameZoneQuiz/1.0 (educational kids quiz)'}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const strip=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/\s+/g,' ').trim();
const OK=/^(public domain|pd|cc0|cc by(?!-n)|cc by-sa|attribution|godl)/i,BAD=/\b(nc|nd)\b|fair use|non-?free|gfdl only/i;
async function getJson(u){for(let t=0;t<5;t++){try{const r=await fetch(u,UA),x=await r.text();return JSON.parse(x)}catch(e){await sleep(3000*(t+1))}}return null}
async function lookup(title){
 const j=await getJson('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title));
 if(!j)return{err:'network'};if(j.type==='https://mediawiki.org/wiki/HyperSwitch/errors/not_found')return{skip:'no page'};const src=j.originalimage&&j.originalimage.source;if(!src)return{skip:'no image'};
 const parts=src.split('?')[0].split('/'),fn=decodeURIComponent(src.includes('/thumb/')?parts[parts.length-2]:parts.pop());
 if(!/\.(jpe?g|png|webp)$/i.test(fn))return{skip:'not a photo ('+fn.split('.').pop()+')'};
 await sleep(500);
 const m=await getJson('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url|mime&iiurlwidth=640&titles='+encodeURIComponent('File:'+fn));
 if(!m)return{err:'network'};const page=m&&m.query&&Object.values(m.query.pages)[0],ii=page&&page.imageinfo&&page.imageinfo[0];if(!ii)return{skip:'no metadata'};
 const em=ii.extmetadata||{},lic=strip(em.LicenseShortName&&em.LicenseShortName.value);
 if(!OK.test(lic)||BAD.test(lic))return{skip:'licence '+lic};
 const artist=strip(em.Artist&&em.Artist.value).slice(0,60)||'Wikimedia Commons';
 return{src:ii.thumburl.split('?')[0],credit:artist+' · '+lic,page:ii.descriptionurl,file:fn};
}
(async()=>{
 const titles=[...new Set(Object.values(plan).flat().filter(x=>x.startsWith('P:')).map(x=>x.slice(2)))];
 let n=0;for(const t of titles){if(cache[t]){continue}const r=await lookup(t);if(r.err){console.log(t,'-> network error, will retry next run');continue}cache[t]=r;n++;fs.writeFileSync(cacheFile,JSON.stringify(cache,null,1));console.log(t,'->',cache[t].src?'OK '+cache[t].credit:'skip: '+cache[t].skip);await sleep(1200)}
 const out={};for(const [tp,arr] of Object.entries(plan))out[tp]=arr.map(x=>x.startsWith('P:')?(cache[x.slice(2)]||{}):{});
 fs.writeFileSync(path.join(__dirname,'photos.json'),JSON.stringify(out));
 const ok=Object.values(cache).filter(v=>v.src).length;console.log('done: photos found',ok,'of',titles.length);
})();
