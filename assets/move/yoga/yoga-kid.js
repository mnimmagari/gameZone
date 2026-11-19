/* Surya Namaskar yoga child, version 2: human child proportions (about 6 heads tall), rigged for Three.js.
   Cream knitted outfit, headband, ponytail. Tapered limbs, a shaped torso, real feet and hands with fingers.
   Same joint rig for every pose: root > pelvis > spine > head / shoulders > arms; pelvis > legs.
   Usage: const K = MXYoga.build(THREE, { eyes: 'open' | 'closed' });  scene.add(K.root);  K.idle(t);
   K.dim holds the bone lengths (metres). K.setFingers(side, curl, thumb, spread) opens or curls a hand.
   Left = +x (the child faces +z, so her left is on the viewer's right). Height about 1.2 m. */
(function () {
  function knitTex(T, base, repeat) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 8) { const gr = g.createLinearGradient(x, 0, x + 8, 0); gr.addColorStop(0, 'rgba(90,70,40,0)'); gr.addColorStop(.5, 'rgba(90,70,40,.09)'); gr.addColorStop(1, 'rgba(90,70,40,0)'); g.fillStyle = gr; g.fillRect(x, 0, 8, 256); }
    g.strokeStyle = 'rgba(120,96,60,.08)'; g.lineWidth = 1.2;
    for (let y = 0; y < 256; y += 10) for (let x = 0; x < 256; x += 8) { g.beginPath(); g.moveTo(x + 1, y + 8); g.lineTo(x + 4, y); g.lineTo(x + 7, y + 8); g.stroke(); }
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.repeat.set(repeat || 3, repeat || 3); t.anisotropy = 4; return t;
  }
  function build(T, opt) {
    opt = opt || {};
    const D = { thigh: .27, shin: .27, ankle: .062, upper: .22, fore: .2, shoulderW: .135, hipW: .06, torso: .32, neck: .06, headR: .105 };
    D.hipH = D.thigh + D.shin + D.ankle; D.handLen = .1;
    const K = { dim: D };
    const knitMap = knitTex(T, '#fbf6ec', 4);
    const knit = new T.MeshStandardMaterial({ color: 0xffffff, map: knitMap, bumpMap: knitMap, bumpScale: .9, roughness: .95 });
    const knit2 = new T.MeshStandardMaterial({ color: 0xfffaf0, map: knitMap, bumpMap: knitMap, bumpScale: .9, roughness: .95 });
    const skin = new T.MeshStandardMaterial({ color: 0xf2bda3, roughness: .55 });
    const sock = new T.MeshStandardMaterial({ color: 0xfffaf0, roughness: .9 });
    const hairM = new T.MeshStandardMaterial({ color: 0xc19672, roughness: .6 });
    const hairD = new T.MeshStandardMaterial({ color: 0xa27a58, roughness: .6 });
    const dark = new T.MeshStandardMaterial({ color: 0x3a2622, roughness: .5 });
    const sh = m => { m.castShadow = true; return m; };
    const ball = (r, m, sx, sy, sz) => { const g = sh(new T.Mesh(new T.SphereGeometry(r, 20, 14), m)); g.scale.set(sx || 1, sy || 1, sz || 1); return g; };
    const ring = (R0, r, m) => sh(new T.Mesh(new T.TorusGeometry(R0, r, 10, 24), m));
    /* tapered limb segment hanging from its joint: top radius r1 at y=0 down to radius r2 at y=-len, rounded ends */
    const taper = (r1, r2, len, m) => { const g = new T.Group(); const c = sh(new T.Mesh(new T.CylinderGeometry(r1, r2, len, 18, 1), m)); c.position.y = -len / 2; g.add(c); const a = ball(r1, m); g.add(a); const b = ball(r2, m); b.position.y = -len; g.add(b); return g; };

    const root = new T.Group(); K.root = root;
    const pelvis = new T.Group(); pelvis.position.y = D.hipH; root.add(pelvis); K.pelvis = pelvis;
    const hips = ball(.098, knit2, 1.15, .72, .88); hips.position.y = .035; pelvis.add(hips);
    const waist = ring(.1, .016, knit2); waist.rotation.x = Math.PI / 2; waist.position.y = .045; waist.scale.set(1.15, .85, 1); pelvis.add(waist);
    const spine = new T.Group(); pelvis.add(spine); K.spine = spine;
    /* torso: waist to shoulders, flattened front to back */
    const prof = [[.088, .0], [.094, .06], [.104, .13], [.117, .2], [.126, .26], [.118, .31], [.07, .345], [.03, .36]].map(p => new T.Vector2(p[0], p[1]));
    const chest = sh(new T.Mesh(new T.LatheGeometry(prof, 28), knit)); chest.scale.set(1.08, 1, .8); spine.add(chest); K.chest = chest;
    const hem = ring(.093, .02, knit); hem.rotation.x = Math.PI / 2; hem.position.y = .01; hem.scale.set(1.08, .8, 1); spine.add(hem);
    const collar = ring(.052, .016, knit); collar.rotation.x = Math.PI / 2; collar.position.y = .345; spine.add(collar);
    for (let i = 0; i < 3; i++) { const b = ball(.01, dark, 1, 1, .6); b.position.set(0, .28 - i * .05, .099); spine.add(b); }
    const neck = sh(new T.Mesh(new T.CylinderGeometry(.034, .04, .07, 14), skin)); neck.position.y = .375; spine.add(neck);
    /* head: built at the earlier large size and scaled to human proportions */
    const head = new T.Group(); head.position.y = .345 + D.neck + D.headR - .012; spine.add(head); K.head = head;
    const hs = new T.Group(); hs.scale.setScalar(D.headR / .19); head.add(hs); const hd = hs;
    const face = ball(.19, skin, 1.0, 1.08, .98); hd.add(face);
    /* hair: a smooth cap that covers the top and back and comes down to the ears, a soft swept fringe,
       a knit headband, and a long tapered ponytail that arcs up from a hair tie and falls down the back */
    const hairCap = sh(new T.Mesh(new T.SphereGeometry(.2, 44, 30, 0, Math.PI * 2, 0, Math.PI * .6), hairM)); hairCap.rotation.x = -.22; hairCap.position.set(0, .02, -.012); hd.add(hairCap);
    const nape = ball(.17, hairM, 1.0, .9, .85); nape.position.set(0, .0, -.075); hd.add(nape);
    const fr1 = ball(.1, hairM, 1.35, .34, .7); fr1.position.set(.035, .145, .105); fr1.rotation.set(.45, 0, -.22); hd.add(fr1);
    const fr2 = ball(.075, hairM, 1.2, .3, .6); fr2.position.set(-.09, .13, .12); fr2.rotation.set(.5, 0, .3); hd.add(fr2);
    const band = ring(.188, .03, knit); band.rotation.x = Math.PI / 2 - .12; band.position.set(0, .09, 0); hd.add(band);
    const tie = ring(.034, .013, knit2); tie.position.set(0, .075, -.205); tie.rotation.x = 2.79; hd.add(tie);
    const pony = []; const pr = new T.Group(); pr.position.set(0, .075, -.208); hd.add(pr);
    for (let i = 0; i < 20; i++) {
      const seg = new T.Group(); seg.position.y = i ? -.034 : 0;
      if (i) pony[i - 1].add(seg); else pr.add(seg);
      const m = ball(.058 - i * .0021, i % 5 === 4 ? hairD : hairM, 1, 1.85, 1); m.position.y = -.025; seg.add(m);
      seg.rotation.x = i === 0 ? .38 : (i < 12 ? -.025 : .05);
      seg.userData.rx = seg.rotation.x; pony.push(seg);
    }
    K.pony = pony; K.ponyRoot = pr;
    const eyeOpen = [], eyeClosed = [];
    for (const sx of [-1, 1]) {
      const eg = new T.Group(); eg.position.set(sx * .075, .0, .178); eg.scale.set(1.2, 1.2, .6);
      const ew = ball(.038, new T.MeshStandardMaterial({ color: 0xffffff, roughness: .3 }), 1, 1.2, .5), ir = ball(.025, new T.MeshStandardMaterial({ color: 0x6b4426, roughness: .25 }), 1.1, 1.25, .5), pu = ball(.013, new T.MeshStandardMaterial({ color: 0x120c0a, roughness: .3 }), 1, 1.2, .5), hl = new T.Mesh(new T.SphereGeometry(.007, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff }));
      ir.position.z = .014; pu.position.z = .02; hl.position.set(.009, .013, .028); const hl2 = new T.Mesh(new T.SphereGeometry(.0045, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff })); hl2.position.set(-.009, -.011, .027); eg.add(ew, ir, pu, hl, hl2); hd.add(eg); eyeOpen.push(eg);
      const ec = new T.Mesh(new T.TorusGeometry(.03, .005, 6, 14, Math.PI), dark); ec.position.set(sx * .075, -.004, .185); ec.rotation.z = Math.PI; ec.scale.set(1, .8, 1); ec.visible = false; hd.add(ec); eyeClosed.push(ec);
      const br = new T.Mesh(new T.TorusGeometry(.04, .0055, 6, 14, Math.PI * .55), hairD); br.rotation.z = Math.PI * .22 + (sx > 0 ? 0 : Math.PI * .23); br.position.set(sx * .078, .035, .182); br.scale.set(1, .6, 1); hd.add(br);
      const lid = new T.Mesh(new T.TorusGeometry(.04, .0055, 6, 16, Math.PI), dark); lid.position.set(sx * .075, .014, .19); lid.scale.set(1, .6, 1); hd.add(lid);
      const lash = new T.Mesh(new T.CapsuleGeometry(.0042, .02, 3, 6), dark); lash.position.set(sx * .112, .03, .182); lash.rotation.z = -sx * 1.0; hd.add(lash);
      const ch = new T.Mesh(new T.CircleGeometry(.037, 18), new T.MeshBasicMaterial({ color: 0xff8f9a, transparent: true, opacity: .55 })); ch.position.set(sx * .118, -.05, .16); ch.rotation.y = sx * .6; hd.add(ch);
    }
    K.eyeOpen = eyeOpen; K.eyeClosed = eyeClosed;
    const nose = ball(.012, new T.MeshStandardMaterial({ color: 0xe5a58a, roughness: .6 })); nose.position.set(0, -.03, .194); hd.add(nose);
    const mouth = new T.Mesh(new T.TorusGeometry(.026, .006, 6, 16, Math.PI), new T.MeshStandardMaterial({ color: 0xc4605e, roughness: .5 })); mouth.rotation.z = Math.PI; mouth.position.set(0, -.072, .184); hd.add(mouth); K.mouth = mouth;
    /* freckles across the nose, and an open happy smile (a closed smile for breathing and holds) */
    const frM = new T.MeshBasicMaterial({ color: 0xc98d6f, transparent: true, opacity: .6 });
    for (const [fx, fy] of [[.03, -.012], [-.03, -.012], [.055, -.03], [-.055, -.03], [.02, -.042], [-.02, -.042]]) { const fr = new T.Mesh(new T.CircleGeometry(.0045, 8), frM); fr.position.set(fx, fy, .98 * Math.sqrt(Math.max(0, .0361 - fx * fx - (fy / 1.08) * (fy / 1.08))) + .004); hd.add(fr); }
    const mouthOpen = new T.Group(); mouthOpen.position.set(0, -.066, .18); hd.add(mouthOpen);
    const mIn = new T.Mesh(new T.CircleGeometry(.034, 22, Math.PI, Math.PI), new T.MeshBasicMaterial({ color: 0x8c2f36, side: T.DoubleSide })); mIn.scale.set(1.15, 1, 1); mouthOpen.add(mIn);
    const tg = new T.Mesh(new T.CircleGeometry(.019, 16, Math.PI, Math.PI), new T.MeshBasicMaterial({ color: 0xf08a9a, side: T.DoubleSide })); tg.position.set(0, -.016, .001); mouthOpen.add(tg);
    const teeth = new T.Mesh(new T.PlaneGeometry(.04, .008), new T.MeshBasicMaterial({ color: 0xffffff })); teeth.position.set(0, -.004, .001); mouthOpen.add(teeth);
    const dimple = new T.Mesh(new T.CircleGeometry(.0045, 8), new T.MeshBasicMaterial({ color: 0xc4605e })); const dimple2 = dimple.clone(); dimple.position.set(-.045, -.002, .0); dimple2.position.set(.045, -.002, .0); mouthOpen.add(dimple, dimple2);
    K.setMouth = open => { mouthOpen.visible = open; mouth.visible = !open; }; K.setMouth(true); K.talk = a => { mouthOpen.scale.set(1 + .1 * a, .35 + .75 * a, 1); }; K.talk(.6);
    K.setEyes = mode => { for (const e of eyeOpen) e.visible = mode !== 'closed'; for (const e of eyeClosed) e.visible = mode === 'closed'; };
    K.setEyes(opt.eyes || 'open');

    /* ---------- hands with fingers (hang from the wrist; fingers point down -y; the palm faces +z) ---------- */
    const makeHand = side => {                                   /* side +1 = left hand (+x), -1 = right */
      const h = new T.Group(); const fingers = [], thumb = {};
      const palm = ball(.034, skin, 1.12, 1.25, .42); palm.position.y = -.04; h.add(palm);
      const lens = [.038, .044, .041, .033];
      for (let i = 0; i < 4; i++) {
        const base = new T.Group(); base.position.set((i - 1.5) * .0152, -.075, 0); h.add(base);
        const L = lens[i], s1 = taper(.0085, .0075, L * .55, skin), s2g = new T.Group(); s2g.position.y = -L * .55; s1.add(s2g);
        const s2 = taper(.0075, .0065, L * .45, skin); s2g.add(s2); base.add(s1); fingers.push({ base, mid: s2g });
      }
      const tb = new T.Group(); tb.position.set(side * .03, -.03, .01); tb.rotation.z = -side * .3; h.add(tb);
      const t1 = taper(.0105, .0092, .03, skin), t2g = new T.Group(); t2g.position.y = -.03; t1.add(t2g); const t2 = taper(.0092, .008, .026, skin); t2g.add(t2); tb.add(t1); thumb.base = tb; thumb.mid = t2g;
      h.userData = { fingers, thumb, side };
      return h;
    };
    const setFingers = (h, curl, thumbCurl, spread) => {
      const U = h.userData; curl = curl == null ? .15 : curl; thumbCurl = thumbCurl == null ? curl : thumbCurl; spread = spread || 0;
      U.fingers.forEach((f, i) => { f.base.rotation.x = -curl * 1.25; f.mid.rotation.x = -curl * 1.5; f.base.rotation.z = (i - 1.5) * spread; });
      U.thumb.base.rotation.x = -thumbCurl * .7; U.thumb.mid.rotation.x = -thumbCurl * .9;
    };
    K.setFingers = (side, curl, thumb, spread) => setFingers(side > 0 ? K.armL.hand : K.armR.hand, curl, thumb, spread);

    /* ---------- arms: shoulder > upper > fore > hand ---------- */
    const arm = side => {
      const shg = new T.Group(); shg.position.set(side * D.shoulderW, D.torso - .02, 0); spine.add(shg);
      const cap = ball(.045, knit, 1, 1, 1); cap.position.y = -.012; shg.add(cap);
      const up = new T.Group(); shg.add(up);
      const um = taper(.05, .041, D.upper, knit); up.add(um);
      const fore = new T.Group(); fore.position.y = -D.upper; up.add(fore);
      const fm = taper(.04, .031, D.fore * .86, knit); fore.add(fm);
      const cuff = ring(.032, .011, knit2); cuff.rotation.x = Math.PI / 2; cuff.position.y = -D.fore * .86; fore.add(cuff);
      const wrist = taper(.026, .024, D.fore * .16, skin); wrist.position.y = -D.fore * .86; fore.add(wrist);
      const hand = makeHand(side); hand.position.y = -D.fore; fore.add(hand); setFingers(hand, .15, .15, 0);
      return { sh: shg, up, fore, hand };
    };
    K.armL = arm(1); K.armR = arm(-1);

    /* ---------- legs: thigh > shin > foot (knit trousers, ribbed cuffs, cream socks) ---------- */
    const leg = side => {
      const thigh = new T.Group(); thigh.position.set(side * D.hipW, 0, 0); pelvis.add(thigh);
      const tm = taper(.072, .054, D.thigh, knit2); thigh.add(tm);
      const shin = new T.Group(); shin.position.y = -D.thigh; thigh.add(shin);
      const sm = taper(.052, .04, D.shin * .93, knit2); shin.add(sm);
      const cuff = ring(.04, .012, knit); cuff.rotation.x = Math.PI / 2; cuff.position.y = -D.shin * .93; shin.add(cuff);
      const foot = new T.Group(); foot.position.y = -D.shin; shin.add(foot);
      const heel = sh(new T.Mesh(new T.CapsuleGeometry(.04, .07, 8, 14), sock)); heel.rotation.x = Math.PI / 2; heel.position.set(0, -.021, .04); foot.add(heel);
      const toes = new T.Group(); toes.position.set(0, -.02, .1); foot.add(toes);
      const tm2 = sh(new T.Mesh(new T.CapsuleGeometry(.036, .03, 8, 12), sock)); tm2.rotation.x = Math.PI / 2; tm2.position.set(0, -.001, .022); toes.add(tm2);
      /* coral trainers that go on over the socks (hidden unless the game asks for them) */
      const shoe = new T.Group(); shoe.visible = false;
      const sb = sh(new T.Mesh(new T.CapsuleGeometry(.05, .11, 8, 14), new T.MeshStandardMaterial({ color: 0xe5805f, roughness: .6 }))); sb.rotation.x = Math.PI / 2; sb.position.set(0, -.012, .07);
      const so = sh(new T.Mesh(new T.BoxGeometry(.1, .014, .22), new T.MeshStandardMaterial({ color: 0xfff6ee, roughness: .7 }))); so.position.set(0, -.064, .07); shoe.add(sb, so);   /* only attached to the foot while worn, so measurements ignore it */
      return { thigh, shin, foot, toes, shoe };
    };
    K.legL = leg(1); K.legR = leg(-1);
    K.setShoes = on => { for (const L of [K.legL, K.legR]) { if (on && L.shoe.parent !== L.foot) L.foot.add(L.shoe); else if (!on && L.shoe.parent) L.shoe.parent.remove(L.shoe); L.shoe.visible = on; } };
    const sockC0 = sock.color.clone(); K.setBare = on => sock.color.copy(on ? skin.color : sockC0);
    K.idle = function (t) {
      const b = Math.sin(t * 1.8); K.chest.scale.set(1.08 * (1 + .01 * b), 1 + .014 * b, .8 * (1 + .01 * b));
      pony.forEach((p, i) => { p.rotation.set(p.userData.rx, 0, Math.sin(t * 1.6 - i * .5) * .07 * (i + 1) * .5); });
      /* when the head tips forward or down, swing the ponytail to the side so hair never hangs over the face */
      { const q = K.head.getWorldQuaternion(new T.Quaternion()), up = new T.Vector3(0, 1, 0).applyQuaternion(q), fwd = new T.Vector3(0, 0, 1).applyQuaternion(q), tilt = Math.max(0, Math.min(1, (.75 - up.y) / .6)) + Math.max(0, Math.min(1, (fwd.y * -1 - .3) / .5)) * 0; K.ponyRoot.rotation.y += (tilt * 1.35 - K.ponyRoot.rotation.y) * .25;
        /* gravity: when the head is tipped, every ponytail segment turns a little towards the floor so the hair hangs down instead of sticking out */
        if (tilt > .02) {
          const down = new T.Vector3(0, -1, 0), qp = new T.Quaternion(), qw = new T.Quaternion(), qd = new T.Quaternion(), cur = new T.Vector3(), id = new T.Quaternion();
          K.ponyRoot.updateMatrixWorld(true);
          for (let i = 0; i < K.pony.length; i++) {
            const sg = K.pony[i]; sg.parent.getWorldQuaternion(qp); sg.getWorldQuaternion(qw); cur.set(0, -1, 0).applyQuaternion(qw);
            const ang = cur.angleTo(down); if (ang < .01) continue;
            qd.setFromUnitVectors(cur, down); qd.slerp(id, 1 - Math.min(1, (.55 * tilt) / ang));
            sg.quaternion.premultiply(qp.clone().invert().multiply(qd).multiply(qp)); sg.updateMatrixWorld(true);
            /* hair that reaches the mat lies along it instead of going through it */
            if (sg.getWorldPosition(cur).y < (K.floorY || 0) + .045) {
              sg.getWorldQuaternion(qw); const dn = new T.Vector3(0, -1, 0).applyQuaternion(qw), hz = new T.Vector3(dn.x, 0, dn.z); if (hz.lengthSq() < 1e-4) hz.set(0, 0, -1); hz.normalize();
              const q2 = new T.Quaternion().setFromUnitVectors(dn, hz); sg.parent.getWorldQuaternion(qp); sg.quaternion.premultiply(qp.clone().invert().multiply(q2).multiply(qp)); sg.updateMatrixWorld(true);
            }
          }
        }
      }
      K.head.rotation.z = Math.sin(t * .55) * .025; K.head.rotation.y = Math.sin(t * .37) * .035;
      const bl = (t % 4.5) < .12 ? .15 : 1; if (eyeOpen[0].visible) for (const e of eyeOpen) e.scale.y = bl;
    };
    return K;
  }
  window.MXYoga = { build };
})();
