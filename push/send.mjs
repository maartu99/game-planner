// Game Planner - notifiche push.
// Gira su GitHub Actions ogni pochi minuti: guarda cosa è cambiato su Firestore
// e manda le notifiche ai telefoni con Firebase Cloud Messaging.
// Ogni notifica parte una volta sola: quelle già mandate sono segnate in "pushLog".
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const SA = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!SA) { console.log("::warning::FIREBASE_SERVICE_ACCOUNT non impostato: nessuna notifica."); process.exit(0); }
initializeApp({ credential: cert(JSON.parse(SA)) });
const db = getFirestore(), fcm = getMessaging();

const APP = "https://maartu99.github.io/game-planner/";
const TZ = "Europe/Rome";
const NOW = Date.now();
const FRESH = 24 * 3600e3;           // si notificano solo novità delle ultime 24 ore (GitHub può ritardare i giri)
const REMIND_FROM_HOUR = 10;          // promemoria del giorno prima, dalle 10
const ymdIn = d => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
const TODAY = ymdIn(new Date(NOW)), TOMORROW = ymdIn(new Date(NOW + 864e5));
const HOUR = +new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false }).format(new Date(NOW));

const T = {
  it: { dows: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"], months: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"], at: "alle" },
  en: { dows: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], at: "at" },
};
const when = (lang, date, time) => { const t = T[lang] || T.it, [y, m, d] = date.split("-").map(Number), dt = new Date(y, m - 1, d); return `${t.dows[dt.getDay()]} ${d} ${t.months[m - 1]}${time ? ` ${t.at} ${time}` : ""}`; };
const ms = v => typeof v === "number" ? v : v?.toMillis ? v.toMillis() : 0;

// ---- destinatari
const users = {};
async function user(uid) {
  if (!(uid in users)) { const s = await db.collection("users").doc(uid).get(); users[uid] = s.exists ? s.data() : {}; }
  return users[uid];
}
let sent = 0;
async function notify(key, uids, build) {
  const logRef = db.collection("pushLog").doc(key);
  if ((await logRef.get()).exists) return;
  await logRef.set({ at: NOW });
  for (const uid of new Set(uids)) {
    const u = await user(uid), tokens = u.pushTokens || [];
    if (!tokens.length) continue;
    const { title, body, tag, open } = build(u.lang === "en" ? "en" : "it");
    let res;
    try { res = await fcm.sendEachForMulticast({ tokens, data: { title, body, url: open ? APP + "?open=" + open : APP, tag: tag || key }, webpush: { headers: { Urgency: "high", TTL: "86400" } } }); }
    catch (e) { console.error("invio fallito", key, e.message); continue; }
    sent += res.successCount;
    const bad = res.responses.map((r, i) => !r.success && /registration-token-not-registered|invalid-registration-token|invalid-argument/.test(r.error?.code || "") ? tokens[i] : null).filter(Boolean);
    if (bad.length) { await db.collection("users").doc(uid).update({ pushTokens: tokens.filter(t => !bad.includes(t)) }); users[uid].pushTokens = tokens.filter(t => !bad.includes(t)); }
  }
}

// ---- regole come nell'app
const need = g => g.rule === "min" ? Math.max(2, +g.min || 2) : Math.max(2, (g.members || []).length);
function rsvpOf(avail, s, u) {
  const a = avail[u] || {}, base = (a.days || {})[s.date];
  if (base === "no") return "no";
  const r = (s.rsvps || {})[u]; if (r) return r;
  return (a.over || {})[s.date] || base;
}

// ---- diagnosi: quanti dispositivi sono registrati ed eventuali errori di attivazione
{
  const us = await db.collection("users").get(); let devs = 0, people = 0;
  us.forEach(d => { const u = d.data(); users[d.id] = u; const n = (u.pushTokens || []).length; devs += n; if (n) people++;
    if (u.pushError) console.log(`::notice::Errore attivazione (${d.id.slice(0, 5)}): ${u.pushError.msg} | iOS ${u.pushError.ios} standalone ${u.pushError.standalone} permesso ${u.pushError.perm}`); });
  console.log(`::notice::Dispositivi registrati: ${devs} (persone: ${people})`);
}

