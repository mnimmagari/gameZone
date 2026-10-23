const T=require('./harness.js');const fails={};let checked=0,total=0;const num=s=>+String(s).replace(/[₹,% a-z]/gi,'');
const gcd=(a,b)=>b?gcd(b,a%b):a,lcm=(a,b)=>a/gcd(a,b)*b;
const fail=(k,g,t,l,q)=>{(fails[k]=fails[k]||[]).push(g+'/'+t+'/L'+l+': '+q.p+' | ans='+q.ans)};
const grades=process.argv[3]?process.argv[3].split(','):T.GRADE_OPTIONS.map(g=>g.id);
for(const g of grades){T.set(g,'SCERT','counting',1);for(const tp of T.gradeTopics()){T.set(g,'SCERT',tp.id,1);const pools=T.buildPools();
 for(const [l,qs] of Object.entries(pools))for(const q of qs){total++;const p=q.p,ans=String(q.ans);let m;const a=num(ans);
  if(m=p.match(/^What is the HCF of (\d+) and (\d+)\?/)){checked++;if(a!==gcd(+m[1],+m[2]))fail('hcf',g,tp.id,l,q)}
  else if(m=p.match(/^What is the LCM of (\d+) and (\d+)\?/)){checked++;if(a!==lcm(+m[1],+m[2]))fail('lcm',g,tp.id,l,q)}
  else if(m=p.match(/^What is the HCF \(greatest common factor\) of (\d+) and (\d+)\?/)){checked++;if(a!==gcd(+m[1],+m[2]))fail('hcf0',g,tp.id,l,q)}
  else if(m=p.match(/^What is the LCM \(least common multiple\) of (\d+) and (\d+)\?/)){checked++;if(a!==lcm(+m[1],+m[2]))fail('lcm0',g,tp.id,l,q)}
  else if(m=p.match(/^A (\d+) m rope and a (\d+) m rope/)){checked++;if(a!==gcd(+m[1],+m[2]))fail('hcfWord',g,tp.id,l,q)}
  else if(m=p.match(/^One bell rings every (\d+) minutes and another every (\d+) minutes/)){checked++;if(a!==lcm(+m[1],+m[2]))fail('lcmWord',g,tp.id,l,q)}
  else if(m=p.match(/^Which number is a common factor of (\d+) and (\d+)\?/)){checked++;if(+m[1]%a||+m[2]%a)fail('commonFactor',g,tp.id,l,q);for(const o of q.options.filter(x=>String(x)!==ans))if(+m[1]%+o===0&&+m[2]%+o===0)fail('commonFactor-ambig',g,tp.id,l,q)}
  else if(p==='Which pair of numbers has no common factor other than 1?'){checked++;const [x,y]=ans.split(' and ').map(Number);if(gcd(x,y)!==1)fail('coprime',g,tp.id,l,q);for(const o of q.options.filter(x=>String(x)!==ans)){const [u,v]=o.split(' and ').map(Number);if(gcd(u,v)===1)fail('coprime-ambig',g,tp.id,l,q)}}
  else if(m=p.match(/^(\d+) is what percent of (\d+)\?/)){checked++;if(Math.abs(+m[1]/+m[2]*100-a)>1e-9)fail('findPct',g,tp.id,l,q)}
  else if(m=p.match(/^(\d+)% of a number is (\d+)\./)){checked++;if(Math.abs(+m[2]/(+m[1]/100)-a)>1e-9)fail('wholePct',g,tp.id,l,q)}
  else if(m=p.match(/^The price of a bag is ₹(\d+)\. It (rises|falls) by (\d+)%/)){checked++;const b=+m[1],d=b*+m[3]/100;if(a!==(m[2]==='rises'?b+d:b-d))fail('pctChange',g,tp.id,l,q)}
  else if(m=p.match(/^A shopkeeper buys a toy for ₹(\d+) and sells it for ₹(\d+)\. What is the (loss|profit) percent/)){checked++;const cp=+m[1],sp=+m[2],pc=Math.abs(sp-cp)/cp*100;if(Math.abs(pc-a)>1e-9||(sp<cp)!==(m[3]==='loss'))fail('profitPct',g,tp.id,l,q)}
  else if(m=p.match(/^What is the simple interest on ₹(\d+) at (\d+)% per year for (\d+)/)){checked++;if(a!==+m[1]*+m[2]*+m[3]/100)fail('si',g,tp.id,l,q)}
  else if(m=p.match(/^A number machine multiplies every number by (\d+)\. What comes out when (\d+) goes in\?/)){checked++;if(a!==+m[1]*+m[2])fail('machine1',g,tp.id,l,q)}
  else if(m=p.match(/^A number machine multiplies every number by (\d+)\. The answer is (\d+)\./)){checked++;if(a*+m[1]!==+m[2])fail('machine2',g,tp.id,l,q)}
  else if(m=p.match(/^How many days does February have in the year (\d+)\?/)){checked++;const y=+m[1],leap=y%4===0&&(y%100!==0||y%400===0);if(a!==(leap?29:28))fail('feb',g,tp.id,l,q)}
  else if(p==='Which of these is a leap year?'){checked++;if(!(a%4===0&&(a%100!==0||a%400===0)))fail('leap',g,tp.id,l,q);for(const o of q.options.filter(x=>String(x)!==ans))if(+o%4===0)fail('leap-ambig',g,tp.id,l,q)}
  else if(m=p.match(/^Manu is facing (\w+)\. He turns (right|left|all the way around)\./)){checked++;const D=['north','east','south','west'],f=D.indexOf(m[1]),d=m[2]==='right'?1:m[2]==='left'?3:2;if(String(q.ans)!==D[(f+d)%4])fail('direction',g,tp.id,l,q)}
  else if(m=p.match(/^Triangle 1 has sides (\d+) cm, (\d+) cm and (\d+) cm\. Triangle 2 has sides (\d+) cm, (\d+) cm and (\d+) cm/)){checked++;const A=[+m[1],+m[2],+m[3]].sort((x,y)=>x-y).join(),B=[+m[4],+m[5],+m[6]].sort((x,y)=>x-y).join(),v=[+m[4],+m[5],+m[6]].sort((x,y)=>x-y);if((A===B)!==(ans==='Yes')||v[0]+v[1]<=v[2])fail('congSSS',g,tp.id,l,q);const oa=q.options.map(String);if(new Set(oa).size!==oa.length)fail('congSSS-opts',g,tp.id,l,q)}
  else if(m=p.match(/^How many (faces|edges|corners) does a ([a-z ]+) have\?/)){checked++;const S={cube:[6,12,8],cuboid:[6,12,8],cone:[2,1,1],cylinder:[3,2,0],sphere:[1,0,0],'square pyramid':[5,8,5]},k={faces:0,edges:1,corners:2}[m[1]];if(a!==S[m[2]][k])fail('faces',g,tp.id,l,q)}
  else if(m=p.match(/^Which shape has (more|fewer) corners: a (\w+) or a (\w+)\?/)){checked++;const C={triangle:3,square:4,rectangle:4,pentagon:5,hexagon:6},x=C[m[2]],y=C[m[3]];if(x===y||ans!==((x>y)===(m[1]==='more')?m[2]:m[3]))fail('shapeCmp',g,tp.id,l,q)}
  else if(m=p.match(/^What is (half|one-third|one-quarter|one-fifth) of (\d+)/)){checked++;if(a*{half:2,'one-third':3,'one-quarter':4,'one-fifth':5}[m[1]]!==+m[2])fail('fSetOf',g,tp.id,l,q)}
 }}}
console.log('questions',total,'independently checked',checked);for(const k in fails)console.log('FAIL',k,fails[k].length,'e.g.',fails[k].slice(0,2).join(' ## '));if(!Object.keys(fails).length)console.log('no failures');
