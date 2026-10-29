/* Builds the emoji -> Fluent 3D image map for the Explore bank (checks each URL). Usage: node tools/build_img_map.js <dir with node_modules/unicode-emoji-json and folders.json> */
const fs=require('fs'),path=require('path');
const dir=process.argv[2];
const names=require(path.join(dir,'node_modules/unicode-emoji-json/data-by-emoji.json'));
const folders={};require(path.join(dir,'folders.json')).tree.forEach(x=>{folders[x.path.toLowerCase()]=x.path});
const strip=e=>[...e].filter(c=>c!=='️').join('');
const byBare={};Object.keys(names).forEach(k=>{byBare[strip(k)]=names[k].name});
const bank=require('./explore_bank.js').concat(require('./explore_bank2.js'));
const emojis=[...new Set(bank.flatMap(t=>t.qs.map(q=>q[4])))];
const base='https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/';
const cands=e=>{const n=byBare[strip(e)],f=n&&folders[n.toLowerCase()];if(!f)return[];const l=f.toLowerCase().replace(/ /g,'_');return[f+'/3D/'+l+'_3d.png',f+'/Default/3D/'+l+'_3d_default.png']};
(async()=>{const map={},missing=[];
 await Promise.all(emojis.map(async e=>{for(const c of cands(e)){const r=await fetch(base+c.split('/').map(encodeURIComponent).join('/'),{method:'HEAD'});if(r.ok){map[e]=c;return}}missing.push(e+' '+(byBare[strip(e)]||'?'))}));
 fs.writeFileSync(path.join(dir,'map.json'),JSON.stringify(map));
 console.log('mapped',Object.keys(map).length,'of',emojis.length,'missing:',missing.join(' | '))})();
