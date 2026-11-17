/* Sunrise yoga room for the Surya Namaskar level (Three.js).
   Soft peach room with an arched alcove, shelves with vases and a candle, pampas grass, a palm plant, a window with
   a rising sun, a wooden platform and a yoga mat that rolls out. Original scene inspired by the reference picture.
   Usage: const R = MXYogaRoom.build(THREE);  scene.add(R.group);  R.update(progress01, timeSeconds);  R.setMat(0..1);
   R.floorY is the top of the mat (put the child's floorY there). */
(function () {
  function tex(T, w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; return t; }
  function build(T) {
    const R = { group: new T.Group() }, G = R.group, M = (c, r, e) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: r == null ? .9 : r }, e || {}));
    const sh = (m, cast, rec) => { m.castShadow = !!cast; m.receiveShadow = rec !== false; return m; };
    /* floor and platform */
    const floor = sh(new T.Mesh(new T.PlaneGeometry(30, 30), M(0xf0cdb9, 1)), false, true); floor.rotation.x = -Math.PI / 2; G.add(floor);
    const plat = sh(new T.Mesh(new T.BoxGeometry(1.6, .05, 2.2), M(0xe7c3a6, .8)), true, true); plat.position.y = .025; G.add(plat);
    const matTex = tex(T, 64, 256, (g, w, h) => { g.fillStyle = '#e9a98f'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; for (let y = 0; y < h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } }, true);
    const mat = sh(new T.Mesh(new T.BoxGeometry(.72, .024, 1.7), M(0xffffff, .85, { map: matTex })), false, true); mat.position.y = .05 + .012; G.add(mat); R.mat = mat;
    R.floorY = .05 + .024;
    /* back wall with an arched alcove */
    const wallM = M(0xf7e6d8, 1), cream = M(0xfaf0e6, .95);
    const outer = new T.Shape(); outer.moveTo(-3.2, 0); outer.lineTo(3.2, 0); outer.lineTo(3.2, 4.2); outer.lineTo(-3.2, 4.2); outer.closePath();
    const hole = new T.Path(); hole.moveTo(-1.35, 0); hole.lineTo(-1.35, 1.9); hole.absarc(0, 1.9, 1.35, Math.PI, 0, true); hole.lineTo(1.35, 0); hole.closePath(); outer.holes.push(hole);
    const wall = sh(new T.Mesh(new T.ExtrudeGeometry(outer, { depth: .32, bevelEnabled: false, curveSegments: 40 }), wallM), false, true); wall.position.set(0, 0, -3.35); G.add(wall);
    const side = sh(new T.Mesh(new T.PlaneGeometry(14, 4.2), wallM), false, true); side.position.set(-7.2 - 0, 2.1, -3.0); side.visible = false; G.add(side);
    const rib = new T.Mesh(new T.TorusGeometry(1.42, .07, 12, 48, Math.PI), cream); rib.position.set(0, 1.9, -3.03); G.add(rib);
    const back = sh(new T.Mesh(new T.PlaneGeometry(2.8, 3.4), M(0xf0cdb8, 1, { emissive: 0x7a4a3a, emissiveIntensity: .12 })), false, true); back.position.set(0, 1.7, -3.5); G.add(back);
    /* knitted white panel on the left, like the reference */
    const knit = tex(T, 128, 128, (g, w, h) => { g.fillStyle = '#f7f1e8'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 6) { g.fillStyle = 'rgba(150,120,90,.12)'; g.fillRect(x, 0, 2, h); } }, true); knit.repeat.set(5, 2);
    const panel = sh(new T.Mesh(new T.PlaneGeometry(3.6, 3.8), M(0xffffff, 1, { map: knit })), false, true); panel.position.set(-4.9, 1.9, -3.0); panel.rotation.y = .35; G.add(panel);
    /* shelves, vases, candle */
    const shelfM = M(0xf3dccb, .9);
    for (const y of [.95, 1.75]) { const s = sh(new T.Mesh(new T.BoxGeometry(2.7, .06, .34), shelfM), true, true); s.position.set(0, y, -3.28); G.add(s); }
    const lathe = (pts, m) => sh(new T.Mesh(new T.LatheGeometry(pts.map(p => new T.Vector2(p[0], p[1])), 28), m), true, true);
    const vaseM = M(0xf6e9dd, .8), vaseP = M(0xe8bfa8, .8);
    const vase1 = lathe([[0, 0], [.07, 0], [.09, .09], [.06, .18], [.04, .22], [.05, .26], [0, .26]], vaseM); vase1.position.set(-.7, 1.0, -3.28); G.add(vase1);
    const vase2 = lathe([[0, 0], [.09, 0], [.12, .12], [.1, .22], [.05, .3], [.04, .34], [0, .34]], vaseP); vase2.position.set(.75, 1.0, -3.28); G.add(vase2);
    const vase3 = lathe([[0, 0], [.06, 0], [.07, .08], [.05, .15], [0, .15]], vaseM); vase3.position.set(-.5, 1.8, -3.28); G.add(vase3);
    const candleBody = sh(new T.Mesh(new T.CylinderGeometry(.05, .05, .09, 16), M(0xfff1dd, .6)), false, false); candleBody.position.set(.55, 1.84, -3.28); G.add(candleBody);
    const flame = new T.Mesh(new T.SphereGeometry(.028, 12, 10), new T.MeshBasicMaterial({ color: 0xffd9a0 })); flame.scale.set(1, 1.6, 1); flame.position.set(.55, 1.93, -3.28); G.add(flame); R.flame = flame;
    const candleLight = new T.PointLight(0xffc98a, 1.4, 3.5, 2); candleLight.position.set(.55, 1.95, -3.1); G.add(candleLight); R.candle = candleLight;
    const bowl = lathe([[0, 0], [.08, 0], [.15, .05], [.17, .09], [.15, .09], [.08, .04], [0, .03]], vaseP); bowl.position.set(.1, 1.75, -3.28); G.add(bowl);
    /* pampas grass in a tall vase (left) and a palm plant in a pot (right) */
    const bigVase = lathe([[0, 0], [.16, 0], [.22, .2], [.2, .5], [.12, .8], [.1, .95], [0, .95]], M(0xf0cdb9, .8)); bigVase.position.set(-2.4, 0, -2.6); G.add(bigVase);
    const grassM = M(0xf2e2c8, .9);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, tilt = .12 + (i % 4) * .08, st = sh(new T.Mesh(new T.CylinderGeometry(.004, .006, .9 + (i % 3) * .15, 5), M(0xdcc9a8, 1)), false, false); st.position.set(-2.4 + Math.cos(a) * .05, 1.4, -2.6 + Math.sin(a) * .05); st.rotation.z = Math.cos(a) * tilt; st.rotation.x = Math.sin(a) * tilt; G.add(st); const tuft = sh(new T.Mesh(new T.SphereGeometry(.05, 10, 8), grassM), false, false); tuft.scale.set(.7, 2.3, .7); tuft.position.set(st.position.x + Math.cos(a) * tilt * .5, 1.9 + (i % 3) * .08, st.position.z + Math.sin(a) * tilt * .5); G.add(tuft); }
    const pot = lathe([[0, 0], [.16, 0], [.22, .3], [.25, .42], [.22, .42], [.14, .1], [0, .08]], M(0xf2d6c4, .85)); pot.position.set(2.55, 0, -2.4); G.add(pot);
    const leafM = M(0x6f8a4a, .7, { side: T.DoubleSide });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, leaf = sh(new T.Mesh(new T.SphereGeometry(.5, 14, 10), leafM), true, false); leaf.scale.set(.07, .95, .22); const hg = new T.Group(); hg.position.set(2.55, .45, -2.4); hg.rotation.y = a; leaf.position.set(0, .55, .12); leaf.rotation.x = .75 + (i % 3) * .12; hg.add(leaf); G.add(hg); }
    /* sunrise window on the left with a rising sun */
    const sky = tex(T, 256, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff9d8a'); gr.addColorStop(.6, '#ffc58a'); gr.addColorStop(1, '#ffe7b0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    const winMat = new T.MeshBasicMaterial({ map: sky, fog: false, toneMapped: false });
    const win = new T.Mesh(new T.PlaneGeometry(1.5, 2.6), winMat); win.position.set(-6.0, 1.7, -1.0); win.rotation.y = Math.PI / 2; G.add(win); R.win = win;
    const frameM = M(0xf8eadd, .9);
    for (const [w, h, x, y] of [[1.6, .08, 0, 1.34], [1.6, .08, 0, -1.34], [.08, 2.76, .79, 0], [.08, 2.76, -.79, 0], [.05, 2.6, 0, 0], [1.5, .05, 0, 0]]) { const f = new T.Mesh(new T.BoxGeometry(.06, h, w), frameM); f.position.set(-5.97, 1.7 + y, -1.0 + x); f.rotation.y = 0; G.add(f); }
    const sun = new T.Mesh(new T.CircleGeometry(.34, 40), new T.MeshBasicMaterial({ color: 0xfff1c0, fog: false, toneMapped: false })); sun.position.set(-5.95, .8, -1.0); sun.rotation.y = Math.PI / 2; G.add(sun); R.sun = sun;
    const halo = new T.Mesh(new T.CircleGeometry(.95, 40), new T.MeshBasicMaterial({ map: tex(T, 128, 128, (g, w, h) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,230,170,.85)'); r.addColorStop(1, 'rgba(255,200,140,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false })); halo.position.set(-5.9, .8, -1.0); halo.rotation.y = Math.PI / 2; G.add(halo); R.halo = halo;
    /* light: low warm sun from the window, soft fill, rim */
    G.add(new T.HemisphereLight(0xfff3ea, 0xe9c2ae, .55));
    const key = new T.DirectionalLight(0xffdcb8, 1.5); key.position.set(-5, 2.2, 1.5); key.target.position.set(0, .4, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -1.5, near: .5, far: 14 }); key.shadow.bias = -.0005; key.shadow.radius = 5; G.add(key, key.target); R.key = key;
    const fill = new T.DirectionalLight(0xffd8de, .4); fill.position.set(3, 2, 4); G.add(fill);
    /* light shafts and floating dust */
    const shaftM = new T.MeshBasicMaterial({ color: 0xffe2b0, transparent: true, opacity: .07, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
    for (let i = 0; i < 4; i++) { const s = new T.Mesh(new T.PlaneGeometry(.7, 7), shaftM); s.position.set(-3.0 + i * .4, 2.0, -.9 + i * .5); s.rotation.set(0, 1.2, -.95); G.add(s); }
    const N = 90, pos = new Float32Array(N * 3), base = []; for (let i = 0; i < N; i++) base.push([Math.random() * 7 - 3.5, Math.random() * 3, Math.random() * 5 - 3, Math.random() * 6]);
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(pos, 3));
    const dm = new T.PointsMaterial({ size: .05, map: tex(T, 32, 32, (g, w, h) => { const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(255,240,210,.9)'); r.addColorStop(1, 'rgba(255,230,190,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: 0xffe9c8 }); G.add(new T.Points(dg, dm));
    const c1 = new T.Color(0xff8f78), c2 = new T.Color(0xffe3a8), tmp = new T.Color();
    /* the mat unrolls from the back of the platform towards the viewer (u 0..1) */
    R.setMat = u => { u = Math.max(.001, Math.min(1, u)); mat.scale.z = u; mat.position.z = -(1 - u) * .85; };
    /* water bottle beside the mat; it glows softly during the water and rest breaks */
    const bottleM = M(0x9fd8e8, .25, { transparent: true, opacity: .85, emissive: 0x4fb4d0, emissiveIntensity: 0 });
    const bottle = sh(new T.Mesh(new T.CylinderGeometry(.034, .034, .2, 20), bottleM), true, false); bottle.position.set(.62, .05 + .1, .62); G.add(bottle);
    const cap = sh(new T.Mesh(new T.CylinderGeometry(.02, .024, .035, 16), M(0xe5805f, .6)), false, false); cap.position.set(.62, .05 + .2 + .017, .62); G.add(cap);
    R.bottle = bottle; R.cap = cap;
    const shoes = new T.Group(); for (const x of [-.05, .05]) { const sm = sh(new T.Mesh(new T.CapsuleGeometry(.035, .1, 6, 10), M(0xe5805f, .7)), true, false); sm.rotation.x = Math.PI / 2; sm.position.set(x, .03, 0); shoes.add(sm); } shoes.position.set(-.8, .05, .55); shoes.visible = false; G.add(shoes);
    R.setShoes = u => { shoes.visible = u > .02; shoes.scale.setScalar(Math.max(.01, u)); };
    R.setWater = (on, at) => { bottleM.emissiveIntensity = on ? .55 + .35 * Math.sin(at * 4) : 0; };
    R.update = (p, at) => {
      p = Math.max(0, Math.min(1, p));
      tmp.copy(c1).lerp(c2, p); sun.position.y = .75 + p * 1.1; halo.position.y = sun.position.y; sun.material.color.setHSL(.12 + p * .02, .9, .8 + p * .1);
      key.color.copy(tmp).lerp(new T.Color(0xffffff), .35); key.intensity = 1.2 + p * .6; key.position.y = 1.4 + p * 2.2;
      flame.scale.y = 1.5 + Math.sin(at * 9) * .18; R.candle.intensity = 1.3 + Math.sin(at * 7) * .2 + Math.sin(at * 3.1) * .12;
      const a = dg.attributes.position.array; for (let i = 0; i < N; i++) { const b = base[i], t = at * .15 + b[3]; a[i * 3] = b[0] + Math.sin(t) * .3; a[i * 3 + 1] = (b[1] + at * .03 + Math.sin(t * 1.3) * .1) % 3; a[i * 3 + 2] = b[2] + Math.cos(t * .8) * .3; } dg.attributes.position.needsUpdate = true;
    };
    R.setMat(1);
    return R;
  }
  window.MXYogaRoom = { build };
})();
