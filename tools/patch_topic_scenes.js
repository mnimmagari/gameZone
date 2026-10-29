// Adds topic-themed welcome + end cards (colour/layout follow the chosen look). Run once: node tools/patch_topic_scenes.js
const fs=require('fs'),path=require('path'),p=path.join(__dirname,'..','index.html');let s=fs.readFileSync(p,'utf8');
if(s.includes('/* topic scenes */')){console.log('already patched');process.exit(0)}
const rep=(a,b)=>{if(!s.includes(a))throw new Error('missing: '+a.slice(0,70));s=s.replace(a,()=>b)};
const CSS=fs.readFileSync(path.join(__dirname,'topic_scenes.css'),'utf8');
const JS=fs.readFileSync(path.join(__dirname,'topic_scenes.js'),'utf8');
const lc=s.lastIndexOf('</style>');s=s.slice(0,lc)+CSS+s.slice(lc);
const ls=s.lastIndexOf('})();');s=s.slice(0,ls)+JS+s.slice(ls);
rep("stage('Maths Quiz','Welcome to the quiz!','Let us have some fun with maths.',false);charStart(panel);","if(exploreOf(quizTopic)){levelLook=xNewLook();levelLook.pre=1}tzStage(panel,gi);charStart(panel);");
rep("say('Welcome to the quiz!',false,finishWelcome","say(tzS().say,false,finishWelcome");
rep("if(qi===0||!levelLook||!XT_META[levelLook.t])levelLook=xNewLook()","if((qi===0&&!(levelLook&&levelLook.pre))||!levelLook||!XT_META[levelLook.t])levelLook=xNewLook()");
rep("ttl=pk2(titles,'__lt'),sm=pk2(smalls,'__ls')","ttl=pk2(tzS().endT,'__lt'),sm=pk2(tzS().endS,'__ls')");
rep("endFx(ttl,sm);say(ttl.replace","endFx(ttl,sm);tzEnd(stars);say(ttl.replace");
fs.writeFileSync(p,s);console.log('patched');
