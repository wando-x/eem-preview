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
      greet: "Hi! I'm the EEM Assistant, an automated helper for Elevated Estates Media. I can answer questions about packages, the service area and how it works, or help you put together a shoot request. Fabrizzio replies personally by email.",
      hello: "Hello! How can I help you today?",
      c_packages: "Packages & prices", c_area: "Service area", c_how: "How it works", c_request: "Request a shoot",
      packagesIntro: "Here are the packages:",
      pk_basic: "Aerial Basic – $149: 10 edited aerial photos, unbranded MLS version, 24-hour delivery.",
      pk_video: "Aerial + Video – $279: everything in Aerial Basic plus a 60-second video with music (unbranded MLS version and a branded version for social media).",
      pk_sunset: "Sunset – $399: Aerial + Video during golden hour, plus 3 sunset photos.",
      pk_wholesale: "Wholesale for photographers – $110: 10 unbranded aerial photos delivered under the photographer's name, 24-hour delivery.",
      area: "Based in Schaumburg, IL and serving nearby suburbs: Hoffman Estates, Palatine, Arlington Heights, Elk Grove Village, Rolling Meadows, Streamwood, Hanover Park and Roselle. If your listing is close by but not on the list, send a request and Fabrizzio will let you know.",
      townYes: "Yes, {town} is in the service area.",
      how: "It's simple:\n1. Request – send the address, package and any notes.\n2. Schedule – shoots happen on weekends (Saturdays and Sundays, daytime).\n3. Shoot – the property is captured from the air.\n4. Delivery – edited files within 24 hours of the flight.\nEvery flight depends on weather and site conditions and is always at the pilot's discretion.",
      when: "Shoots are scheduled on weekends, Saturdays and Sundays during daytime. Edited files are delivered within 24 hours of the flight. Send a request with your preferred date and Fabrizzio will reply to confirm availability.",
      weather: "Every flight depends on weather, location and site conditions, and whether it takes place is always at the pilot's discretion. If a flight can't happen, Fabrizzio will work with you on another option.",
      human: "I'm an automated assistant, not a person. To reach Fabrizzio, send a request here or email {email} and he'll reply personally.",
      thanks: "You're welcome! Anything else I can help with?",
      fallback: "Sorry, I'm a simple assistant and didn't catch that. I can tell you about packages, the service area or how it works, or take your request so Fabrizzio can reply by email.",
      more: "Anything else?",
      backendErr: "",
      // request flow
      r_start: "Great, let's put your request together. You can cancel at any time. What's your name?",
      r_email: "Thanks, {name}! What's your email address?",
      r_emailBad: "That doesn't look like a valid email address. Could you check it?",
      r_phone: "Phone number? (optional)",
      r_address: "What's the property address or city?",
      r_package: "Which package are you interested in?",
      r_date: "Preferred weekend date? Shoots happen on Saturdays and Sundays during daytime. This is only a preference, not a booking.",
      r_notes: "Any notes about the listing? (optional)",
      r_required: "This one is needed for the request.",
      r_summary: "Here's your request. Please check it:",
      r_sendBtn: "Send by email", r_restart: "Start over", skip: "Skip", cancel: "Cancel",
      r_done: "Your email app should open with the request ready to send to {email}. Once it's sent, Fabrizzio will reply to confirm availability. Nothing is scheduled until he confirms.",
      r_cancel: "No problem, the request was cancelled. Anything else I can help with?",
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
      greet: "¡Hola! Soy el Asistente EEM, un asistente automático de Elevated Estates Media. Puedo responder preguntas sobre los paquetes, la zona de servicio y cómo funciona, o ayudarte a preparar una solicitud de sesión. Fabrizzio responde personalmente por correo electrónico.",
      hello: "¡Hola! ¿En qué puedo ayudarte?",
      c_packages: "Paquetes y precios", c_area: "Zona de servicio", c_how: "Cómo funciona", c_request: "Solicitar una sesión",
      packagesIntro: "Estos son los paquetes:",
      pk_basic: "Aéreo Básico – $149: 10 fotos aéreas editadas, versión MLS sin marca, entrega en 24 horas.",
      pk_video: "Aéreo + Video – $279: todo lo del Aéreo Básico más un video de 60 segundos con música (versión MLS sin marca y versión con marca para redes sociales).",
      pk_sunset: "Atardecer – $399: Aéreo + Video durante la hora dorada, más 3 fotos al atardecer.",
      pk_wholesale: "Mayorista para fotógrafos – $110: 10 fotos aéreas sin marca entregadas a nombre del fotógrafo, entrega en 24 horas.",
      area: "Estamos en Schaumburg, IL y atendemos los suburbios cercanos: Hoffman Estates, Palatine, Arlington Heights, Elk Grove Village, Rolling Meadows, Streamwood, Hanover Park y Roselle. Si tu propiedad está cerca pero no aparece en la lista, envía una solicitud y Fabrizzio te dirá si es posible.",
      townYes: "Sí, {town} está dentro de la zona de servicio.",
      how: "Es sencillo:\n1. Solicitud: envía la dirección, el paquete y cualquier detalle.\n2. Agenda: las sesiones se hacen los fines de semana (sábados y domingos, de día).\n3. Sesión: se captura la propiedad desde el aire.\n4. Entrega: archivos editados dentro de las 24 horas posteriores al vuelo.\nCada vuelo depende del clima y de las condiciones del lugar, y siempre queda a criterio del piloto.",
      when: "Las sesiones se programan los fines de semana, sábados y domingos durante el día. Los archivos editados se entregan dentro de las 24 horas posteriores al vuelo. Envía una solicitud con tu fecha preferida y Fabrizzio te responderá para confirmar disponibilidad.",
      weather: "Cada vuelo depende del clima, la ubicación y las condiciones del lugar, y la decisión de realizarlo queda siempre a criterio del piloto. Si un vuelo no puede realizarse, Fabrizzio buscará contigo otra opción.",
      human: "Soy un asistente automático, no una persona. Para hablar con Fabrizzio, envía una solicitud aquí o escribe a {email} y te responderá personalmente.",
      thanks: "¡De nada! ¿Puedo ayudarte con algo más?",
      fallback: "Perdona, soy un asistente sencillo y no entendí bien. Puedo contarte sobre los paquetes, la zona de servicio o cómo funciona, o tomar tu solicitud para que Fabrizzio te responda por correo.",
      more: "¿Algo más?",
      backendErr: "",
      r_start: "Perfecto, preparemos tu solicitud. Puedes cancelar en cualquier momento. ¿Cómo te llamas?",
      r_email: "¡Gracias, {name}! ¿Cuál es tu correo electrónico?",
      r_emailBad: "Ese correo no parece válido. ¿Puedes revisarlo?",
      r_phone: "¿Número de teléfono? (opcional)",
      r_address: "¿Cuál es la dirección o ciudad de la propiedad?",
      r_package: "¿Qué paquete te interesa?",
      r_date: "¿Fin de semana preferido? Las sesiones se hacen los sábados y domingos durante el día. Es solo una preferencia, no una reserva.",
      r_notes: "¿Algún detalle sobre la propiedad? (opcional)",
      r_required: "Este dato es necesario para la solicitud.",
      r_summary: "Esta es tu solicitud. Por favor, revísala:",
      r_sendBtn: "Enviar por correo", r_restart: "Empezar de nuevo", skip: "Omitir", cancel: "Cancelar",
      r_done: "Tu aplicación de correo debería abrirse con la solicitud lista para enviar a {email}. Cuando la envíes, Fabrizzio te responderá para confirmar disponibilidad. No hay nada agendado hasta que él lo confirme.",
      r_cancel: "Sin problema, la solicitud se canceló. ¿Puedo ayudarte con algo más?",
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
  function addMsg(who, text, extraClass) {
    var b = document.createElement("div");
    b.className = "msg msg-" + who + (extraClass ? " " + extraClass : "");
    b.textContent = text;
    log.appendChild(b);
    // keep the start of long bot answers in view
    log.scrollTop = who === "bot" ? Math.min(log.scrollHeight, b.offsetTop - 12) : log.scrollHeight;
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
          log.scrollTop = log.scrollHeight;
        }
        setTimeout(function () {
          if (typing) typing.remove();
          if (text) addMsg("bot", text);
          if (chips) renderChips(chips);
          resolve();
        }, quick ? 0 : 520);
      });
    });
    return queue;
  }

  // ---------- Chips ----------
  var currentChips = [];
  function mainChips() { return ["packages", "area", "how", "request"]; }
  function chipLabel(id) {
    var map = { packages: "c_packages", area: "c_area", how: "c_how", request: "c_request",
      skip: "skip", cancel: "cancel", send: "r_sendBtn", restart: "r_restart" };
    if (id.indexOf("pkg:") === 0) return pkgLabel(id.slice(4));
    return t(map[id]);
  }
  function renderChips(ids) {
    currentChips = ids || [];
    chipsBox.innerHTML = "";
    currentChips.forEach(function (id) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "chip" + (id === "send" ? " chip-primary" : "");
      c.textContent = chipLabel(id);
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
    renderChips([]);
    if (req) { handleStepInput(text); return; }
    if (CHAT_BACKEND_URL && window.fetch) {
      askBackend(text).catch(function () { answer(text); });
      return;
    }
    answer(text);
  }

  function choose(id, silent) {
    if (!silent) addMsg("user", chipLabel(id));
    renderChips([]);
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
  function open() {
    isOpen = true;
    panel.hidden = false;
    document.documentElement.classList.add("chat-open");
    requestAnimationFrame(function () { panel.classList.add("show"); });
    fab.setAttribute("aria-expanded", "true");
    fab.setAttribute("aria-label", t("closeLabel"));
    if (!greeted) { greeted = true; bot(t("greet"), mainChips()); }
    if (window.matchMedia && window.matchMedia("(min-width: 600px)").matches) setTimeout(function () { input.focus(); }, 50);
  }
  function close() {
    isOpen = false;
    panel.classList.remove("show");
    document.documentElement.classList.remove("chat-open");
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-label", t("openLabel"));
    setTimeout(function () { if (!isOpen) panel.hidden = true; }, quick ? 0 : 250);
    fab.focus();
  }
  fab.addEventListener("click", function () { if (isOpen) close(); else open(); });
  panel.querySelector(".chat-close").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen) close(); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    handleText(v);
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
