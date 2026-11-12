/* applies tools/photos_fix.json + hand-reviewed text fixes to the EXPLORE bank in index.html */
const fs=require('fs'),f=__dirname+'/../index.html';let h=fs.readFileSync(f,'utf8');
const m=h.match(/var EXPLORE=(\[.*?\]);\r?\n/s);const E=JSON.parse(m[1]);const by=Object.fromEntries(E.map(t=>[t.id,t]));
const ex=require('./photos_fix.json');let n=0;
for(const t in ex)for(const i in ex[t])if(ex[t][i]){by[t].qs[i][5]=Object.assign({author:''},ex[t][i]);n++}
delete by.x_tech.qs[19][5];   /* HP printer-head photo rejected earlier: keep the drawn scene */
by.x_eco.qs[5][0]='Why is plastic harmful to sea animals?';
by.x_india.qs[27][0]='In which Indian sport does a raider tag players of the other team while chanting?';
h=h.replace(m[1],()=>JSON.stringify(E));fs.writeFileSync(f,h);console.log('photos',n);