// ---- inviti dentro l'app
for (const d of (await db.collection("invitations").get()).docs) {
  const i = d.data();
  if (NOW - ms(i.createdAt) > FRESH) continue;
  await notify(`inv_${d.id}_${ms(i.createdAt)}`, [i.to], l => l === "en"
    ? { title: "New group invite", body: `${i.byName} invites you to the group ${i.groupName}${i.game ? ` (${i.game})` : ""}.` }
    : { title: "Nuovo invito", body: `${i.byName} ti invita nel gruppo ${i.groupName}${i.game ? ` (${i.game})` : ""}.` });
}

// ---- gruppi: sessioni confermate, proposte, sessioni a rischio, promemoria
for (const gDoc of (await db.collection("groups").get()).docs) {
  const g = gDoc.data(), gid = gDoc.id, members = g.members || [], admins = (g.admins || []).filter(u => members.includes(u));
  const nameOf = u => (g.names || {})[u] || "Qualcuno";
  const [sessions, proposals, availSnap] = await Promise.all([
    gDoc.ref.collection("sessions").get(), gDoc.ref.collection("proposals").get(), gDoc.ref.collection("availability").get(),
  ]);
  const avail = {}; availSnap.forEach(a => { avail[a.id] = a.data(); });

  for (const sd of sessions.docs) {
    const s = sd.data(); if (s.date < TODAY) continue;
    const by = s.confirmedBy || s.createdBy;
    if (NOW - ms(s.confirmedAt) < FRESH) await notify(`ev_${gid}_${sd.id}`, members.filter(u => u !== by), l => l === "en"
      ? { title: `Game on: ${g.game}`, body: `${nameOf(by)} confirmed ${when(l, s.date, s.time)} with ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }
      : { title: `Si gioca: ${g.game}`, body: `${nameOf(by)} ha confermato ${when(l, s.date, s.time)} con ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" });
    const yes = members.filter(u => rsvpOf(avail, s, u) === "yes").length;
    if (yes < need(g)) await notify(`risk_${gid}_${sd.id}_${s.date}`, admins, l => l === "en"
      ? { title: `At risk: ${g.game}`, body: `${when(l, s.date, s.time)}: ${yes} of ${members.length} are in, the minimum is ${need(g)}. Decide whether to keep, move or revoke it.`, open: "prog" }
      : { title: `A rischio: ${g.game}`, body: `${when(l, s.date, s.time)}: ci sono ${yes} su ${members.length}, il minimo è ${need(g)}. Decidi se tenerla, spostarla o revocarla.`, open: "prog" });
    if (s.date === TOMORROW && HOUR >= REMIND_FROM_HOUR) await notify(`rem_${gid}_${sd.id}_${s.date}`, members.filter(u => rsvpOf(avail, s, u) !== "no"), l => l === "en"
      ? { title: `Tomorrow: ${g.game}`, body: `Tomorrow ${T.en.at} ${s.time || "21:00"} with ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }
      : { title: `Domani si gioca a ${g.game}`, body: `Domani ${T.it.at} ${s.time || "21:00"} con ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" });
  }
  for (const pd of proposals.docs) {
    const p = pd.data(); if (p.date < TODAY || NOW - ms(p.createdAt) > FRESH) continue;
    await notify(`prop_${gid}_${pd.id}`, members.filter(u => u !== p.by), l => l === "en"
      ? { title: `New proposal: ${g.game}`, body: `${nameOf(p.by)} proposes ${when(l, p.date, p.time)} to ${g.name}. Answer in Sessions.`, open: "prop" }
      : { title: `Nuova proposta: ${g.game}`, body: `${nameOf(p.by)} propone ${when(l, p.date, p.time)} al gruppo ${g.name}. Rispondi in Sessioni.`, open: "prop" });
  }
}
console.log(`::notice::Notifiche inviate: ${sent}`);
