import { makeReader, write, connectWallet, activeAccount, balanceOf, short, toGen, GEN, fmtErr }
  from "../shared/genlayer-lite.js";

const CONTRACT = "0x2043619F63E7123474206d1114d58099d4221A13";
const { read } = makeReader(CONTRACT);
const W_PENDING = 0, W_SEALED = 1, W_REJECTED = 2;
const STLABEL = ["Pending", "Sealed", "Rejected"];
const ECLS = ["es-pending", "es-sealed", "es-rejected"];
const DCLS = ["pending", "", "rejected"];
let account = null, works = [];
const $ = (id) => document.getElementById(id);
const esc = (s) => (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (_) { return u; } };

$("contractLink").textContent = "Contract " + short(CONTRACT) + " \u2197";

function toast(msg, kind = "", title = "canon") {
  const el = document.createElement("div"); el.className = "toast " + kind;
  el.innerHTML = `<span class="tt">${title}</span>`; el.appendChild(document.createTextNode(msg));
  $("log").appendChild(el); setTimeout(() => el.remove(), kind === "err" ? 15000 : 5000);
}

async function refreshWallet() {
  account = await activeAccount();
  const slot = $("walletslot");
  if (account) { let bal = 0n; try { bal = await balanceOf(account); } catch (_) {} slot.innerHTML = `<span class="mono" style="font-size:13px;color:var(--grey)">${short(account)} \u00b7 ${toGen(bal)} GEN</span>`; }
  else { slot.innerHTML = `<button class="btn ghost sm" id="connectBtn">Connect</button>`; $("connectBtn").onclick = doConnect; }
}
async function doConnect() { try { account = await connectWallet(); toast("Connected on studionet.", "ok"); await refreshWallet(); } catch (e) { toast(fmtErr(e), "err"); } }
async function ensureWallet() { if (!account) account = await connectWallet(); await refreshWallet(); }

async function load() {
  try {
    const count = Number(await read("get_work_count"));
    const out = [];
    for (let i = 0; i < count; i++) out.push({ id: i, ...(await read("get_work", [i])) });
    works = out; renderLedger();
    $("stTotal").textContent = count;
    $("stSealed").textContent = out.filter((w) => Number(w.status) === W_SEALED).length;
    $("stRejected").textContent = out.filter((w) => Number(w.status) === W_REJECTED).length;
  } catch (e) { $("ledger").innerHTML = `<div class="l-empty">Could not reach the chain. ${fmtErr(e)}</div>`; }
}

function renderLedger() {
  const el = $("ledger");
  if (!works.length) { el.innerHTML = `<div class="l-empty">The ledger is empty. Register the first work.</div>`; return; }
  el.innerHTML = "";
  [...works].reverse().forEach((w) => {
    const st = Number(w.status);
    const disc = st === W_SEALED ? `<div class="seal-disc">N${w.canon_no}</div><span class="seal-cap">canon</span>`
      : st === W_REJECTED ? `<div class="seal-disc rejected"><i class="ph-bold ph-x"></i></div><span class="seal-cap">rejected</span>`
      : `<div class="seal-disc pending"><i class="ph-bold ph-hourglass"></i></div><span class="seal-cap">pending</span>`;
    const li = document.createElement("li"); li.className = "entry";
    li.innerHTML = `<div class="entry-seal">${disc}</div>
      <div class="entry-card">
        <div class="entry-title">${esc(w.title)}</div>
        <div class="entry-desc">${esc(w.description)}</div>
        <div class="entry-meta"><span><i class="ph-bold ph-user"></i> ${short(w.author)}</span><span><i class="ph-bold ph-link-simple"></i> ${esc(hostOf(w.work_url))}</span><span class="estatus ${ECLS[st]}">${STLABEL[st]}</span></div>
      </div>`;
    li.onclick = () => openDetail(w.id);
    el.appendChild(li);
  });
}

function openDrawer() { $("scrim").classList.add("on"); $("drawer").classList.add("on"); }
function closeDrawer() { $("scrim").classList.remove("on"); $("drawer").classList.remove("on"); }

function openNew() {
  $("drawerTitle").textContent = "Register a work";
  $("drawerBody").innerHTML = `
    <div class="cert">
      <div class="cert-top">Certificate of Origin</div>
      <div class="cert-row"><span class="cert-l">TITLE</span><input id="nTitle" maxlength="100" placeholder="On the Origin of \u2026" autocomplete="off" /></div>
      <div class="cert-row"><span class="cert-l">SOURCE</span><input id="nUrl" placeholder="https://\u2026" autocomplete="off" /></div>
      <div class="cert-row col"><span class="cert-l">DESCRIPTION</span><textarea id="nDesc" placeholder="What it is, so validators can confirm the source hosts it."></textarea></div>
      <button class="btn primary block" id="createBtn">Seal &amp; register</button>
      <div class="cert-seal">&#10070;</div>
    </div>`;
  $("createBtn").onclick = doCreate; openDrawer();
}

