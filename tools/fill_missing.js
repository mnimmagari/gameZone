/* Finds public-domain / CC0 photos (no credit needed) for Explore questions that still have none.
   Uses Wikimedia Commons structured-data licence filters. Writes tools/photos_extra.json {topic:{index:entry}} */
const fs=require('fs');
const Q={
x_evs:{19:'log floating on water|log',20:'spinach leaves|spinach',21:'ice cubes|ice',23:'spider web|spider',29:'rose flower|rose'},
x_space:{4:'Chandrayaan-3|chandrayaan',5:'ISRO rocket launch|isro',13:'Rakesh Sharma|sharma',15:'meteor night sky|meteor'},
x_animals:{3:'Indian peafowl peacock|peafowl peacock',5:'cheetah|cheetah',15:'snail shell|snail',17:'hen chicken|hen chicken',18:'Indian rhinoceros|rhinoceros',20:'ostrich|ostrich',25:'white dove|dove',27:'bee hummingbird|hummingbird',29:'crab beach|crab'},
x_eco:{2:'solar panels|solar',11:'snow leopard|leopard',13:'rainbow|rainbow',23:'flowers bee garden|flower bee'},
x_tech:{0:'robot|robot',11:'smart speaker|speaker',12:'refrigerator|refrigerator fridge',15:'3D printer|printer',17:'GPS navigation|gps navigation',23:'CPU processor|cpu processor'},
x_india:{0:'India Gate New Delhi|delhi india',1:'Taj Mahal|taj',2:'flag of India|india flag',3:'Diwali lamps|diwali diya',5:'lotus flower|lotus',6:'mango fruit|mango',7:'Ganges Varanasi|ganga ganges varanasi',8:'cricket match|cricket',9:'Kerala backwaters|kerala backwater',10:'Thar desert Rajasthan|thar rajasthan desert',11:'Indian flag|india flag',12:'Independence Day India Red Fort|independence red fort',16:'Hyderabadi biryani|biryani',18:'Bathukamma|bathukamma',19:'Hawa Mahal Jaipur|jaipur hawa',23:'kite flying India|kite',24:'Kathakali|kathakali',25:'Gateway of India Mumbai|gateway',28:'gulab jamun|gulab'},
x_road:{0:'red traffic light|traffic light',3:'bicycle helmet|helmet',5:'sidewalk pavement|sidewalk pavement',12:'railway level crossing|crossing',13:'bicycle light reflector|bicycle bike',17:'reflective vest high visibility|vest reflective'},
x_health:{19:'adhesive bandage plaster|bandage plaster'}};
const BAD=/(diagram|map|logo|icon|svg|drawing|illustration|engraving|sketch|poster|chart|stamp|cartoon|painting|lithograph|schematic|infographic|book|plate|page|screenshot|mosaic|miniature|relief|bowl|MET[ _]|sf19|naturen|statue|coin|manuscript|stained|fresco|woodcut|print|album|art[ _]project|usfws-.*(growth|series)|cover|scan|wiring|nebula|portrait of)/i;
const UA={headers:{'User-Agent':'GameZoneQuiz/1.0 (educational kids quiz)'}};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=/^(public domain|pd\b|cc0)/i;
const strip=h=>String(h||'').replace(/<[^>]+>/g,'').trim();
async function search(q,st){const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch='+encodeURIComponent('filetype:bitmap '+q+' haswbstatement:'+st)+'&prop=imageinfo&iiprop=extmetadata|url|mime|size&iiurlwidth=960';
 for(let t=0;t<3;t++){try{const j=await (await fetch(u,UA)).json();return j.query?Object.values(j.query.pages).sort((a,b)=>a.index-b.index):[]}catch(e){await sleep(2000)}}return[]}
(async()=>{const out={},used=new Set();
 for(const [tp,m] of Object.entries(Q)){out[tp]={};for(const [i,spec] of Object.entries(m)){const [q,keys]=spec.split('|');const kw=keys.split(/\s+/);let got=null;
  for(const st of ['P275=Q6938433','P6216=Q19652']){const ps=await search(q,st);await sleep(700);
   for(const p of ps){const ii=p.imageinfo&&p.imageinfo[0];if(!ii||!/^image\/(jpeg|png)$/.test(ii.mime)||ii.width<700||ii.height<450)continue;const name=p.title.slice(5);if(BAD.test(name)||used.has(name))continue;if(!kw.some(w=>name.toLowerCase().includes(w)))continue;
    const lic=strip(ii.extmetadata&&ii.extmetadata.LicenseShortName&&ii.extmetadata.LicenseShortName.value);if(!ok.test(lic))continue;
    got={s:ii.thumburl.split('?')[0],page:'https://commons.wikimedia.org/wiki/'+encodeURIComponent(name.replace(/ /g,'_')),license:/^cc0/i.test(lic)?'CC0':'Public domain',file:name,author:''};used.add(name);break}
   if(got)break}
  out[tp][i]=got;console.log(tp,i,q,'->',got?got.file.slice(0,70):'NONE')}}
 fs.writeFileSync(__dirname+'/photos_extra.json',JSON.stringify(out,null,1))})();
