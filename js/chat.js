/* Elevated Estates Media – "EEM Assistant" chat widget.
 * Static site, no backend: an automated, rules-based assistant that answers ONLY from the
 * business facts below and helps visitors prepare a shoot request that is sent by email (mailto).
 * It is clearly labeled as an automated assistant and never claims to be a person,
 * never schedules anything and never says a flight is confirmed.
 */
(function () {
  "use strict";

  /* ======================================================================
   * BACKEND HOOK – connect a real-time bot later.
   * Set CHAT_BACKEND_URL to your endpoint (e.g. "https://example.com/api/chat").
   * When set, free-text messages are POSTed as JSON { message, lang, history } and the
   * endpoint must answer JSON { reply: "..." }. If the call fails, the local rules answer.
   * While it is null (default) NOTHING is sent anywhere: everything runs in the browser.
   * ==================================================================== */
  var CHAT_BACKEND_URL = null;

  // PLACEHOLDER email comes from js/main.js (CONTACT_EMAIL); fallback kept in sync.
  var EMAIL = (window.EEM && window.EEM.email) || "hello@example.com"; // PLACEHOLDER

  var TOWNS = ["Schaumburg", "Hoffman Estates", "Palatine", "Arlington Heights", "Elk Grove Village",
    "Rolling Meadows", "Streamwood", "Hanover Park", "Roselle"];

  var T = {
    en: {
      title: "EEM Assistant",
      subtitle: "Automated assistant · not a person",
      openLabel: "Open chat with the EEM Assistant",
      closeLabel: "Close chat",
      placeholder: "Type a message…",
      send: "Send",
      greet: "Hi! Coming soon. Ask me about packages, service area, or request a shoot.",
      hello: "Hi! How can I help?",
      c_packages: "Packages & prices", c_area: "Service area", c_how: "How it works", c_request: "Request a shoot",
      packagesIntro: "Packages:",
      pk_basic: "Aerial Basic – $149: 10 edited aerial photos, MLS version, 24h delivery.",
      pk_video: "Aerial + Video – $279: Basic + 60s video with music (MLS + branded social).",
      pk_sunset: "Sunset – $399: Aerial + Video at golden hour + 3 sunset photos.",
      pk_wholesale: "Wholesale for photographers – $110: 10 unbranded aerial photos under your name, 24h delivery.",
      area: "Schaumburg, Hoffman Estates, Palatine, Arlington Heights, Elk Grove Village, Rolling Meadows, Streamwood, Hanover Park and Roselle.",
      townYes: "Yes, we cover {town}.",
      how: "1. Send a request\n2. We schedule a weekend daytime shoot\n3. We fly, weather permitting\n4. Edited files within 24h of the flight",
      when: "Weekends, daytime. Files within 24h of the flight.",
      weather: "Flights depend on weather and site conditions, at the pilot's discretion.",
      human: "I'm an automated assistant. Send a request or email {email} and we'll reply.",
      thanks: "You're welcome!",
      fallback: "Sorry, I didn't get that. Try one of these:",
      more: "Anything else?",
      backendErr: "",
      // request flow
      r_start: "Great! Your name?",
      r_email: "Thanks, {name}. Your email?",
      r_emailBad: "That email doesn't look right. Try again?",
      r_phone: "Phone? (optional)",
      r_address: "Property address or city?",
      r_package: "Which package?",
      r_date: "Preferred weekend date? (just a preference, not a booking)",
      r_notes: "Any notes? (optional)",
      r_required: "This one is required.",
      r_summary: "Your request:",
      r_sendBtn: "Send by email", r_restart: "Start over", skip: "Skip", cancel: "Cancel",
      r_done: "Ready! Your email app will open with the request. We'll reply to confirm availability.",
      r_cancel: "Cancelled. Anything else?",
      unsure: "Not sure yet",
      L: { name: "Name", email: "Email", phone: "Phone", address: "Property", package: "Package", date: "Preferred date", notes: "Notes" },
      subject: "Shoot request – {address}",
      footer: "Sent from the EEM Assistant on the website."
    },
    es: {
      title: "Asistente EEM",
      subtitle: "Asistente automático · no es una persona",
      openLabel: "Abrir chat con el Asistente EEM",
      closeLabel: "Cerrar chat",
      placeholder: "Escribe un mensaje…",
      send: "Enviar",
      greet: "¡Hola! Muy pronto. Pregúntame por paquetes, zona o pide una sesión.",
      hello: "¡Hola! ¿En qué te ayudo?",
      c_packages: "Paquetes y precios", c_area: "Zona de servicio", c_how: "Cómo funciona", c_request: "Solicitar una sesión",
      packagesIntro: "Paquetes:",
      pk_basic: "Aéreo Básico – $149: 10 fotos aéreas editadas, versión MLS, entrega en 24 h.",
      pk_video: "Aéreo + Video – $279: Básico + video de 60 s con música (MLS + versión con marca para redes).",
      pk_sunset: "Atardecer – $399: Aéreo + Video en la hora dorada + 3 fotos al atardecer.",
      pk_wholesale: "Mayorista para fotógrafos – $110: 10 fotos aéreas sin marca a tu nombre, entrega en 24 h.",
      area: "Schaumburg, Hoffman Estates, Palatine, Arlington Heights, Elk Grove Village, Rolling Meadows, Streamwood, Hanover Park y Roselle.",
      townYes: "Sí, cubrimos {town}.",
      how: "1. Envías una solicitud\n2. Agendamos un fin de semana, de día\n3. Volamos si el clima lo permite\n4. Archivos editados en 24 h tras el vuelo",
      when: "Fines de semana, de día. Archivos en 24 h tras el vuelo.",
      weather: "Los vuelos dependen del clima y del lugar, a criterio del piloto.",
      human: "Soy un asistente automático. Envía una solicitud o escribe a {email} y te responderemos.",
      thanks: "¡De nada!",
      fallback: "Perdona, no entendí. Prueba con una de estas opciones:",
      more: "¿Algo más?",
      backendErr: "",
      r_start: "¡Perfecto! ¿Tu nombre?",
      r_email: "Gracias, {name}. ¿Tu correo?",
      r_emailBad: "Ese correo no parece válido. ¿Otra vez?",
      r_phone: "¿Teléfono? (opcional)",
      r_address: "¿Dirección o ciudad de la propiedad?",
      r_package: "¿Qué paquete?",
      r_date: "¿Fin de semana preferido? (solo preferencia, no es una reserva)",
      r_notes: "¿Algún detalle? (opcional)",
      r_required: "Este dato es obligatorio.",
      r_summary: "Tu solicitud:",
      r_sendBtn: "Enviar por correo", r_restart: "Empezar de nuevo", skip: "Omitir", cancel: "Cancelar",
      r_done: "¡Listo! Se abrirá tu correo con la solicitud. Te responderemos para confirmar disponibilidad.",
      r_cancel: "Cancelado. ¿Algo más?",
      unsure: "Todavía no lo sé",
      L: { name: "Nombre", email: "Correo", phone: "Teléfono", address: "Propiedad", package: "Paquete", date: "Fecha preferida", notes: "Notas" },
      subject: "Solicitud de sesión – {address}",
      footer: "Enviado desde el Asistente EEM del sitio web."
    }
  };

  function lang() { return (window.EEM && window.EEM.lang && window.EEM.lang() === "es") || document.documentElement.lang === "es" ? "es" : "en"; }
  function t(k) { return T[lang()][k]; }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ""; }); }
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  var quick = !!(window.EEM && window.EEM.animated && !window.EEM.animated());

  var PKGS = ["basic", "video", "sunset", "wholesale", "unsure"];
  function pkgLabel(id) {
    if (id === "unsure") return t("unsure");
    return t("pk_" + id).split(":")[0];
  }

  var api = { openMail: function (href) { window.location.href = href; } };

  // ---------- DOM ----------
  var MARK = '<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M11 37 L29.2 21.6 Q32 19.4 34.8 21.6 L53 37" stroke-width="5.5"/><path d="M23 44 Q32 50.5 41 44" stroke-width="4.5"/><circle class="logo-sun" cx="49" cy="15" r="6.5" stroke="none"/></svg>';

  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "chat-fab";
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "eem-chat");
  fab.innerHTML = '<svg class="i-chat" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z" fill="currentColor"/></svg><svg class="i-close" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  var panel = document.createElement("section");
  panel.className = "chat-panel";
  panel.id = "eem-chat";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.innerHTML =
    '<header class="chat-head"><span class="chat-avatar">' + MARK + '</span>' +
    '<div class="chat-titles"><p class="chat-title"></p><p class="chat-sub"></p></div>' +
    '<button type="button" class="chat-close"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></header>' +
    '<div class="chat-log" role="log" aria-live="polite"></div>' +
    '<div class="chat-chips"></div>' +
    '<form class="chat-form" autocomplete="off"><input class="chat-input" type="text" maxlength="500"><button class="chat-send" type="submit"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form>';

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  var log = panel.querySelector(".chat-log");
  var chipsBox = panel.querySelector(".chat-chips");
  var form = panel.querySelector(".chat-form");
  var input = panel.querySelector(".chat-input");

  function applyLabels() {
    panel.querySelector(".chat-title").textContent = t("title");
    panel.querySelector(".chat-sub").textContent = t("subtitle");
    panel.setAttribute("aria-label", t("title"));
    panel.querySelector(".chat-close").setAttribute("aria-label", t("closeLabel"));
    fab.setAttribute("aria-label", isOpen ? t("closeLabel") : t("openLabel"));
    input.setAttribute("placeholder", t("placeholder"));
    input.setAttribute("aria-label", t("placeholder"));
    panel.querySelector(".chat-send").setAttribute("aria-label", t("send"));
    renderChips(currentChips);
  }

  // ---------- Messages ----------
  var history = [];
  // Scroll ONLY the message list (never the window / scrollIntoView).
  function scrollLog(el) {
    var target = log.scrollHeight;
    // a long bot answer: keep its first line in view instead of jumping past it
    if (el && el.offsetHeight > log.clientHeight - 24) target = el.offsetTop - 12;
    log.scrollTop = target;
  }
  function addMsg(who, text, extraClass, reuse) {
    var b = reuse || document.createElement("div");
    b.className = "msg msg-" + who + (extraClass ? " " + extraClass : "");
    b.textContent = text;
    if (!reuse) log.appendChild(b);
    scrollLog(who === "bot" ? b : null);
    history.push({ who: who, text: text });
    return b;
  }
  var queue = Promise.resolve();
  function bot(text, chips) {
    queue = queue.then(function () {
      return new Promise(function (resolve) {
        var typing = null;
        if (!quick) {
          typing = document.createElement("div");
          typing.className = "msg msg-bot typing";
          typing.innerHTML = "<span></span><span></span><span></span>";
          log.appendChild(typing);
          scrollLog(null);
        }
        setTimeout(function () {
          if (text) addMsg("bot", text, null, typing); // typing bubble turns into the message (no remove/re-add jump)
          else if (typing) typing.remove();
          if (chips) renderChips(chips);
          else setChipsBusy(false);
          resolve();
        }, quick ? 0 : 520);
      });
    });
    return queue;
  }

  // ---------- Chips ----------
  var currentChips = [];
  function mainChips() { return ["request", "packages", "area", "how"]; }
  function chipLabel(id) {
    var map = { packages: "c_packages", area: "c_area", how: "c_how", request: "c_request",
      skip: "skip", cancel: "cancel", send: "r_sendBtn", restart: "r_restart" };
    if (id.indexOf("pkg:") === 0) return pkgLabel(id.slice(4));
    return t(map[id]);
  }
  function setChipsBusy(on) { chipsBox.classList.toggle("busy", !!on); }
  function renderChips(ids) {
    currentChips = ids || [];
    setChipsBusy(false);
    chipsBox.scrollLeft = 0;
    chipsBox.innerHTML = "";
    currentChips.forEach(function (id) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "chip" + (id === "send" ? " chip-primary" : "");
      c.textContent = chipLabel(id);
      c.addEventListener("mousedown", function (e) { e.preventDefault(); }); // keep focus where it is
      c.addEventListener("click", function () { choose(id); });
      chipsBox.appendChild(c);
    });
  }

  // ---------- Request flow ----------
  var req = null; // { step, data }
  var STEPS = ["name", "email", "phone", "address", "package", "date", "notes"];
  var OPTIONAL = { phone: 1, date: 1, notes: 1 };

  function askStep() {
    var s = req.step;
    var prompt = { name: t("r_start"), email: fill(t("r_email"), { name: req.data.name }), phone: t("r_phone"),
      address: t("r_address"), "package": t("r_package"), date: t("r_date"), notes: t("r_notes") }[s];
    var chips = ["cancel"];
    if (OPTIONAL[s]) chips = ["skip", "cancel"];
    if (s === "package") chips = PKGS.map(function (p) { return "pkg:" + p; }).concat(["cancel"]);
    bot(prompt, chips);
  }
  function startRequest() {
    req = { step: "name", data: {} };
    askStep();
  }
  function nextStep() {
    var i = STEPS.indexOf(req.step);
    if (i < STEPS.length - 1) { req.step = STEPS[i + 1]; askStep(); }
    else { req.step = "summary"; showSummary(); }
  }
  function summaryText() {
    var L = t("L"), d = req.data;
    return [
      L.name + ": " + d.name,
      L.email + ": " + d.email,
      L.phone + ": " + (d.phone || "-"),
      L.address + ": " + d.address,
      L["package"] + ": " + pkgLabel(d["package"] || "unsure"),
      L.date + ": " + (d.date || "-"),
      L.notes + ": " + (d.notes || "-")
    ].join("\n");
  }
  function showSummary() {
    bot(t("r_summary"));
    queue = queue.then(function () { addMsg("bot", summaryText(), "msg-summary"); renderChips(["send", "restart", "cancel"]); });
  }
  function sendRequest() {
    var d = req.data;
    var body = summaryText() + "\n\n" + t("footer");
    var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(fill(t("subject"), { address: d.address })) +
      "&body=" + encodeURIComponent(body.replace(/\n/g, "\r\n"));
    req = null;
    bot(fill(t("r_done"), { email: EMAIL }), mainChips());
    api.openMail(href); // opens the visitor's email app; nothing is sent automatically
  }
  function handleStepInput(text) {
    var s = req.step, v = text.trim();
    if (s === "summary") { bot(t("r_summary"), ["send", "restart", "cancel"]); return; }
    if (!v && !OPTIONAL[s]) { bot(t("r_required")); return; }
    if (s === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { bot(t("r_emailBad")); return; }
    if (s === "package") {
      var n = norm(v), p = "unsure";
      if (/sunset|atardecer|golden|dorada|399/.test(n)) p = "sunset";
      else if (/wholesale|mayorista|photograph|fotograf|110/.test(n)) p = "wholesale";
      else if (/video|279/.test(n)) p = "video";
      else if (/basic|basico|149/.test(n)) p = "basic";
      req.data["package"] = p;
    } else {
      req.data[s] = v;
    }
    nextStep();
  }

  // ---------- Intents ----------
  function answer(text) {
    var n = norm(text);
    var town = null;
    TOWNS.forEach(function (tw) { if (n.indexOf(norm(tw)) !== -1) town = tw; });

    if (/(request|book|quote|hire|order|schedule a|solicit|reserv|cotiz|contrat|agendar|pedir)/.test(n)) { startRequest(); return; }
    if (/(human|person|real person|someone|persona|humano|alguien|bot\b|robot)/.test(n)) { bot(fill(t("human"), { email: EMAIL }), mainChips()); return; }
    if (town) { bot(fill(t("townYes"), { town: town }), mainChips()); return; }
    if (/(sunset|golden|atardecer|dorada)/.test(n)) { bot(t("pk_sunset"), mainChips()); return; }
    if (/(wholesale|photographer|mayorista|fotografo)/.test(n)) { bot(t("pk_wholesale"), mainChips()); return; }
    if (/(price|cost|package|how much|pricing|rate\b|rates|precio|cuesta|cuanto|paquete|tarifa)/.test(n)) { choose("packages", true); return; }
    if (/video/.test(n)) { bot(t("pk_video"), mainChips()); return; }
    if (/(weather|rain|wind|snow|clima|lluvia|viento|nieve)/.test(n)) { bot(t("weather"), mainChips()); return; }
    if (/(area|where|town|city|cities|location|serve|zona|donde|ciudad|ubicacion)/.test(n)) { choose("area", true); return; }
    if (/(weekend|when|saturday|sunday|deliver|24|time|fin de semana|cuando|sabado|domingo|entrega|horario)/.test(n)) { bot(t("when"), mainChips()); return; }
    if (/(\bhow\b|process|work|step|como|funciona|proceso|pasos)/.test(n)) { choose("how", true); return; }
    if (/(thank|thanks|gracias)/.test(n)) { bot(t("thanks"), mainChips()); return; }
    if (/^(hi|hey|hello|hola|buenas|buenos dias|good (morning|afternoon|evening))\b/.test(n)) { bot(t("hello"), mainChips()); return; }
    bot(t("fallback"), mainChips());
  }

  function askBackend(text) {
    // Only runs when CHAT_BACKEND_URL is set (see BACKEND HOOK above).
    return fetch(CHAT_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, lang: lang(), history: history.slice(-20) })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.reply) throw new Error("empty");
      bot(String(j.reply), mainChips());
    });
  }

  function handleText(text) {
    if (!text.trim() && !(req && OPTIONAL[req.step])) return;
    addMsg("user", text.trim() || t("skip"));
    setChipsBusy(true);
    if (req) { handleStepInput(text); return; }
    if (CHAT_BACKEND_URL && window.fetch) {
      askBackend(text).catch(function () { answer(text); });
      return;
    }
    answer(text);
  }

  function choose(id, silent) {
    if (!silent) addMsg("user", chipLabel(id));
    setChipsBusy(true);
    if (id === "packages") {
      bot(t("packagesIntro") + "\n• " + [t("pk_basic"), t("pk_video"), t("pk_sunset"), t("pk_wholesale")].join("\n• "), mainChips());
    } else if (id === "area") {
      bot(t("area"), mainChips());
    } else if (id === "how") {
      bot(t("how"), mainChips());
    } else if (id === "request" || id === "restart") {
      startRequest();
    } else if (id === "cancel") {
      req = null;
      bot(t("r_cancel"), mainChips());
    } else if (id === "skip" && req) {
      req.data[req.step] = "";
      nextStep();
    } else if (id === "send" && req) {
      sendRequest();
    } else if (id.indexOf("pkg:") === 0 && req) {
      req.data["package"] = id.slice(4);
      nextStep();
    }
  }

  // ---------- Open / close ----------
  var isOpen = false, greeted = false;
  var root = document.documentElement;
  var mqMobile = window.matchMedia ? window.matchMedia("(max-width: 599px)") : { matches: false };

  // Mobile: lock the page behind the sheet (scroll position is preserved, no position:fixed jump)
  function lockPage(on) {
    root.classList.toggle("chat-lock", !!(on && mqMobile.matches));
  }
  // Older iOS ignores overflow:hidden on body: block touch scrolling outside the panel
  document.addEventListener("touchmove", function (e) {
    if (root.classList.contains("chat-lock") && !panel.contains(e.target)) e.preventDefault();
  }, { passive: false });

  // Keep the sheet inside the *visible* viewport when the on-screen keyboard opens
  var vv = window.visualViewport, vvRaf = 0;
  function fitToViewport() {
    vvRaf = 0;
    if (!isOpen || !mqMobile.matches || !vv) { panel.style.top = ""; panel.style.height = ""; panel.classList.remove("kb"); return; }
    var keyboard = window.innerHeight - vv.height > 120;
    if (keyboard) {
      panel.classList.add("kb");
      panel.style.top = Math.round(vv.offsetTop) + "px";
      panel.style.height = Math.round(vv.height) + "px";
    } else {
      panel.classList.remove("kb");
      panel.style.top = "";
      panel.style.height = "";
    }
    scrollLog(null);
  }
  function queueFit() { if (!vvRaf) vvRaf = requestAnimationFrame(fitToViewport); }
  if (vv) { vv.addEventListener("resize", queueFit); vv.addEventListener("scroll", queueFit); }
  window.addEventListener("resize", queueFit);

  input.addEventListener("focus", function () { root.classList.add("chat-typing"); queueFit(); });
  input.addEventListener("blur", function () { root.classList.remove("chat-typing"); queueFit(); });

  function open() {
    isOpen = true;
    panel.hidden = false;
    root.classList.add("chat-open");
    lockPage(true);
    queueFit();
    requestAnimationFrame(function () { panel.classList.add("show"); });
    fab.setAttribute("aria-expanded", "true");
    fab.setAttribute("aria-label", t("closeLabel"));
    if (!greeted) { greeted = true; bot(t("greet"), mainChips()); }
    if (!mqMobile.matches) setTimeout(function () { input.focus({ preventScroll: true }); }, 50);
  }
  function close() {
    isOpen = false;
    panel.classList.remove("show");
    root.classList.remove("chat-open", "chat-typing");
    lockPage(false);
    queueFit();
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-label", t("openLabel"));
    setTimeout(function () { if (!isOpen) panel.hidden = true; }, quick ? 0 : 250);
    fab.focus({ preventScroll: true });
  }
  fab.addEventListener("click", function () { if (isOpen) close(); else open(); });
  panel.querySelector(".chat-close").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen) close(); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    handleText(v);
    if (document.activeElement !== input && !mqMobile.matches) input.focus({ preventScroll: true });
  });
  document.addEventListener("eem:langchange", applyLabels);
  applyLabels();

  // Test / screenshot helpers: ?chat=open, ?chat=demo
  api.open = open; api.close = close; api.say = handleText; api.choose = choose;
  api.state = function () { return { req: req, history: history, chips: currentChips.slice() }; };
  window.EEMChat = api;
  var cm = /[?&]chat=(open|demo)\b/.exec(window.location.search);
  if (cm) {
    open();
    if (cm[1] === "demo") queue.then(function () { choose("packages"); });
  }
})();