function openDetail(id) {
  const w = works.find((x) => x.id === id); if (!w) return;
  const st = Number(w.status);
  $("drawerTitle").textContent = st === W_SEALED ? ("Canon No. " + w.canon_no) : "Work #" + id;
  let verdict = "";
  if (st === W_SEALED) verdict = `<div class="verdict-box vb-ok"><b>Sealed as Canon No. ${w.canon_no}.</b> ${w.rationale ? esc(w.rationale) : "The source hosts this work as claimed."}</div>`;
  if (st === W_REJECTED) verdict = `<div class="verdict-box vb-no"><b>Rejected.</b> ${w.rationale ? esc(w.rationale) : "The source does not host the described work."}</div>`;
  const action = st === W_PENDING
    ? `<button class="btn primary block" id="sealBtn"><i class="ph-bold ph-seal"></i> Seal into the canon</button><div class="hint" style="text-align:center;margin-top:8px">Validators read the source and confirm. Calls a real LLM.</div>`
    : "";
  $("drawerBody").innerHTML = `
    <div class="d-title">${esc(w.title)}</div>
    ${verdict}
    <div class="kv"><span class="k">What it is</span><span class="v">${esc(w.description)}</span></div>
    <div class="kv"><span class="k">Source</span><span class="v"><a href="${esc(w.work_url)}" target="_blank" rel="noopener">${esc(hostOf(w.work_url))} \u2197</a></span></div>
    <div class="kv"><span class="k">Author</span><span class="v mono">${short(w.author)}</span></div>
    <div class="kv"><span class="k">Status</span><span class="v">${STLABEL[st]}</span></div>
    <div style="margin-top:16px">${action}</div>`;
  openDrawer();
  if (st === W_PENDING) $("sealBtn").onclick = () => doSeal(id);
}

async function doCreate() {
  const title = $("nTitle").value.trim(), url = $("nUrl").value.trim(), desc = $("nDesc").value.trim();
  if (!title) return toast("Give the work a title.", "err");
  if (!url) return toast("Cite the source URL.", "err");
  if (!desc) return toast("Describe what it is.", "err");
  const btn = $("createBtn"); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> registering';
  try { await ensureWallet(); await write(CONTRACT, "register", [title, url, desc]); toast("Registered.", "ok"); closeDrawer(); await load(); }
  catch (e) { toast(fmtErr(e), "err"); btn.disabled = false; btn.innerHTML = "Register"; }
}
async function doSeal(id) {
  if (!confirm("Seal now? Validators read the source and confirm it hosts the work. Calls a real LLM.")) return;
  const btn = $("sealBtn"); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> validators reading';
  try { await ensureWallet(); toast("Validators reading the source\u2026", "", "seal"); await write(CONTRACT, "seal", [id]); toast("Sealed on-chain.", "ok"); closeDrawer(); await load(); }
  catch (e) { toast(fmtErr(e), "err"); if (btn) { btn.disabled = false; btn.textContent = "Seal into the canon"; } }
}

$("navPostBtn").onclick = openNew;
$("refreshBtn").onclick = load;
$("closeDrawer").onclick = closeDrawer;
$("scrim").onclick = closeDrawer;
const _cb = $("connectBtn"); if (_cb) _cb.onclick = doConnect;
if (window.ethereum) window.ethereum.on?.("accountsChanged", refreshWallet);

refreshWallet();
load();

// ====== wax-seal medallion (Three.js) ======
(function seal() {
  const canvas = $("sealCanvas"); if (!canvas || !window.THREE) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  function resize() { const s = Math.min(canvas.clientWidth, canvas.clientHeight) || 200; renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); camera.aspect = canvas.clientWidth / (canvas.clientHeight || 1); camera.updateProjectionMatrix(); }

  const WAX = 0x9c2a2a;
  const grp = new THREE.Group(); scene.add(grp);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.4, 48),
    new THREE.MeshStandardMaterial({ color: WAX, metalness: .3, roughness: .55 }));
  disc.rotation.x = Math.PI / 2; grp.add(disc);
  // embossed ridges
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.12, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0xb83b3b, metalness: .35, roughness: .5 }));
  ring.position.z = 0.21; grp.add(ring);
  const star = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0),
    new THREE.MeshStandardMaterial({ color: 0xc44, metalness: .4, roughness: .45 }));
  star.position.z = 0.35; grp.add(star);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xfff2e0, 1.2); key.position.set(3, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd0a0, 0.5); rim.position.set(-4, -2, 3); scene.add(rim);

  resize(); addEventListener("resize", resize);
  let t = 0, running = true;
  const vis = new IntersectionObserver((es) => { running = es[0].isIntersecting; if (running) loop(); }, { threshold: 0 });
  vis.observe(canvas);
  function loop() {
    if (!running) return;
    requestAnimationFrame(loop); t += 0.01;
    grp.rotation.y = Math.sin(t) * 0.5; grp.rotation.x = Math.cos(t * 0.7) * 0.18; star.rotation.z += 0.01;
    renderer.render(scene, camera);
  }
  loop();
})();
