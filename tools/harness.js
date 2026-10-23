const {JSDOM}=require('jsdom');const fs=require('fs');
let html=fs.readFileSync(process.argv[2]||'../index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);let code=m[1];
const end=code.lastIndexOf('})();');
code=code.slice(0,end)+"window.__t={GRADE_OPTIONS,set:(g,c,t,l)=>{grade=g;curriculum=c;topic=t;level=l;quizGrade=g;quizCurriculum=c;quizTopic=t},createQuestions,gradeTopics,buildPools,levelAudit,normQ,structKey};"+code.slice(end);
html=html.replace(m[1],'/*S*/');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.ResizeObserver=class{observe(){}disconnect(){}};w.eval(code);
module.exports=w.__t;
