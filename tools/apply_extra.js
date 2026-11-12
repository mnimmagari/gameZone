/* merges tools/photos_extra.json (public-domain/CC0 photos) into the EXPLORE bank in index.html; REJECT = reviewed by hand and dropped */
const fs=require('fs'),f=__dirname+'/../index.html';let h=fs.readFileSync(f,'utf8');
const REJECT=new Set(['x_evs19','x_animals17','x_animals25','x_animals27','x_tech0','x_road5']);
const ex=require('./photos_extra.json');const m=h.match(/var EXPLORE=(\[.*?\]);\r?\n/s);const E=JSON.parse(m[1]);let n=0;
for(const t of E)for(const [i,e] of Object.entries(ex[t.id]||{})){if(!e||REJECT.has(t.id+i)||(t.qs[i][5]&&t.qs[i][5].s))continue;t.qs[i][5]=e;n++}
h=h.replace(m[1],()=>JSON.stringify(E));fs.writeFileSync(f,h);console.log('added',n);
