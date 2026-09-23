/**
 * verify-bridal.mjs — runnable, durable CDP verifier for the Bridal Wedding Blueprint onboarding.
 *
 * Usage:
 *   node scripts/verify-bridal.mjs [baseURL]      (default http://localhost:5174)
 *   npm run verify:bridal                         (alias registered in package.json)
 *
 * Prereqs:
 *   1. App dev server running on baseURL.
 *   2. A Chrome started with:
 *        --remote-debugging-port=9222 \\
 *        --user-data-dir=<temp>\osb-cdp-profile --no-first-run --no-default-browser-check about:blank
 *
 * Coverage:
 *   A Fresh gate, complete the Blueprint ................. auto-open intro / CTA / Hindu+Christian+
 *                                                    regional context / timeline / events / budget /
 *                                                    summary / rails / URL event filter
 *   B Skip flow .................................... skip-for-now closes the dialog, skip banner shows
 *                                                    (PERSONALISE THE BRIDAL COLLECTION — CSS
 *                                                    text-transform:uppercase, so innerText is
 *                                                    ALL-CAPS; compared case-insensitively), and the
 *                                                    banner persists across a reload (not re-forced).
 *   C Resume mid-flow .............................. reload resumes on the events step, not the intro.
 *
 * Reads are case-insensitive by design: Tailwind \uppercase\ on page/eyebrow text means
 * innerText returns the CSS-transformed case, so any exact-case compare would be a flaky false-
 * negative. Click helpers are polling (bounded), so they tolerate a single re-render between the
 * lookup and the click.
 *
 * Exit code is 0 iff every check passes; otherwise 1 (and each failing check is printed).
 */


const PORT = 9222;
const DEFAULT_BASE = 'http://localhost:5174';
const BASE = process.argv[2] || DEFAULT_BASE;
const URL = `${BASE}/collections/bridal`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let idc = 0; const pending = new Map(); let ws; const errors = [];

const send = (method, params = {}) => {
  const id = ++idc;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
};
const evalJs = async (expression, retries = 2) => {
  for (let attempt = 0; ; attempt++) {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (!exceptionDetails) return result.value;
    if (attempt >= retries) throw Object.assign(new Error('EVAL: ' + (exceptionDetails.exception?.description || exceptionDetails.text)), { evalSource: expression.slice(0, 80) });
    await sleep(250);
  }
};
const bodyText = () => evalJs('document.body.innerText.toLowerCase()');
const dialogText = () => evalJs('(document.querySelector("[role=dialog]")?.innerText ?? "").toLowerCase()');
const dialogExists = () => evalJs('Boolean(document.querySelector("[role=dialog]"))');
const bodyHas = (s) => evalJs(`document.body.innerText.toLowerCase().includes(${JSON.stringify(s.toLowerCase())})`);

const waitFor = async (pred, label, tries = 40) => {
  for (let i = 0; i < tries; i++) { try { if (await pred()) return true; } catch {} await sleep(150); }
  return false;
};
const clickDialogButton = async (txt) => {
  for (let i = 0; i < 40; i++) {
    const r = await evalJs(`(() => {
      const d = document.querySelector("[role=dialog]") ?? document;
      const t = ${JSON.stringify(txt.toLowerCase())};
      const el = Array.from(d.querySelectorAll("button")).find((b) => (b.textContent || "").trim().toLowerCase() === t);
      if (!el) return false;
      el.click(); return true;
    })()`);
    if (r) return true;
    await sleep(150);
  }
  return false;
};
const clickLabelIn = async (txt, stepText) => {
  for (let i = 0; i < 40; i++) {
    const r = await evalJs(`(() => {
      const d = document.querySelector("[role=dialog]") ?? document;
      const t = ${JSON.stringify(txt.toLowerCase())};
      const el = Array.from(d.querySelectorAll("label")).find((b) => (b.textContent || "").trim().toLowerCase().includes(t));
      if (!el) return falsegf;
      el.click(); return true;
    })()`);
    if (r) return true;
    await sleep(150);
  }
  return false;
};
const pickFirstCandidate = async () => {
  for (let i = 0; i < 40; i++) {
    const r = await evalJs(`(() => {
      const d = document.querySelector("[role=dialog]");
      if (!d) return false;
      const el = d.querySelector("button.group") ?? Array.from(d.querySelectorAll("button")).find((b) => /^[A-Za-z]{4,}$/.test((b.textContent||"").trim()));
      if (!el) return false;
      el.click(); return true;
    })()`);
    if (r) return true;
    await sleep(150);
  }
  return false;
};

const check = (name, cond) => {
  console.log((cond ? 'PASS' : 'FAIL') + ' | ' + name);
  if (!cond) process.exitCode = 1;
};
const resetAndGo = async () => {
  await send('Page.navigate', { url: `${BASE}/` });
  await sleep(1500);
  await evalJs('localStorage.clear(); sessionStorage.clear(); "ok"');
  await send('Page.reload', { ignoreCache: true });
  await sleep(5000);
  await send('Page.navigate', { url: URL });
  await sleep(4500);
};

