/* Surya Namaskar pose engine for the yoga child (see yoga-kid.js).
   Each pose is a small spec in ROOT space (metres; y up, +z = the way she faces, +x = her left):
     pelvis {y,z,pitch}, spine {pitch,twist}, head {pitch},
     fL/fR  : ankle target {x,y,z,pitch}   (pitch 0 = flat foot, ~1.0 = toes tucked under)
     hL/hR  : wrist target {x,y,z} and the direction the fingers point
     kneePole / elbowPole: which way the knees / elbows bend.
   The legs and arms are solved with two-bone IK so planted feet and hands stay exactly where the spec puts
   them. Between poses every number is blended, with a small foot lift when a foot has to travel.
   Stage 2 contains poses 1 to 4. */
(function () {
  const FLOOR_PITCH = 0;
  const std = () => ({
    pelvis: { y: .508, z: 0, pitch: 0 }, spine: { pitch: 0, twist: 0 }, head: { pitch: 0 },
    fL: { x: .052, y: .068, z: 0, pitch: 0 }, fR: { x: -.052, y: .068, z: 0, pitch: 0 },
    hL: { x: .17, y: .3, z: 0, dx: 0, dy: -1, dz: 0 }, hR: { x: -.17, y: .3, z: 0, dx: 0, dy: -1, dz: 0 },
    kneePoleL: [0, 0, 1], kneePoleR: [0, 0, 1], elbowPoleL: [.5, 0, -1], elbowPoleR: [-.5, 0, -1]
  });
  const mk = (id, key, name, sub, breath, over) => { const s = std(); const merge = (a, b) => { for (const k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) merge(a[k], b[k]); else a[k] = b[k]; } }; merge(s, over); return { id, key, name, sub, breath, spec: s }; };

  const POSES = [
    mk(1, 'pranamasana', 'Pranamasana', 'Prayer pose', 'Breathe out', {
      hL: { x: .022, y: .665, z: .115, dx: 0, dy: .9, dz: .45 }, hR: { x: -.022, y: .665, z: .115, dx: 0, dy: .9, dz: .45 },
      elbowPoleL: [1, -.6, 0], elbowPoleR: [-1, -.6, 0]
    }),
    mk(2, 'hasta-uttanasana', 'Hasta Uttanasana', 'Raised arms pose', 'Breathe in', {
      pelvis: { y: .508, z: .03, pitch: -.08 }, spine: { pitch: -.22 }, head: { pitch: -.18 },
      hL: { x: .03, y: 1.16, z: -.09, dx: 0, dy: 1, dz: -.2 }, hR: { x: -.03, y: 1.16, z: -.09, dx: 0, dy: 1, dz: -.2 },
      elbowPoleL: [.3, 0, -1], elbowPoleR: [-.3, 0, -1]
    }),
    mk(3, 'hastapadasana', 'Hastapadasana', 'Standing forward bend', 'Breathe out', {
      pelvis: { y: .49, z: -.06, pitch: 1.25 }, spine: { pitch: .85 }, head: { pitch: .45 },
      hL: { x: .14, y: .038, z: .07, dx: 0, dy: 0, dz: 1 }, hR: { x: -.14, y: .038, z: .07, dx: 0, dy: 0, dz: 1 },
      kneePoleL: [0, 0, 1], kneePoleR: [0, 0, 1], elbowPoleL: [.6, 0, -1], elbowPoleR: [-.6, 0, -1]
    }),
    mk(4, 'ashwa-sanchalanasana', 'Ashwa Sanchalanasana', 'Equestrian (lunge) pose: right leg back', 'Breathe in', {
      pelvis: { y: .235, z: -.02, pitch: 0 }, spine: { pitch: .7 }, head: { pitch: -.45 },
      fL: { x: .075, y: .068, z: .3, pitch: 0 },
      fR: { x: -.075, y: .14, z: -.36, pitch: 1.0 },
      hL: { x: .17, y: .04, z: .22, dx: 0, dy: 0, dz: 1 }, hR: { x: -.17, y: .04, z: .22, dx: 0, dy: 0, dz: 1 },
      kneePoleL: [0, .5, 1], kneePoleR: [0, -1, .2], elbowPoleL: [.5, 0, -1], elbowPoleR: [-.5, 0, -1]
    })
  ];

  const ease = u => u * u * (3 - 2 * u);
  function lerp(a, b, u) {
    if (typeof a === 'number') return a + (b - a) * u;
    if (Array.isArray(a)) return a.map((v, i) => lerp(v, b[i], u));
    const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], u); return o;
  }
  /* blend two poses; a travelling foot or hand is lifted a little so it does not drag along the mat */
  function blend(A, B, u) {
    const e = ease(Math.max(0, Math.min(1, u))), s = lerp(A, B, e), arc = Math.sin(Math.PI * e);
    for (const f of ['fL', 'fR']) { const d = Math.hypot(B[f].z - A[f].z, B[f].x - A[f].x, (B[f].y - A[f].y) * .5); s[f].y += arc * Math.min(.13, d * .55); }
    return s;
  }

  function solve(T, K, S, facing) {
    const V = T.Vector3, Q = T.Quaternion, down = new V(0, -1, 0), fy = K.floorY;
    K.root.position.set(0, fy, 0); K.root.rotation.set(0, 0, 0); K.root.scale.set(1, 1, 1);
    K.pelvis.position.set(0, S.pelvis.y, S.pelvis.z); K.pelvis.rotation.set(S.pelvis.pitch, 0, 0);
    K.spine.rotation.set(S.spine.pitch, S.spine.twist || 0, 0); K.head.rotation.set(S.head.pitch, 0, 0);
    K.root.updateMatrixWorld(true);
    const rs = v => new V(v.x, v.y - fy, v.z);               /* world -> root space (root is at x = z = 0) */
    const ik2 = (H, A, a, b, pole) => {
      const d0 = A.clone().sub(H); let d = d0.length(); const dir = d0.clone().normalize();
      d = Math.max(Math.abs(a - b) + 1e-4, Math.min(a + b - 1e-4, d));
      const cA = (a * a + d * d - b * b) / (2 * a * d), sA = Math.sqrt(Math.max(0, 1 - cA * cA));
      const p = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))); if (p.lengthSq() < 1e-8) p.set(0, 0, 1); p.normalize();
      const knee = H.clone().add(dir.clone().multiplyScalar(a * cA)).add(p.multiplyScalar(a * sA));
      return { knee, end: H.clone().add(dir.clone().multiplyScalar(d)) };
    };
    const aim = (g, dirW) => { const pq = g.parent.getWorldQuaternion(new Q()); g.quaternion.setFromUnitVectors(down, dirW.clone().normalize().applyQuaternion(pq.invert())); g.updateMatrixWorld(true); };
    const limb = (top, mid, end, tgt, pole, a, b) => {
      const H = rs(top.getWorldPosition(new V())), r = ik2(H, new V(tgt.x, tgt.y, tgt.z), a, b, new V(pole[0], pole[1], pole[2]));
      aim(top, r.knee.clone().sub(H)); aim(mid, r.end.clone().sub(r.knee)); return r;
    };
    const res = {};
    for (const [side, key] of [[1, 'L'], [-1, 'R']]) {
      const L = side > 0 ? K.legL : K.legR, f = S['f' + key];
      const r = limb(L.thigh, L.shin, L.foot, f, S['kneePole' + key], .22, .22); res['ankle' + key] = r;
      const sw = L.shin.getWorldQuaternion(new Q()); L.foot.quaternion.copy(sw.invert().multiply(new Q().setFromEuler(new T.Euler(f.pitch, 0, 0)))); L.foot.updateMatrixWorld(true);
      const A = side > 0 ? K.armL : K.armR, h = S['h' + key];
      const ra = limb(A.up, A.fore, A.hand, h, S['elbowPole' + key], .22, .22); res['wrist' + key] = ra;
      const fq = A.fore.getWorldQuaternion(new Q()); A.hand.quaternion.setFromUnitVectors(down, new V(h.dx, h.dy, h.dz).normalize().applyQuaternion(fq.invert())); A.hand.updateMatrixWorld(true);
    }
    K.root.rotation.y = facing || 0; K.root.updateMatrixWorld(true); return res;
  }

  /* measurements for validation (call after solve with facing 0) */
  function measure(T, K, S) {
    const V = T.Vector3, fy = K.floorY, out = {};
    const minY = o => new T.Box3().setFromObject(o).min.y - fy;
    out.footL = minY(K.legL.foot); out.footR = minY(K.legR.foot); out.handL = minY(K.armL.hand); out.handR = minY(K.armR.hand);
    const wp = o => o.getWorldPosition(new V()).setY(o.getWorldPosition(new V()).y - fy);
    out.ankleErrL = wp(K.legL.foot).distanceTo(new V(S.fL.x, S.fL.y, S.fL.z)); out.ankleErrR = wp(K.legR.foot).distanceTo(new V(S.fR.x, S.fR.y, S.fR.z));
    out.wristErrL = wp(K.armL.hand).distanceTo(new V(S.hL.x, S.hL.y, S.hL.z)); out.wristErrR = wp(K.armR.hand).distanceTo(new V(S.hR.x, S.hR.y, S.hR.z));
    out.kneeL = wp(K.legL.shin); out.kneeR = wp(K.legR.shin);
    out.headTop = new T.Box3().setFromObject(K.head).max.y - fy;
    return out;
  }
  window.MXYogaPoses = { POSES, solve, blend, measure, ease };
})();
