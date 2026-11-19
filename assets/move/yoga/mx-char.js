/* Move & Explore adventure characters (human proportions, themed outfits).
   The same rigged child as the yoga level (yoga-kid.js) dressed for each adventure, driven by the exercise numbers of the
   2D engine (arm angles, leg lifts, squat, lean ...). Every move goes through the two-bone IK solver and the joint limits of
   yoga-poses.js, so arms, legs, wrists and ankles can only bend the way a human's do.
   MXChar.create(T, theme) -> { K }      MXChar.pose(T, K, P, at, facing)     (P = the engine's pose numbers)
   MXChar.draw(ctx2d, theme, P, at, x, groundY, scale)   draws the character over the 2D scene (virtual 960x540 units)
   MXChar.silhouette(ctx2d, theme, P, at)                draws a dark silhouette (220x300) for the "your pose" panel */
(function () {
  const OUT = {
    forest: { kind: 'girl', top: '#4f9a62', bottom: '#8a6a44', sock: 0x6b4a2e, shoe: 0x6b4a2e, shoes: true, hair: 0x8a5a3a, skin: 0xf0b99c, hat: 0x2f8f6a, trim: 0xf2d36b, acc: ['ranger', 'pack'], pack: 0xc47a2c },
    desert: { kind: 'boy', top: '#e8c48a', bottom: '#a77b4d', sock: 0xd9c9a8, shoe: 0x7a5230, shoes: true, hair: 0x3a2618, skin: 0xd9a27c, hat: 0xd9b57a, trim: 0x8a5a33, acc: ['safari', 'scarf', 'pack'], scarf: 0xd64550, pack: 0x8a5a33 },
    ocean: { kind: 'girl', top: '#2fb3c8', bottom: '#2f7fb8', sock: 0xffcf5a, shoe: 0xffcf5a, shoes: true, hair: 0x2a1a14, skin: 0xc98a63, trim: 0xffd23f, acc: ['goggles'] },
    snow: { kind: 'boy', top: '#4d7cff', bottom: '#e8eefc', sock: 0xffffff, shoe: 0xb83a3a, shoes: true, hair: 0x5a3a28, skin: 0xf2c4a8, hat: 0xd64550, trim: 0xffffff, scarf: 0xffb62e, acc: ['beanie', 'scarf', 'mitten'], bulk: 1.12 },
    space: { kind: 'girl', top: '#f1f4ff', bottom: '#f1f4ff', sock: 0xaeb6cc, shoe: 0x8a93a8, shoes: true, hair: 0x8a4a2a, skin: 0xe3a98a, hat: 0xf1f4ff, trim: 0xf1f4ff, acc: ['helmet', 'pack', 'patch', 'glove'], pack: 0xb8c0d6 }
  };
  const M = { OUT, chars: {}, ok: false };
  const R = Math.PI / 180, clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function neutral(p, D) {
    const s = JSON.parse(JSON.stringify(p)), y = D.hipH + D.torso - .42;
    s.hL = { x: D.shoulderW + .02, y, z: .03, dx: 0, dy: -1, dz: 0, px: -1, py: 0, pz: 0, curl: .2 }; s.hR = Object.assign({}, s.hL, { x: -(D.shoulderW + .02), px: 1 });
    s.elbowPoleL = [.4, 0, -1]; s.elbowPoleR = [-.4, 0, -1]; return s;
  }
  M.create = function (T, theme) {
    const K = MXYoga.build(T, Object.assign({ eyes: 'open' }, OUT[theme] || OUT.forest)); K.floorY = 0;
    K.base = neutral(MXYogaPoses.make(K.dim)[0].spec, K.dim); return { K, theme };
  };
  /* How each exercise moves the arms like a person does. The 2D engine only has one arm angle per side, so the move decides the plane:
     'swing' moves (walk, march, knee lifts ...) swing the arms forward and back beside the body with the elbows bent,
     arm circles draw circles with the arms out to the side, swimming is the front-crawl windmill, and everything else lifts the arms
     out to the side and up (frontal). c = angle (degrees) that counts as "arms hanging", k = how much swing, fl = elbow bend (radians). */
  const SWING = {
    march: { c: 40, k: .8, fl: .9 }, walkSlow: { c: 20, k: 1, fl: .45 }, camel: { c: 25, k: 1, fl: .3 }, stepOver: { c: 35, k: 0, fl: .5 },
    kneeLift: { c: 32, k: 1.2, fl: 1.5 }, penguin: { c: 25, k: .8, fl: .15 }, ski: { c: 0, k: .8, fl: .9 }, bounce: { c: 20, k: .8, fl: .35 },
    float: { c: 0, k: .9, fl: .2 }, squat: { c: 0, k: .9, fl: .1 }
  };
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  function armDirs(sd, th, bd, mv, tl) {
    const sw = SWING[mv];
    if (sw) {
      const phi = clamp((th / R - sw.c) * sw.k, -50, 110) * R, abd = 12 * R, ph2 = phi + sw.fl;
      return [[sd * Math.sin(abd), -Math.cos(phi) * Math.cos(abd), Math.sin(phi) * Math.cos(abd)], [sd * Math.sin(abd), -Math.cos(ph2) * Math.cos(abd), Math.sin(ph2) * Math.cos(abd)]];
    }
    if (mv === 'armCircle') { const b = 2 * Math.PI * .55 * tl, d = nrm([sd, .55 * Math.sin(b), .55 * Math.cos(b)]); return [d, d]; }
    if (mv === 'swim') {
      const b = 2 * Math.PI * .55 * tl + (sd < 0 ? 0 : Math.PI), e = .25 + .7 * Math.max(0, -Math.sin(b));
      return [nrm([sd * .15, -Math.cos(b), Math.sin(b)]), nrm([sd * .15, -Math.cos(b + e), Math.sin(b + e)])];
    }
    const ph = th + clamp(bd, -3.4, 3.2) * .8;
    return [[sd * Math.sin(th), -Math.cos(th), .04], [sd * Math.sin(ph), -Math.cos(ph), .04]];
  }
  /* the engine's pose numbers (arm angles in degrees from hanging down, leg lifts 0..1, squat, fold, lean ...) -> a pose for the rig */
  function spec(K, P, ctx) {
    const mv = ctx && ctx.mv, tl = (ctx && ctx.tl) || 0, D = K.dim, H = D.hipH, A = D.ankle, s = JSON.parse(JSON.stringify(K.base)), sq = P.squat || 0, fo = P.fold || 0, bob = Math.max(0, P.bob || 0);
    const heel = (mv === 'tiptoe' || mv === 'reach' || mv === 'breathe') ? bob : 0;
    s.pelvis = { x: clamp((P.shift || 0) * .0016, -.09, .09), y: H * (1 - .47 * sq) - fo * .02 + bob * .0035, z: -sq * .1 - fo * .08, pitch: sq * .5 + fo * 1.0, roll: 0 };
    s.spine = { pitch: sq * .15 + fo * .6, twist: (P.twist || 0) * .55, roll: -(P.lean || 0) * R * .8 };
    s.head = { pitch: fo * .45 - sq * .15 };
    for (const sd of [-1, 1]) {       /* sd -1 = the left of the picture (the engine's "L" numbers) = the rig's -x side ("R" keys) */
      const key = sd > 0 ? 'L' : 'R', lift = clamp(sd < 0 ? P.lL : P.lR, 0, 1.2), lh = P.lh || 34;
      const stepW = (mv === 'stepSide' || mv === 'crab') ? Math.sign(P.shift || 0) * lift * .1 : 0;
      s['f' + key] = { x: sd * (.058 + Math.max(0, (P.sp || 20) - 20) * .0045 + sq * .06) + stepW, y: A + lift * lh * .0055 + heel * .0035, z: lift * lh * .0042, pitch: lift * .35 + Math.min(.7, heel * .05) };
      s['kneePole' + key] = [sd * .1, 0, 1];
      const th = (sd < 0 ? P.aL : P.aR) * R, bd = sd < 0 ? P.bL : P.bR, dirs = armDirs(sd, th, bd, mv, tl), U = D.upper, F = D.fore * .95;
      const e = [dirs[0][0] * U, dirs[0][1] * U, dirs[0][2] * U], w = [e[0] + dirs[1][0] * F, e[1] + dirs[1][1] * F, e[2] + dirs[1][2] * F];
      let pl = [e[0] - w[0] / 2, e[1] - w[1] / 2, e[2] - w[2] / 2]; const pn = Math.hypot(pl[0], pl[1], pl[2]);
      pl = pn > .015 ? [pl[0] / pn, pl[1] / pn, pl[2] / pn] : [sd * .3, 0, -1];
      s['elbowPole' + key] = pl;
      s['h' + key] = { x: w[0], y: w[1] + (sd < 0 ? P.shL : P.shR || 0) * .004, z: w[2], rel: fo > .25 ? 'w' : 't', dx: dirs[1][0], dy: dirs[1][1], dz: dirs[1][2], px: -sd * .6, py: 0, pz: .6, curl: .15 };
    }
    return s;
  }
  M.pose = function (T, K, P, at, facing, ctx) {
    const mv = ctx && ctx.mv, tgt = SWING[mv] ? .85 : (mv === 'armCircle' || mv === 'swim') ? .6 : (facing || .45);
    K.ryS = K.ryS == null ? tgt : K.ryS + (tgt - K.ryS) * .12;
    MXYogaPoses.solve(T, K, spec(K, P, ctx), K.ryS); K.idle(at);
    K.head.rotation.z = -(P.tilt || 0) * R * .8;
    if (K.talk) K.talk(clamp(.4 + (P.mouth || .7) * .6, .4, 1));
  };

  /* ---------- overlay on the 2D scene ---------- */
  function ensure() {
    if (M.gl) return true;
    const X = window.MXTHREE; if (!X || !window.MXYoga || !window.MXYogaPoses) return false;
    const T = X.THREE; M.T = T;
    const cv = document.createElement('canvas'), r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, premultipliedAlpha: true });
    if (!r.getContext()) return false;
    r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0; r.setPixelRatio(1); r.setClearColor(0x000000, 0);
    const sc = new T.Scene(); sc.add(new T.HemisphereLight(0xfff4e6, 0xb9c4d8, 1.25));
    const key = new T.DirectionalLight(0xffffff, 2.1); key.position.set(-2, 3, 4); sc.add(key);
    const fill = new T.DirectionalLight(0xdfe8ff, .7); fill.position.set(3, 1, 3); sc.add(fill);
    M.gl = r; M.cv = cv; M.scene = sc; M.cam = new T.OrthographicCamera(-1, 1, 1, -1, .1, 40); M.cam.position.z = 10; M.sz = [0, 0];
    M.dark = new T.MeshBasicMaterial({ color: 0x140a33 }); return true;
  }
  function charFor(theme) {
    if (!ensure()) return null;
    let ch = M.chars[theme]; if (!ch) { ch = M.chars[theme] = M.create(M.T, theme); }
    if (M.active !== ch) { if (M.active) M.scene.remove(M.active.K.root); M.scene.add(ch.K.root); M.active = ch; }
    return ch;
  }
  M.ready = () => !!(window.MXTHREE && window.MXYoga && window.MXYogaPoses);
  M.draw = function (c, theme, P, at, x, gy, S, ctx) {
    const ch = charFor(theme); if (!ch) return false;
    const cv2 = c.canvas, k = cv2.width / 960, W = Math.max(2, Math.round(960 * k)), H = Math.max(2, Math.round(540 * k)), Sc = 165 * ((S || .95) / .95);
    if (M.sz[0] !== W || M.sz[1] !== H) { M.gl.setSize(W, H, false); M.sz = [W, H]; }
    const cam = M.cam, hw = 480 / Sc, hh = 270 / Sc, cy = (gy - 270) / Sc;
    cam.left = -hw; cam.right = hw; cam.top = hh; cam.bottom = -hh; cam.updateProjectionMatrix(); cam.position.set(0, cy, 10); cam.lookAt(0, cy, 0);
    M.scene.overrideMaterial = null; ch.K.bubble && (ch.K.bubble.visible = true);
    M.gl.setScissorTest(false); M.gl.setViewport(0, 0, W, H);
    M.pose(M.T, ch.K, P, at, .45, ctx); ch.K.root.position.x = (x - 480) / Sc; ch.K.root.updateMatrixWorld(true);
    M.gl.clear(); M.gl.render(M.scene, cam);
    c.drawImage(M.cv, 0, 0, 960, 540); return true;
  };
  M.silhouette = function (oc, theme, P, at, ctx) {
    const ch = charFor(theme); if (!ch) return false; if (M.sz[0] < 220 || M.sz[1] < 300) { M.gl.setSize(960, 540, false); M.sz = [960, 540]; }
    const Ss = 150, cam = M.cam, cy = (280 - 150) / Ss;
    cam.left = -110 / Ss; cam.right = 110 / Ss; cam.top = 150 / Ss; cam.bottom = -150 / Ss; cam.updateProjectionMatrix(); cam.position.set(0, cy, 10); cam.lookAt(0, cy, 0);
    M.pose(M.T, ch.K, P, at, .45, ctx); ch.K.root.position.x = 0; ch.K.root.updateMatrixWorld(true); if (ch.K.bubble) ch.K.bubble.visible = false;
    const r = M.gl; r.setScissorTest(true); r.setViewport(0, 0, 220, 300); r.setScissor(0, 0, 220, 300); r.clear(); M.scene.overrideMaterial = M.dark; r.render(M.scene, cam);
    M.scene.overrideMaterial = null; r.setScissorTest(false); r.setViewport(0, 0, M.sz[0], M.sz[1]); if (ch.K.bubble) ch.K.bubble.visible = true;
    oc.drawImage(M.cv, 0, M.sz[1] - 300, 220, 300, 0, 0, 220, 300); return true;
  };
  window.MXChar = M;
})();
