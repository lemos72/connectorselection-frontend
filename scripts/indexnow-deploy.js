// Runs at the end of deploy.sh. Finds pages whose content changed since the last deploy
// and sends only those URLs to IndexNow (Bing etc.). Never fails the deploy.
// First run only records a baseline (submits nothing).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOST = 'connectorselection.com';
const KEY = '05a74bceb52fb9da11059ee02a5bdcf1';
const OUT = path.join(__dirname, '..', 'out');
const STATE = process.env.INDEXNOW_STATE || '/home/ssm-user/indexnow-state.json';
const MAX = 500;
const SKIP = /^(_next|404|downloads|categories\/signal-integrity)(\/|$)/;

function walk(dir, rel, acc) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? rel + '/' + f.name : f.name;
    if (f.isDirectory()) { if (!SKIP.test(r)) walk(path.join(dir, f.name), r, acc); }
    else if (f.name === 'index.html') acc.push(rel);
  }
  return acc;
}
function fingerprint(file) {
  let h = fs.readFileSync(file, 'utf8');
  h = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<link[^>]*>/g, '').replace(/\/_next\/[^"'\s)]*/g, '');
  return crypto.createHash('sha1').update(h).digest('hex');
}

(async () => {
  if (!fs.existsSync(OUT)) { console.log('[indexnow] no out/ folder, skipping'); return; }
  const dirs = walk(OUT, '', []);
  const now = {};
  for (const d of dirs) now[d === '' ? '/' : '/' + d + '/'] = fingerprint(path.join(OUT, d, 'index.html'));

  let prev = null;
  try { prev = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) {}
  fs.writeFileSync(STATE, JSON.stringify(now));
  if (!prev) { console.log('[indexnow] first run: baseline saved for ' + Object.keys(now).length + ' pages, nothing submitted'); return; }

  const changed = Object.keys(now).filter(u => prev[u] !== now[u]).slice(0, MAX);
  if (!changed.length) { console.log('[indexnow] no page content changed, nothing to submit'); return; }
  const urls = changed.map(u => 'https://' + HOST + u);
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
  });
  console.log('[indexnow] submitted ' + urls.length + ' changed URL(s): ' + r.status + ' ' + r.statusText);
  urls.slice(0, 15).forEach(u => console.log('   ' + u));
  if (urls.length > 15) console.log('   ...and ' + (urls.length - 15) + ' more');
})().catch(e => console.log('[indexnow] skipped: ' + e.message));
