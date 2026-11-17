/* Surya Namaskar yoga child: ONE consistent, rigged 3D character (Three.js).
   Soft clay-doll proportions, cream knitted outfit, headband and ponytail, in the style of the reference.
   Same joint rig for every pose and animation: root > pelvis > spine > head / arms; pelvis > legs.
   Usage: const K = MXYoga.build(THREE, { eyes: 'open' | 'closed' });  scene.add(K.root);  K.idle(timeSeconds);
   Units are metres; the child faces +z; her height is about 1.12 m. */
(function () {
  function knitTex(T, base, repeat) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 8) { const gr = g.createLinearGradient(x, 0, x + 8, 0); gr.addColorStop(0, 'rgba(90,70,40,0)'); gr.addColorStop(.5, 'rgba(90,70,40,.16)'); gr.addColorStop(1, 'rgba(90,70,40,0)'); g.fillStyle = gr; g.fillRect(x, 0, 8, 256); }
    g.strokeStyle = 'rgba(120,96,60,.12)'; g.lineWidth = 1.2;
    for (let y = 0; y < 256; y += 10) for (let x = 0; x < 256; x += 8) { g.beginPath(); g.moveTo(x + 1, y + 8); g.lineTo(x + 4, y); g.lineTo(x + 7, y + 8); g.stroke(); }
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.repeat.set(repeat || 3, repeat || 3); t.anisotropy = 4; return t;
  }
  function build(T, opt) {
    opt = opt || {};
    const K = {}, R = Math.PI / 180;
    const knitMap = knitTex(T, '#f4ecdc', 4);
    const knit = new T.MeshStandardMaterial({ color: 0xffffff, map: knitMap, bumpMap: knitMap, bumpScale: .9, roughness: .95 });
    const knit2 = new T.MeshStandardMaterial({ color: 0xfffaf0, map: knitMap, bumpMap: knitMap, bumpScale: .9, roughness: .95 });
    const skin = new T.MeshStandardMaterial({ color: 0xf2bda3, roughness: .55 });
    const sock = new T.MeshStandardMaterial({ color: 0xfffaf0, roughness: .9 });
    const hairM = new T.MeshStandardMaterial({ color: 0xc19672, roughness: .6 });
    const hairD = new T.MeshStandardMaterial({ color: 0xa27a58, roughness: .6 });
    const dark = new T.MeshStandardMaterial({ color: 0x3a2622, roughness: .5 });
    const cap = (r, l, m) => { const g = new T.Mesh(new T.CapsuleGeometry(r, l, 8, 16), m); g.castShadow = true; return g; };
    const ball = (r, m, sx, sy, sz) => { const g = new T.Mesh(new T.SphereGeometry(r, 24, 18), m); g.scale.set(sx || 1, sy || 1, sz || 1); g.castShadow = true; return g; };
    const ring = (R0, r, m) => { const g = new T.Mesh(new T.TorusGeometry(R0, r, 10, 28), m); g.castShadow = true; return g; };

    const root = new T.Group(); K.root = root;
    const pelvis = new T.Group(); pelvis.position.y = .508; root.add(pelvis); K.pelvis = pelvis;
    const hips = cap(.1, .05, knit2); hips.rotation.z = Math.PI / 2; hips.scale.set(1, 1, .95); pelvis.add(hips);
    const spine = new T.Group(); pelvis.add(spine); K.spine = spine;
    /* sweater */
    const chest = cap(.115, .13, knit); chest.position.y = .15; spine.add(chest); K.chest = chest;
    const hem = ring(.108, .022, knit); hem.rotation.x = Math.PI / 2; hem.position.y = .03; hem.scale.set(1, .95, 1); spine.add(hem);
    const collar = ring(.062, .018, knit); collar.rotation.x = Math.PI / 2; collar.position.y = .285; spine.add(collar);
    for (let i = 0; i < 3; i++) { const b = ball(.011, dark, 1, 1, .6); b.position.set(0, .26 - i * .045, .114); spine.add(b); }   /* button placket */
    /* neck and head */
    const neck = cap(.035, .03, skin); neck.position.y = .3; spine.add(neck);
    const head = new T.Group(); head.position.y = .45; spine.add(head); K.head = head;
    const face = ball(.19, skin, 1.02, 1, .98); head.add(face);
    /* hair: cap, side-swept fringe, ponytail */
    const hairCap = new T.Mesh(new T.SphereGeometry(.2, 32, 22, 0, Math.PI * 2, 0, Math.PI * .56), hairM); hairCap.rotation.x = -.18; hairCap.position.set(0, .012, -.008); hairCap.castShadow = true; head.add(hairCap);
    for (let i = 0; i < 5; i++) { const f = ball(.04, hairM, 1.7, .6, .8); f.position.set(-.1 + i * .05, .1 - Math.abs(i - 1.6) * .006, .172); f.rotation.z = (i - 2) * .22; head.add(f); }   /* soft side-swept fringe, tucked under the headband */
    const sideL = ball(.05, hairM, .7, 1.3, .8); sideL.position.set(-.18, .03, -.05); head.add(sideL); const sideR = sideL.clone(); sideR.position.x = .185; head.add(sideR);
    const band = ring(.188, .03, knit); band.rotation.x = Math.PI / 2 - .12; band.position.set(0, .085, 0); band.scale.set(1.02, 1, 1.0); head.add(band);
    /* ponytail: five soft segments that can sway */
    const tie = ring(.032, .012, knit2); tie.position.set(0, .12, -.2); tie.rotation.x = Math.PI / 2 - .5; head.add(tie);
    const pony = []; let parent = new T.Group(); parent.position.set(0, .13, -.205); head.add(parent);
    for (let i = 0; i < 5; i++) { const seg = new T.Group(); seg.position.y = i ? -.07 : 0; if (i) pony[i - 1].add(seg); else parent.add(seg); const m = ball(.055 - i * .004, i % 2 ? hairD : hairM, 1, 1.4, 1); m.position.y = -.04; seg.add(m); seg.rotation.x = .25; pony.push(seg); }
    K.pony = pony;
    /* face: eyes (open or closed), brows, cheeks, nose, mouth */
    const eyeOpen = [], eyeClosed = [];
    for (const sx of [-1, 1]) {
      const eg = new T.Group(); eg.position.set(sx * .075, .0, .178);
      const ew = ball(.04, new T.MeshStandardMaterial({ color: 0xffffff, roughness: .3 }), 1, 1.25, .5), ir = ball(.026, new T.MeshStandardMaterial({ color: 0x5a3a28, roughness: .3 }), 1, 1.25, .5), pu = ball(.014, new T.MeshStandardMaterial({ color: 0x120c0a, roughness: .3 }), 1, 1.2, .5), hl = new T.Mesh(new T.SphereGeometry(.008, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff }));
      ir.position.z = .014; pu.position.z = .02; hl.position.set(.01, .013, .027); eg.add(ew, ir, pu, hl); head.add(eg); eyeOpen.push(eg);
      const ec = new T.Mesh(new T.TorusGeometry(.03, .005, 6, 14, Math.PI), dark); ec.position.set(sx * .075, -.004, .185); ec.rotation.z = Math.PI; ec.scale.set(1, .8, 1); ec.visible = false; head.add(ec); eyeClosed.push(ec);
      const br = new T.Mesh(new T.CapsuleGeometry(.006, .04, 3, 6), hairD); br.rotation.z = Math.PI / 2 + sx * .06; br.position.set(sx * .075, .055, .186); head.add(br);
      const ch = new T.Mesh(new T.CircleGeometry(.032, 18), new T.MeshBasicMaterial({ color: 0xf08a8a, transparent: true, opacity: .45 })); ch.position.set(sx * .12, -.05, .16); ch.rotation.y = sx * .6; head.add(ch);
    }
    K.eyeOpen = eyeOpen; K.eyeClosed = eyeClosed;
    const nose = ball(.012, new T.MeshStandardMaterial({ color: 0xe5a58a, roughness: .6 })); nose.position.set(0, -.03, .194); head.add(nose);
    const mouth = new T.Mesh(new T.TorusGeometry(.028, .006, 6, 16, Math.PI), new T.MeshStandardMaterial({ color: 0xc4605e, roughness: .5 })); mouth.rotation.z = Math.PI; mouth.position.set(0, -.07, .184); head.add(mouth); K.mouth = mouth;
    K.setEyes = mode => { for (const e of eyeOpen) e.visible = mode !== 'closed'; for (const e of eyeClosed) e.visible = mode === 'closed'; };
    K.setEyes(opt.eyes || 'open');
    /* arms: shoulder > upper > fore > hand (knit sleeves with ribbed cuffs) */
    const arm = side => {
      const sh = new T.Group(); sh.position.set(side * .15, .26, 0); spine.add(sh);
      const up = new T.Group(); sh.add(up);
      const um = cap(.046, .1, knit); um.position.y = -.11; up.add(um);
      const fore = new T.Group(); fore.position.y = -.22; up.add(fore);
      const fm = cap(.041, .1, knit); fm.position.y = -.1; fore.add(fm);
      const cuff = ring(.04, .012, knit2); cuff.rotation.x = Math.PI / 2; cuff.position.y = -.195; fore.add(cuff);
      const hand = new T.Group(); hand.position.y = -.22; fore.add(hand);
      const palm = ball(.038, skin, .9, 1.25, .7); palm.position.y = -.025; hand.add(palm);
      const thumb = ball(.015, skin, 1, 1.5, 1); thumb.position.set(side * -.03, -.02, .02); hand.add(thumb);
      return { sh, up, fore, hand };
    };
    K.armL = arm(1); K.armR = arm(-1);   /* left = +x: the child faces +z, so her left is on the viewer's right */
    /* legs: thigh > shin > foot (knit trousers, ribbed ankle cuffs, cream socks) */
    const leg = side => {
      const thigh = new T.Group(); thigh.position.set(side * .062, 0, 0); pelvis.add(thigh);
      const tm = cap(.062, .1, knit2); tm.position.y = -.12; thigh.add(tm);
      const shin = new T.Group(); shin.position.y = -.22; thigh.add(shin);
      const sm = cap(.052, .1, knit2); sm.position.y = -.11; shin.add(sm);
      const cuff = ring(.05, .014, knit); cuff.rotation.x = Math.PI / 2; cuff.position.y = -.2; shin.add(cuff);
      const foot = new T.Group(); foot.position.y = -.22; shin.add(foot);
      const fm = cap(.05, .07, sock); fm.rotation.x = Math.PI / 2; fm.position.set(0, -.018, .035); foot.add(fm);
      return { thigh, shin, foot };
    };
    K.legL = leg(1); K.legR = leg(-1);
    /* idle: breathing, blink, ponytail sway (pose engines call this every frame) */
    K.idle = function (t) {
      K.chest.scale.set(1 + .012 * Math.sin(t * 1.8), 1 + .018 * Math.sin(t * 1.8), 1 + .012 * Math.sin(t * 1.8));
      pony.forEach((p, i) => { p.rotation.z = Math.sin(t * 1.6 - i * .5) * .08 * (i + 1) * .5; });
      const bl = (t % 4.5) < .12 ? .15 : 1; if (eyeOpen[0].visible) for (const e of eyeOpen) e.scale.y = bl;
    };
    return K;
  }
  window.MXYoga = { build };
})();
