/* Surya Namaskar pose engine for the yoga child (see yoga-kid.js), version 2 (human proportions).
   Each pose is a spec in ROOT space (metres; y up, +z = the way she faces, +x = her left):
     pelvis {y,z,pitch}, spine {pitch,twist}, head {pitch},
     fL/fR : ankle target {x,y,z,pitch}      (pitch 0 = flat foot, ~1.0 = toes tucked under)
     hL/hR : wrist target {x,y,z}, finger direction {dx,dy,dz}, palm direction {px,py,pz}, finger curl 0..1
     kneePole / elbowPole : which way the knees / elbows bend.
   Legs and arms are solved with two-bone IK so planted feet and hands stay exactly where the spec puts them.
   Between poses every number is blended, with a small foot lift when a foot has to travel.
   Usage: const POSES = MXYogaPoses.make(K.dim);  MXYogaPoses.solve(THREE, K, spec, facing);
   Stage 3 contains all 12 poses of the traditional sequence. */
(function () {
  function make(d) {
    const H = d.hipH, A = d.ankle, T = d.torso;
    const std = () => ({
      pelvis: { y: H, z: 0, pitch: 0 }, spine: { pitch: 0, twist: 0 }, head: { pitch: 0 },
      fL: { x: .058, y: A, z: 0, pitch: 0 }, fR: { x: -.058, y: A, z: 0, pitch: 0 },
      hL: { x: .16, y: H + T - d.upper - d.fore * .9, z: 0, dx: 0, dy: -1, dz: 0, px: -1, py: 0, pz: 0, curl: .15 },
      hR: { x: -.16, y: H + T - d.upper - d.fore * .9, z: 0, dx: 0, dy: -1, dz: 0, px: 1, py: 0, pz: 0, curl: .15 },
      kneePoleL: [0, 0, 1], kneePoleR: [0, 0, 1], elbowPoleL: [.5, 0, -1], elbowPoleR: [-.5, 0, -1], liftIn: 0
    });
    const mk = (id, key, name, sub, breath, over) => {
      const s = std(); const merge = (a, b) => { for (const k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) merge(a[k], b[k]); else a[k] = b[k]; } }; merge(s, over);
      return { id, key, name, sub, breath, spec: s };
    };
    const P = [
      mk(1, 'pranamasana', 'Pranamasana', 'Prayer pose', 'Breathe out', {
        hL: { x: .0135, y: H + T - .105, z: .118, dx: 0, dy: .95, dz: .3, px: -1, py: 0, pz: 0, curl: 0 },
        hR: { x: -.0135, y: H + T - .105, z: .118, dx: 0, dy: .95, dz: .3, px: 1, py: 0, pz: 0, curl: 0 },
        elbowPoleL: [1, -.6, 0], elbowPoleR: [-1, -.6, 0]
      }),
      mk(2, 'hasta-uttanasana', 'Hasta Uttanasana', 'Raised arms pose', 'Breathe in', {
        pelvis: { y: H, z: .03, pitch: -.05 }, spine: { pitch: -.16 }, head: { pitch: -.3 },
        hL: { x: .145, y: H + .7, z: -.05, dx: 0, dy: 1, dz: -.1, px: -1, py: 0, pz: 0, curl: 0 },
        hR: { x: -.145, y: H + .7, z: -.05, dx: 0, dy: 1, dz: -.1, px: 1, py: 0, pz: 0, curl: 0 },
        elbowPoleL: [.2, 0, -1], elbowPoleR: [-.2, 0, -1]
      }),
      mk(3, 'hastapadasana', 'Hastapadasana', 'Standing forward bend', 'Breathe out', {
        pelvis: { y: H - .02, z: -.08, pitch: 1.25 }, spine: { pitch: .85 }, head: { pitch: .45 },
        hL: { x: .15, y: .035, z: .1, dx: 0, dy: 0, dz: 1, px: 0, py: -1, pz: 0, curl: 0 },
        hR: { x: -.15, y: .035, z: .1, dx: 0, dy: 0, dz: 1, px: 0, py: -1, pz: 0, curl: 0 },
        elbowPoleL: [.6, 0, -1], elbowPoleR: [-.6, 0, -1]
      }),
      mk(4, 'ashwa-sanchalanasana', 'Ashwa Sanchalanasana', 'Equestrian (lunge) pose: right leg back', 'Breathe in', {
        pelvis: { y: .24, z: -.03, pitch: 0 }, spine: { pitch: 1.0 }, head: { pitch: -.85 },
        fL: { x: .085, y: A, z: .36, pitch: 0 }, fR: { x: -.085, y: .177, z: -.46, pitch: 1.0 },
        hL: { x: .2, y: .035, z: .3, dx: 0, dy: 0, dz: 1, px: 0, py: -1, pz: 0, curl: 0 },
        hR: { x: -.2, y: .035, z: .3, dx: 0, dy: 0, dz: 1, px: 0, py: -1, pz: 0, curl: 0 },
        kneePoleL: [0, .5, 1], kneePoleR: [0, -1, 0], elbowPoleL: [.5, 0, -1], elbowPoleR: [-.5, 0, -1]
      })
    ];
    const cl = (p, id, name, sub, breath) => ({ id, key: p.key, name, sub, breath, spec: JSON.parse(JSON.stringify(p.spec)) });
    const hand = (x, z, extra) => Object.assign({ x, y: .035, z, dx: 0, dy: 0, dz: 1, px: 0, py: -1, pz: 0, curl: 0 }, extra || {});
    P.push(
      mk(5, 'parvatasana', 'Parvatasana', 'Mountain pose (downward dog)', 'Breathe out', {
        pelvis: { y: .55, z: -.1, pitch: 1.2 }, spine: { pitch: 1.15 }, head: { pitch: .25 },
        fL: { x: .07, y: .113, z: -.3, pitch: .35 }, fR: { x: -.07, y: .113, z: -.3, pitch: .35 },
        hL: hand(.12, .4), hR: hand(-.12, .4), elbowPoleL: [.3, 0, -1], elbowPoleR: [-.3, 0, -1]
      }),
      mk(6, 'ashtanga-namaskara', 'Ashtanga Namaskara', 'Eight-limbed pose: knees, chest and chin down', 'Breathe out and hold', {
        pelvis: { y: .32, z: -.28, pitch: 1.2 }, spine: { pitch: .7 }, head: { pitch: -1.0 },
        fL: { x: .07, y: .176, z: -.62, pitch: 1.0 }, fR: { x: -.07, y: .176, z: -.62, pitch: 1.0 },
        hL: hand(.13, .08), hR: hand(-.13, .08),
        kneePoleL: [0, -1, .2], kneePoleR: [0, -1, .2], elbowPoleL: [.4, .8, -1], elbowPoleR: [-.4, .8, -1]
      }),
      mk(7, 'bhujangasana', 'Bhujangasana', 'Cobra pose', 'Breathe in', {
        liftIn: .07,
        pelvis: { y: .13, z: -.12, pitch: 1.45 }, spine: { pitch: -1.0 }, head: { pitch: -.2 },
        fL: { x: .06, y: .06, z: -.66, pitch: 3.0 }, fR: { x: -.06, y: .06, z: -.66, pitch: 3.0 },
        hL: hand(.13, .14), hR: hand(-.13, .14),
        kneePoleL: [0, -1, 0], kneePoleR: [0, -1, 0], elbowPoleL: [.5, .5, -1], elbowPoleR: [-.5, .5, -1]
      })
    );
    P.push(cl(P[4], 8, 'Parvatasana', 'Mountain pose (downward dog)', 'Breathe out'));
    const p9 = cl(P[3], 9, 'Ashwa Sanchalanasana', 'Equestrian pose: left leg back', 'Breathe in');
    p9.spec.fR = { x: -.085, y: A, z: .36, pitch: 0 }; p9.spec.fL = { x: .085, y: .177, z: -.46, pitch: 1.0 };
    p9.spec.kneePoleR = [0, .5, 1]; p9.spec.kneePoleL = [0, -1, 0];
    P.push(p9, cl(P[2], 10, 'Hastapadasana', 'Standing forward bend', 'Breathe out'), cl(P[1], 11, 'Hasta Uttanasana', 'Raised arms pose', 'Breathe in'), cl(P[0], 12, 'Pranamasana', 'Prayer pose', 'Breathe out'));
    return P;
  }
  const ease = u => u * u * (3 - 2 * u);
  function lerp(a, b, u) {
    if (typeof a === 'number') return a + (b - a) * u;
    if (Array.isArray(a)) return a.map((v, i) => lerp(v, b[i], u));
    const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], u); return o;
  }
  function blend(A, B, u) {
    const e = ease(Math.max(0, Math.min(1, u))), s = lerp(A, B, e), arc = Math.sin(Math.PI * e);
    s.pelvis.y += arc * (B.liftIn || 0);   /* optional hip lift while moving into a pose */
    for (const f of ['fL', 'fR']) { const d = Math.hypot(B[f].z - A[f].z, B[f].x - A[f].x, (B[f].y - A[f].y) * .5); s[f].y += arc * Math.min(.14, d * .55); }
    return s;
  }
  function solve(T, K, S, facing) {
    const V = T.Vector3, Q = T.Quaternion, down = new V(0, -1, 0), fy = K.floorY, D = K.dim;
    K.root.position.set(0, fy, 0); K.root.rotation.set(0, 0, 0); K.root.scale.set(1, 1, 1);
    K.pelvis.position.set(0, S.pelvis.y, S.pelvis.z); K.pelvis.rotation.set(S.pelvis.pitch, 0, 0);
    K.spine.rotation.set(S.spine.pitch, S.spine.twist || 0, 0); K.head.rotation.set(S.head.pitch, 0, 0);
    K.root.updateMatrixWorld(true);
    const rs = v => new V(v.x, v.y - fy, v.z);
    const ik2 = (H, A, a, b, pole) => {
      const d0 = A.clone().sub(H); let d = d0.length(); const dir = d0.clone().normalize();
      d = Math.max(Math.abs(a - b) + 1e-4, Math.min(a + b - 1e-4, d));
      const cA = (a * a + d * d - b * b) / (2 * a * d), sA = Math.sqrt(Math.max(0, 1 - cA * cA));
      const p = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))); if (p.lengthSq() < 1e-8) p.set(0, 0, 1); p.normalize();
      return { knee: H.clone().add(dir.clone().multiplyScalar(a * cA)).add(p.multiplyScalar(a * sA)), end: H.clone().add(dir.clone().multiplyScalar(d)) };
    };
    const aim = (g, dirW) => { const pq = g.parent.getWorldQuaternion(new Q()); g.quaternion.setFromUnitVectors(down, dirW.clone().normalize().applyQuaternion(pq.invert())); g.updateMatrixWorld(true); };
    const limb = (top, mid, tgt, pole, a, b) => {
      const Hh = rs(top.getWorldPosition(new V())), r = ik2(Hh, new V(tgt.x, tgt.y, tgt.z), a, b, new V(pole[0], pole[1], pole[2]));
      aim(top, r.knee.clone().sub(Hh)); aim(mid, r.end.clone().sub(r.knee)); return r;
    };
    /* roll the hand about its finger axis so the palm faces the wanted direction */
    const roll = (g, palm) => {
      const wq = g.getWorldQuaternion(new Q()), axis = new V(0, -1, 0).applyQuaternion(wq).normalize(), n = new V(0, 0, 1).applyQuaternion(wq);
      const want = new V(palm[0], palm[1], palm[2]).normalize();
      const pn = n.clone().sub(axis.clone().multiplyScalar(n.dot(axis))), pw = want.clone().sub(axis.clone().multiplyScalar(want.dot(axis)));
      if (pn.lengthSq() < 1e-6 || pw.lengthSq() < 1e-6) return; pn.normalize(); pw.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, pn.dot(pw)))), sg = Math.sign(pn.clone().cross(pw).dot(axis)) || 1;
      const nw = new Q().setFromAxisAngle(axis, ang * sg).multiply(wq), pq = g.parent.getWorldQuaternion(new Q());
      g.quaternion.copy(pq.invert().multiply(nw)); g.updateMatrixWorld(true);
    };
    const res = {};
    for (const [side, key] of [[1, 'L'], [-1, 'R']]) {
      const L = side > 0 ? K.legL : K.legR, f = S['f' + key];
      res['ankle' + key] = limb(L.thigh, L.shin, f, S['kneePole' + key], D.thigh, D.shin);
      const sw = L.shin.getWorldQuaternion(new Q()); L.foot.quaternion.copy(sw.invert().multiply(new Q().setFromEuler(new T.Euler(f.pitch, 0, 0)))); L.foot.updateMatrixWorld(true);
      const A = side > 0 ? K.armL : K.armR, h = S['h' + key];
      res['wrist' + key] = limb(A.up, A.fore, h, S['elbowPole' + key], D.upper, D.fore);
      const fq = A.fore.getWorldQuaternion(new Q()); A.hand.quaternion.setFromUnitVectors(down, new V(h.dx, h.dy, h.dz).normalize().applyQuaternion(fq.invert())); A.hand.updateMatrixWorld(true);
      roll(A.hand, [h.px, h.py, h.pz]);
      K.setFingers(side, h.curl, h.curl, 0);
    }
    K.root.rotation.y = facing || 0; K.root.updateMatrixWorld(true); return res;
  }
  function measure(T, K, S) {
    const V = T.Vector3, fy = K.floorY, out = {};
    const minY = o => new T.Box3().setFromObject(o, true).min.y - fy;   /* exact vertices, not an inflated box */
    out.footL = minY(K.legL.foot); out.footR = minY(K.legR.foot); out.handL = minY(K.armL.hand); out.handR = minY(K.armR.hand);
    const wp = o => { const v = o.getWorldPosition(new V()); v.y -= fy; return v; };
    out.ankleErrL = wp(K.legL.foot).distanceTo(new V(S.fL.x, S.fL.y, S.fL.z)); out.ankleErrR = wp(K.legR.foot).distanceTo(new V(S.fR.x, S.fR.y, S.fR.z));
    out.wristErrL = wp(K.armL.hand).distanceTo(new V(S.hL.x, S.hL.y, S.hL.z)); out.wristErrR = wp(K.armR.hand).distanceTo(new V(S.hR.x, S.hR.y, S.hR.z));
    out.kneeL = wp(K.legL.shin); out.kneeR = wp(K.legR.shin);
    out.headTop = new T.Box3().setFromObject(K.head).max.y - fy;
    out.bodyMin = new T.Box3().setFromObject(K.root, true).min.y - fy;
    out.pelvisY = K.pelvis.getWorldPosition(new V()).y - fy;
    out.chestMin = new T.Box3().setFromObject(K.chest, true).min.y - fy;
    return out;
  }
  window.MXYogaPoses = { make, solve, blend, measure, ease };
})();
