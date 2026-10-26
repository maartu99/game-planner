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
const MINUTES = HOUR * 60 + +new Intl.DateTimeFormat("en-GB", { timeZone: TZ, minute: "2-digit" }).format(new Date(NOW));
// Promemoria del giorno stesso: 5 ore prima dell'orario della sessione; senza orario, alle 9
const todayFrom = s => { const m = /^(\d{1,2}):(\d{2})/.exec(s.time || ""); return m ? Math.max(0, +m[1] * 60 + +m[2] - 300) : 9 * 60; };

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
// cat: tipo di notifica; ognuno sceglie quali ricevere (profilo: pushPrefs).
// Tutte accese di partenza, tranne "Domani si gioca" (rem), spenta finché la persona non la accende.
const PUSH_DEFAULTS = { rem: false };
const wants = (u, cat) => { const v = (u.pushPrefs || {})[cat]; return typeof v === "boolean" ? v : PUSH_DEFAULTS[cat] ?? true; };
async function notify(key, uids, build, cat) {
  const logRef = db.collection("pushLog").doc(key);
  if ((await logRef.get()).exists) return;
  await logRef.set({ at: NOW });
  for (const uid of new Set(uids)) {
    const u = await user(uid), tokens = u.pushTokens || [];
    if (!tokens.length || (cat && !wants(u, cat))) continue;
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
if (new Date(NOW).getUTCMinutes() < 5) {
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
    : { title: "Nuovo invito", body: `${i.byName} ti invita nel gruppo ${i.groupName}${i.game ? ` (${i.game})` : ""}.` }, "inv");
}

// ---- gruppi: sessioni confermate, proposte, sessioni a rischio, promemoria
for (const gDoc of (await db.collection("groups").get()).docs) {
  const g = gDoc.data(), gid = gDoc.id, members = g.members || [], admins = (g.admins || []).filter(u => members.includes(u));
  const nameOf = u => (g.names || {})[u] || "Qualcuno";
  const [sessions, proposals] = await Promise.all([
    gDoc.ref.collection("sessions").where("date", ">=", TODAY).get(), gDoc.ref.collection("proposals").where("date", ">=", TODAY).get(),
  ]);
  if (sessions.empty && proposals.empty) continue;
  const avail = {};
  if (!sessions.empty) (await gDoc.ref.collection("availability").get()).forEach(a => { avail[a.id] = a.data(); });

  for (const sd of sessions.docs) {
    const s = sd.data(); if (s.date < TODAY) continue;
    const by = s.confirmedBy || s.createdBy;
    if (NOW - ms(s.confirmedAt) < FRESH) await notify(`ev_${gid}_${sd.id}`, members.filter(u => u !== by), l => l === "en"
      ? { title: `Game on: ${g.game}`, body: `${nameOf(by)} confirmed ${when(l, s.date, s.time)} with ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }
      : { title: `Si gioca: ${g.game}`, body: `${nameOf(by)} ha confermato ${when(l, s.date, s.time)} con ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }, "ev");
    if (s.updatedAt && NOW - ms(s.updatedAt) < FRESH) await notify(`evu_${gid}_${sd.id}_${ms(s.updatedAt)}`, members.filter(u => u !== s.updatedBy), l => l === "en"
      ? { title: `Updated: ${g.game}`, body: `${when(l, s.date, s.time)} with ${g.name}${s.location ? `, ${s.location}` : ", place to be defined"}.`, open: "prog" }
      : { title: `Sessione aggiornata: ${g.game}`, body: `${when(l, s.date, s.time)} con ${g.name}${s.location ? `, ${s.location}` : ", luogo da definire"}.`, open: "prog" }, "ev");
    const yes = members.filter(u => rsvpOf(avail, s, u) === "yes").length;
    if (yes < need(g)) await notify(`risk_${gid}_${sd.id}_${s.date}`, admins, l => l === "en"
      ? { title: `At risk: ${g.game}`, body: `${when(l, s.date, s.time)}: ${yes} of ${members.length} are in, the minimum is ${need(g)}. Decide whether to keep, move or revoke it.`, open: "prog" }
      : { title: `A rischio: ${g.game}`, body: `${when(l, s.date, s.time)}: ci sono ${yes} su ${members.length}, il minimo è ${need(g)}. Decidi se tenerla, spostarla o revocarla.`, open: "prog" }, "risk");
    if (s.date === TOMORROW && HOUR >= REMIND_FROM_HOUR) await notify(`rem_${gid}_${sd.id}_${s.date}`, members.filter(u => rsvpOf(avail, s, u) !== "no"), l => l === "en"
      ? { title: `Tomorrow: ${g.game}`, body: `Tomorrow ${T.en.at} ${s.time || "21:00"} with ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }
      : { title: `Domani si gioca a ${g.game}`, body: `Domani ${T.it.at} ${s.time || "21:00"} con ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }, "rem");
    if (s.date === TODAY && MINUTES >= todayFrom(s)) await notify(`today_${gid}_${sd.id}_${s.date}`, members.filter(u => rsvpOf(avail, s, u) !== "no"), l => l === "en"
      ? { title: `Game day: ${g.game}`, body: `Today ${T.en.at} ${s.time || "21:00"} with ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }
      : { title: `Oggi si gioca a ${g.game}`, body: `Oggi ${T.it.at} ${s.time || "21:00"} con ${g.name}${s.location ? `, ${s.location}` : ""}.`, open: "prog" }, "today");
  }
  for (const pd of proposals.docs) {
    const p = pd.data(); if (p.date < TODAY || NOW - ms(p.createdAt) > FRESH) continue;
    await notify(`prop_${gid}_${pd.id}`, members.filter(u => u !== p.by), l => l === "en"
      ? { title: `New proposal: ${g.game}`, body: `${nameOf(p.by)} proposes ${when(l, p.date, p.time)} to ${g.name}. Answer in Sessions.`, open: "prop" }
      : { title: `Nuova proposta: ${g.game}`, body: `${nameOf(p.by)} propone ${when(l, p.date, p.time)} al gruppo ${g.name}. Rispondi in Sessioni.`, open: "prop" }, "prop");
  }
}
console.log(`::notice::Notifiche inviate: ${sent}`);
