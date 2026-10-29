/* Adds 10 more distinct questions to every Explore topic (3 sets each), checks the whole bank for duplicates / near-duplicates,
   then rewrites explore_bank.js, explore_bank2.js and visual_plan.js. Run once from the project root: node tools/add_more.js
   Question format: [prompt, answer, [3 wrong answers], hint, emoji, picture spec]  (spec: N / I / P:Title / S:query, leading ! = reveal after answering) */
const fs=require('fs'),path=require('path');
const banks=require('./explore_bank.js').concat(require('./explore_bank2.js'));
const plan=require('./visual_plan.js');
banks.forEach(t=>{t.qs=t.qs.map((q,i)=>[q[0],q[1],q[2],q[3],q[4],plan[t.id][i]])});
const MORE={
x_evs:[
['Which part of the spinach plant do we eat?','Leaves',['Roots','Seeds','Flowers'],'They are green and soft.','🥬','!P:Spinach'],
['What do we call frozen water?','Ice',['Steam','Dew','Fog'],'It is cold and hard.','🧊','!P:Ice'],
['What happens to water when it boils?','It turns into steam',['It turns into ice','It becomes milk','It turns into sand'],'You can see it rise from a kettle.','♨️','N'],
['Which animal makes a web?','Spider',['Ant','Bee','Butterfly'],'It has eight legs.','🕷️','!P:Spider'],
['Which bird can copy the words that people say?','Parrot',['Hen','Pigeon','Sparrow'],'It is often green and colourful.','🦜','!P:Parrot'],
['What do we call a baby cat?','Kitten',['Puppy','Calf','Cub'],'It says meow.','🐱','!I'],
['Which yellow fruit has a peel that we remove?','Banana',['Strawberry','Grapes','Cherry'],'Monkeys love it.','🍌','!P:Banana'],
['In which direction does the Sun rise?','East',['West','North','South'],'Think of the morning sky.','🌅','N'],
['What should we give to plants to help them grow?','Water and sunlight',['Plastic and stones','Darkness and dust','Smoke and sand'],'Plants are living things too.','🪴','N'],
['Which of these is a flower?','Rose',['Carrot','Potato','Cabbage'],'It has soft petals and thorns on its stem.','🌹','!P:Rose']],
x_space:[
['What is the Sun?','A star',['A planet','A moon','A cloud'],'It is a giant ball of hot gas.','☀️','!I'],
['What force keeps us on the ground?','Gravity',['Magnetism','Friction','Wind'],'It pulls things down towards the Earth.','⬇️','N'],
['What do we call a group of stars that makes a pattern?','A constellation',['A galaxy','A comet','A planet'],'Orion the Hunter is one of them.','✨','!P:Constellation|S:constellation night sky'],
['What do we call a space rock with a glowing tail?','A comet',['An asteroid','A planet','A moon'],'Its tail points away from the Sun.','☄️','!P:Comet'],
['Which planet rolls around the Sun on its side?','Uranus',['Mars','Venus','Jupiter'],'It is a pale blue-green planet.','🪐','!P:Uranus'],
['Who was the first woman to travel in space?','Valentina Tereshkova',['Kalpana Chawla','Sally Ride','Sunita Williams'],'She flew in 1963.','👩‍🚀','!P:Valentina_Tereshkova'],
['Which famous space telescope takes sharp pictures from orbit?','Hubble',['Chandrayaan','Aryabhata','Gaganyaan'],'It orbits high above the Earth.','🔭','!P:Hubble_Space_Telescope'],
['How do astronauts sleep in space?','In sleeping bags fixed to the wall',['On a soft bed','On the floor','Hanging from the ceiling like bats'],'Nothing stays down when you float.','😴','N'],
['Where does the Moon\'s light come from?','It reflects sunlight',['It makes its own light','It gets light from the Earth','It gets light from the stars'],'The Moon is not a star.','🌙','N'],
['What do we call a robot car that explores another planet?','A rover',['A submarine','A tractor','A kite'],'Curiosity is one that explores Mars.','🤖','!P:Rover_(space_exploration)|S:mars rover']],
x_animals:[
['Which is the largest bird in the world?','Ostrich',['Eagle','Peacock','Crow'],'It cannot fly but it runs very fast.','🐦','!P:Common_ostrich'],
['Which animal carries its baby in a pouch?','Kangaroo',['Rabbit','Horse','Monkey'],'It hops on its strong back legs.','🦘','!P:Kangaroo'],
['Which animal eats bamboo and has black and white fur?','Giant panda',['Zebra','Wolf','Hippo'],'It comes from China.','🐼','!P:Giant_panda'],
['What do we call animals that live both on land and in water?','Amphibians',['Mammals','Reptiles','Insects'],'Frogs and newts are examples.','🐸','N'],
['Which animal lives in the icy Arctic and has thick white fur?','Polar bear',['Lion','Camel','Zebra'],'It is a very good swimmer.','🐻‍❄️','!P:Polar_bear'],
['Which bird is a symbol of peace?','Dove',['Eagle','Crow','Owl'],'It is often shown with an olive branch.','🕊️','!S:white dove'],
['Which animal is one of our closest relatives?','Chimpanzee',['Dog','Cow','Parrot'],'It is clever and uses tools.','🐒','!P:Chimpanzee'],
['Which is the smallest bird in the world?','Bee hummingbird',['Sparrow','Crow','Owl'],'It is about the size of a bee.','🐦','!P:Bee_hummingbird'],
['Which sleepy animal eats eucalyptus leaves?','Koala',['Lion','Camel','Tiger'],'It lives in Australia and looks like a teddy bear.','🐨','!P:Koala'],
['Which sea animal has a hard shell and walks sideways?','Crab',['Dolphin','Octopus','Jellyfish'],'It has two big claws.','🦀','!P:Crab']],
x_eco:[
['What happens when too many trees are cut down?','Animals lose their homes',['Rivers become sweeter','The air becomes cleaner','The soil becomes richer'],'Forests are homes for many creatures.','🪓','N'],
['Which bag takes hundreds of years to break down?','A plastic bag',['A paper bag','A cloth bag','A banana leaf'],'It does not rot like leaves.','🛍️','!P:Plastic_bag'],
['What can we do with old clothes that no longer fit us?','Give them to someone who needs them',['Throw them in a river','Burn them','Bury them in the park'],'Sharing helps people and the planet.','👕','N'],
['What can we plant to help bees and butterflies?','Flowers',['Plastic toys','Stones','Metal rods'],'They drink sweet nectar.','🌼','!P:Flower'],
['When is the best time to water plants to save water?','Early morning or evening',['At noon','In the hot afternoon','Never'],'Less water dries up in the cool.','🌅','N'],
['Which layer of air protects us from harmful rays of the Sun?','The ozone layer',['The cloud layer','The sand layer','The rain layer'],'It is high above the Earth.','🌍','!P:Ozone_layer'],
['What happens to the ice at the poles when the Earth gets too warm?','It melts',['It grows bigger','It turns into sand','It turns green'],'Sea levels may rise.','🧊','!P:Polar_ice_cap|S:melting glacier'],
['Which of these is a natural source of fresh water?','A river',['A tap','A bottle','A bucket'],'It flows down from the hills.','🏞️','!P:River'],
['What turns the big blades of a wind turbine?','The wind',['The rain','The Moon','A battery'],'You can feel it on your face.','🌬️','!P:Wind_turbine'],
['Which of these can be recycled again and again?','Glass',['Banana peel','Used tissue','Leftover food'],'Old bottles can become new bottles.','🍾','!S:glass bottles recycling']],
x_tech:[
['Which key do we press to type a capital letter?','Shift',['Enter','Space','Tab'],'Hold it down while you press the letter.','⌨️','N'],
['What do we call a small program on a phone?','An app',['A cable','A battery','A charger'],'It is short for application.','📱','N'],
['Which device helps us listen to sound privately?','Headphones',['Mouse','Keyboard','Webcam'],'You wear them over your ears.','🎧','!P:Headphones'],
['What is called the brain of a computer?','The processor',['The keyboard','The speaker','The cable'],'It does all the thinking and calculating.','💻','!P:Central_processing_unit'],
['What does a QR code do when you scan it with a phone?','Opens information such as a website',['Cooks your food','Cleans the screen','Makes a sound only'],'It looks like a square of tiny black boxes.','📲','!P:QR_code'],
['Which computer is easy to carry in a bag?','A laptop',['A television','A washing machine','A fridge'],'It folds shut like a book.','💻','!P:Laptop'],
['What is a pixel?','A tiny dot that makes up a picture on a screen',['A type of keyboard','A charging cable','A computer game'],'Many of them together make a photo.','🟦','N'],
['Which part of a computer stores our photos and files?','Storage',['Speaker','Screen','Mouse'],'It is like a cupboard for your files.','💾','!P:Hard_disk_drive'],
['Which sign is always in an email address?','@',['#','%','&'],'It is said "at".','📧','N'],
['Which gadget on the wrist tells the time and counts steps?','A smartwatch',['A telescope','A microscope','A bell'],'It talks to your phone.','⌚','!P:Smartwatch']],
x_india:[
['Which tree is the national tree of India?','Banyan',['Pine','Coconut','Oak'],'It has long hanging roots and gives wide shade.','🌳','!P:Ficus_benghalensis'],
['What is the currency of India?','Rupee',['Dollar','Yen','Pound'],'It is written with the sign ₹.','💵','!P:Indian_rupee'],
['Which Indian state is famous for its tea gardens?','Assam',['Rajasthan','Goa','Punjab'],'It is in the north-east of India.','🍵','!S:tea garden Assam'],
['Which festival is famous for flying kites in January?','Makar Sankranti',['Diwali','Holi','Onam'],'It marks the Sun moving north.','🪁','!P:Makar_Sankranti'],
['Which classical dance comes from Kerala?','Kathakali',['Bhangra','Garba','Kuchipudi'],'Dancers wear colourful face paint.','💃','!P:Kathakali'],
['In which city is the Gateway of India?','Mumbai',['Delhi','Chennai','Kolkata'],'It stands by the Arabian Sea.','🏛️','!P:Gateway_of_India'],
['Which is the smallest state of India by area?','Goa',['Kerala','Punjab','Sikkim'],'It is famous for its beaches.','🗺️','N'],
['In which Indian sport does a raider chant "kabaddi, kabaddi"?','Kabaddi',['Chess','Archery','Carrom'],'Two teams try to tag each other.','🤼','!P:Kabaddi'],
['Which Indian sweet is round, soft and soaked in sugar syrup?','Gulab jamun',['Pizza','Cupcake','Ice cream'],'It is made from milk.','🍮','!P:Gulab_jamun'],
['The sitar is a famous Indian...','Musical instrument',['Sport','Dish','Festival'],'It has long strings and a long neck.','🎸','!P:Sitar']],
x_road:[
['What does a "No Entry" sign tell us?','Do not enter this road',['Park here','Drive faster','Stop for lunch'],'It is a red circle with a white bar.','⛔','!P:No_entry_sign|S:no entry sign'],
['What does a "School Ahead" sign warn us about?','Children may be crossing, so slow down',['Speed up','Honk loudly','Stop for a picnic'],'Drivers must be extra careful.','🏫','N'],
['What do traffic signals help drivers and walkers do?','Take turns and stay safe',['Race each other','Take a nap','Dance on the road'],'Red, yellow and green lights tell us when to move.','🚦','N'],
['On which side of the road should a cyclist ride in India?','The left side',['The middle','The right side, against traffic','On the footpath'],'Vehicles in India keep to the left.','🚲','N'],
['What should you do while waiting at a bus stop?','Stand back from the edge of the road',['Stand on the road','Play near the traffic','Lean out to look for the bus'],'Keep a safe distance from vehicles.','🚏','N'],
['What should you do if your ball rolls onto the road?','Ask an adult to get it',['Run after it','Close your eyes and cross','Call your friends to run too'],'A ball is not worth getting hurt.','🏀','N'],
['What do speed breakers on a road make drivers do?','Slow down',['Speed up','Honk louder','Close their eyes'],'They are raised bumps across the road.','🚧','!P:Speed_bump'],
['What should you do after getting off a school bus?','Wait for the bus to move away before crossing',['Cross in front of the bus','Run behind the bus','Hide under the bus'],'Drivers cannot see you right in front.','🚌','N'],
['What do the white lines along a road show?','Lanes for vehicles',['Rivers','Rainbows','Ladders'],'Vehicles stay between them.','🛣️','!S:road lane markings'],
['Who should hold a young child\'s hand when crossing the road?','An adult',['A toy','A baby','Nobody'],'It keeps the child safe.','🤝','N']],
x_health:[
['Which part of our body helps us think?','Brain',['Heart','Stomach','Lungs'],'It sits inside your head.','🧠','!P:Brain'],
['Which organs help us breathe?','Lungs',['Stomach','Kidneys','Skin'],'They fill with air when you breathe in.','🫁','!P:Lung'],
['Which foods help our muscles grow?','Dal and eggs',['Candy and cola','Chips and sweets','Ice pops and soda'],'They are rich in protein.','🥚','N'],
['How often should we visit a dentist for a check-up?','Twice a year',['Never','Once in ten years','Only when it breaks'],'Regular visits keep teeth healthy.','🦷','N'],
['Why do we wear a hat or carry an umbrella in strong sun?','To protect us from the heat and sunburn',['To look funny','To hide from friends','To make a shadow'],'Too much sun can hurt our skin.','🧢','N'],
['Which habit helps protect our eyes?','Reading in good light',['Reading in the dark','Staring at the Sun','Rubbing them with dirty hands'],'Your eyes work hard when it is dim.','👓','N'],
['What can we do to calm down when we feel angry?','Take slow, deep breaths',['Hit something','Shout at everyone','Break toys'],'Breathe in slowly and out slowly.','🧘','N'],
['What is a kind way to make a new friend?','Smile, share and be kind',['Push others','Tease them','Take their things'],'Friends like to be treated well.','🤝','N'],
['Which foods should we eat only a little of?','Sweets and fried snacks',['Fruits','Vegetables','Dal'],'Too much can make us unwell.','🍬','N'],
['How can we keep our ears safe?','Avoid very loud sounds',['Put sticks inside them','Play loud music in them','Pour oil in them'],'Loud noise can hurt hearing.','👂','N']]
};
banks.forEach(t=>{if(!MORE[t.id])throw new Error('no new questions for '+t.id);t.qs=t.qs.concat(MORE[t.id]);if(t.qs.length%10)throw new Error(t.id+' not a multiple of 10: '+t.qs.length)});
/* duplicate / near-duplicate check */
const words=s=>new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3));
const all=banks.flatMap(t=>t.qs.map(q=>({t:t.id,q:q[0],a:q[1],w:words(q[0]+' '+q[1])})));
const sim=[];for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){const A=all[i],B=all[j];if(A.q===B.q||(A.a===B.a&&A.a.length>4)){sim.push('SAME '+A.q+' | '+B.q);continue}const inter=[...A.w].filter(x=>B.w.has(x)).length,u=new Set([...A.w,...B.w]).size;if(u&&inter/u>=.5)sim.push((inter/u).toFixed(2)+' '+A.q+' | '+B.q)}
console.log('similar pairs:',sim.length);sim.forEach(x=>console.log(' ',x));
if(process.argv.includes('--check'))process.exit(0);
const mk=a=>'module.exports=['+a.map(t=>'{id:'+JSON.stringify(t.id)+',name:'+JSON.stringify(t.name)+',icon:'+JSON.stringify(t.icon)+',desc:'+JSON.stringify(t.desc)+',qs:[\n'+t.qs.map(q=>JSON.stringify(q.slice(0,5))).join(',\n')+']}').join(',\n')+'];\n';
fs.writeFileSync(path.join(__dirname,'explore_bank.js'),'/* Explore & Learn question bank (topics 1-6). [prompt, answer, [3 wrong answers], hint, emoji]. */\n'+mk(banks.slice(0,6)));
fs.writeFileSync(path.join(__dirname,'explore_bank2.js'),'/* Explore & Learn question bank (topics 7-8). Same format. */\n'+mk(banks.slice(6)));
fs.writeFileSync(path.join(__dirname,'visual_plan.js'),'/* What each Explore question shows, in bank order.\n   N = no picture area, I = 3D icon, P:Title = Wikipedia lead photo, S:query = Wikimedia Commons search (P:Title|S:query tries both).\n   A leading ! = the picture would give the answer away: it is hidden behind a "think first" card and shown after answering. */\nmodule.exports={\n'+banks.map(t=>t.id+':'+JSON.stringify(t.qs.map(q=>q[5]))).join(',\n')+'\n};\n');
console.log('written:',banks.map(t=>t.id+' '+t.qs.length).join(', '));
