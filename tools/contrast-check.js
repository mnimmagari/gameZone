// Fails if any Explore quiz theme has hard-to-read text (contrast < MIN).
// Static check of the --x* theme variables in index.html:  node tools/contrast-check.js
const fs = require('fs');
const path = require('path');
const MIN = 4.5;
// theme rules are short single lines; skip the huge embedded data lines (they make the regex crawl)
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8')
  .split('\n').filter(l => l.length < 3000).join('\n');

const hex = h => {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6);
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
};
const lum = a => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(a[0]) + 0.7152 * f(a[1]) + 0.0722 * f(a[2]);
};
const cr = (a, b) => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const mix = (a, b, pct) => a.map((v, i) => v * pct + b[i] * (1 - pct));
const hexes = s => (s.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map(hex);

// collect variables per theme from every `.quiz-panel[id="quizPanel"].xt-NAME{...}` rule
const themes = {};
const ruleRe = /([^{}\n]*\.quiz-panel\[id="quizPanel"\][^{}\n]*)\{([^}]*)\}/g;
let m;
while ((m = ruleRe.exec(html))) {
  // a rule may group several selectors; only plain `.xt-NAME` selectors (no descendants) define a theme
  const names = m[1].split(',').map(s => s.trim().match(/\.quiz-panel\[id="quizPanel"\]\.xt-([a-z]+)$/)).filter(Boolean).map(x => x[1]);
  for (const n of names) {
    const t = (themes[n] = themes[n] || {});
    for (const d of m[2].split(/;(?![^(]*\))/)) {
      const i = d.indexOf(':');
      if (i > 0 && d.startsWith('--')) t[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
  }
}

let bad = 0;
const check = (theme, what, ratio) => {
  const ok = ratio >= MIN;
  if (!ok) bad++;
  console.log((ok ? ' ok   ' : ' FAIL ') + theme.padEnd(10) + what.padEnd(14) + ratio.toFixed(1));
};

for (const [name, v] of Object.entries(themes)) {
  if (!v['--xbg']) continue; // not a full theme definition
  const qink = hexes(v['--xqink'] || '#2b1f4d')[0];
  const qbgRaw = v['--xqbg'] || '#fff';
  const qbgs = qbgRaw === 'transparent' ? hexes(v['--xbg']) : hexes(qbgRaw);
  check(name, 'question', Math.min(...(qbgs.length ? qbgs : [[255, 255, 255]]).map(b => cr(qink, b))));

  const base = hexes(v['--xbase'] || '#fff')[0];
  const pct = parseFloat(v['--xmix'] || '26') / 100;
  const ink = hexes(v['--xink'] || '#2b1f4d')[0];
  let worst = 99;
  for (const k of ['--x1', '--x2', '--x3', '--x4']) {
    const c = hexes(v[k] || '')[0];
    if (c) worst = Math.min(worst, cr(ink, mix(c, base, pct)));
  }
  check(name, 'answers', worst);

  const num = hexes(v['--xnum'] || v['--xq'] || '#8a7ddd')[0];
  check(name, 'number pill', cr(hexes(v['--xnumink'] || '#fff')[0], num));
}
console.log(bad ? '\n' + bad + ' contrast problem(s) (min ' + MIN + ':1)' : '\nAll themes pass (min ' + MIN + ':1)');
process.exit(bad ? 1 : 0);
