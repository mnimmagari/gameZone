/* Adds Openverse search fallbacks / new photo subjects to visual_plan.js (topic, index in bank order, new spec). */
const fs=require('fs');const f=__dirname+'/visual_plan.js';let s=fs.readFileSync(f,'utf8');
const plan=require('./visual_plan.js');
const E=[
['x_evs',0,'S:seedling plant sunlight'],['x_evs',6,'P:Apple|S:red apple fruit'],['x_evs',17,'P:Calf|S:cow calf'],
['x_space',15,'P:Meteoroid|S:meteor shooting star night sky'],
['x_animals',4,'P:Elephant|S:african elephant'],['x_animals',10,'P:Giraffe|S:giraffe savanna'],['x_animals',17,'S:male lion mane'],
['x_eco',0,'S:recycling bins'],['x_eco',2,'S:water tap running'],['x_eco',10,'S:factory chimney smoke'],['x_eco',16,'S:plastic waste pollution'],['x_eco',17,'S:light switch'],
['x_tech',0,'S:robot artificial intelligence'],['x_tech',2,'P:Computer_keyboard|S:computer keyboard'],['x_tech',4,'S:programming code screen'],['x_tech',6,'S:padlock'],['x_tech',7,'S:network cables'],['x_tech',9,'P:Computer_monitor|S:computer monitor screen'],['x_tech',13,'S:binary code'],['x_tech',16,'S:wifi router'],['x_tech',17,'P:3D_printing|S:3D printer'],['x_tech',19,'S:gps navigation map'],
['x_india',2,'P:Flag_of_India|S:flag of India waving'],['x_india',3,'P:Ashoka_Chakra|S:Ashoka Chakra'],
['x_road',1,'S:green traffic light'],['x_road',7,'S:amber traffic light'],
['x_health',3,'P:Salad|S:green salad bowl']
];
E.forEach(([t,i,v])=>{plan[t][i]=v});
const out='/* What each Explore question shows. Per topic, one entry per question (same order as the bank):\n   \'P:Title\'  = lead photo of that Wikipedia article (open licence, credited)\n   \'S:query\'  = Openverse search for an open-licence photo; \'P:Title|S:query\' tries Wikipedia first, then Openverse\n   \'I\'        = 3D icon only (no suitable real photo)\n   \'N\'        = no picture at all (the quiz layout drops the picture area)\n   A photo that cannot be found or loaded falls back to the 3D icon. */\nmodule.exports={\n'+Object.entries(plan).map(([k,a])=>k+':'+JSON.stringify(a).replace(/"/g,"'")).join(',\n')+'\n};\n';
fs.writeFileSync(f,out);console.log('plan updated');