(async () => {
  const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' })).json();
  ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push((msg.params.args || []).map((a) => a.value ?? '').join(' ').slice(0, 120));
  };
  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable'); await send('Runtime.enable');

  console.log('== A. Fresh gate -> complete the Blueprint ==');
  await resetAndGo();
  check('A1 dialog auto-opens with intro', await waitFor(async () => (await dialogText()).includes('tell us about your wedding'), 'intro'));
  check('A2 CTA present', (await dialogText()).includes('build my wedding blueprint'));
  check('A3 begin', await clickDialogButton('build my wedding blueprint'));
  await waitFor(async () => (await dialogText()).includes('which traditions are part of your wedding'), 'step1');

  check('A3.1 pick Hindu', await clickDialogButton('hindu'));
  check('A3.1b regional context appears', await waitFor(async () => (await dialogText()).includes('which regional or cultural traditions'), 'regional'));
  check('A3.2 pick Christian', await clickDialogButton('christian'));
  const ctx = await evalJs(`(() => {
    const d = document.querySelector("[role=dialog]");
    const el = Array.from(d.querySelectorAll("button")).find((b) => ["bengali","punjabi","tamil","gujarati"].includes((b.textContent||"").trim().toLowerCase()));
    if (!el) return null;
    el.click(); return el.textContent.trim();
  })()`);
  check('A3.3 regional context picked' + (ctx ? ` (${ctx})` : ''), !!ctx);
  check('A3.4 Continue to timeline', await clickDialogButton('continue'));
  await waitFor(async () => (await dialogText()).includes('when is your big day'), 'step2');

  check('A4 timeline label', await clickLabelIn('3 months', ''));
  check('A4.1 Continue', await clickDialogButton('continue'));
  await waitFor(async () => (await dialogText()).includes('which celebrations are you styling'), 'step3');

  check('A5 events candidates', await waitFor(async () => (await dialogText()).includes('bridal shower'), 'candidates'));
  check('A5.1 pick first event', await pickFirstCandidate());
  check('A5.2 Continue', await clickDialogButton('continue'));
  await waitFor(async () => (await dialogText()).includes("what's your total budget"), 'step4');

  check('A6 budget Classic', await clickLabelIn('classic celebration', ''));
  check('A6.1 Continue', await clickDialogButton('continue'));
  check('A6.2 summary', await waitFor(async () => (await dialogText()).includes('your wedding blueprint is ready'), 'summary'));
  check('A6.3 finish', await clickDialogButton('show me the bridal collection'));
  await waitFor(async () => (await bodyText()).includes('your wedding blueprint'), 'rails');
  check('A7 URL event filter', (await evalJs('location.search')).includes('event='));
  check('A8 Edit Blueprint control', (await bodyText()).includes('edit wedding blueprint'));

  /* ---------- B. Skip flow ---------- */
  console.log('== B. Skip flow ==');
  await resetAndGo();
  await waitFor(async () => (await dialogText()).includes('tell us about your wedding'), 'intro B');
  check('B1 skip link', await clickDialogButton('skip for now'));
  await sleep(1200);
  check('B2 dialog closed after skip', !(await dialogExists()));
  check('B3 skip banner shown (case-insensitive)', await bodyHas('personalise the bridal collection'));
  await send('Page.reload', { ignoreCache: true });
  await sleep(4000);
  check('B4 banner persists on reload, not re-forced', !(await dialogExists()) && (await bodyHas('personalise the bridal collection')));

  /* ---------- C. Resume mid-flow ---------- */
  console.log('== C. Resume mid-flow ==');
  await resetAndGo();
  await waitFor(async () => (await dialogText()).includes('tell us about your wedding'), 'intro C');
  check('C1 begin', await clickDialogButton('build my wedding blueprint'));
  await waitFor(async () => (await dialogText()).includes('which traditions are part of your wedding'), 'C step1');
  check('C2 Hindu', await clickDialogButton('hindu'));
  check('C3 Continue', await clickDialogButton('continue'));
  await waitFor(async () => (await dialogText()).includes('when is your big day'), 'C step2');
  check('C4 timeline', await clickLabelIn('not decided yet', ''));
  check('C5 Continue', await clickDialogButton('continue'));
  await waitFor(async () => (await dialogText()).includes('which celebrations are you styling'), 'C step3');

  await send('Page.reload', { ignoreCache: true });
  await sleep(5000);
  const resumed = await dialogText();
  check('C6 resumes directly on events step', resumed.includes('which celebrations are you styling'));

  console.log(`== Runtime issues: ${errors.length} ${errors.length ? JSON.stringify(errors) : ''} ==`);
  if (errors.length) process.exitCode = 1;
  ws.close();
  process.exit(process.exitCode || 0);
})().catch((e) => { console.error('DRIVER_ERROR: ' + e.message); process.exit(1); });