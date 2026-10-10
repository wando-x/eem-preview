/* Elevated Estates Media – language toggle, mobile menu, contact form (no backend). */
(function () {
  "use strict";

  // PLACEHOLDER: replace with the real business email before launch (also in index.html).
  var CONTACT_EMAIL = "hello@example.com";
  var STORAGE_KEY = "eem-lang";

  var ES = {
    "skip": "Saltar al contenido",
    "menu": "Abrir menú",
    "nav.packages": "Paquetes",
    "nav.area": "Zona de servicio",
    "nav.how": "Cómo funciona",
    "nav.portfolio": "Portafolio",
    "nav.contact": "Contacto",
    "hero.badge": "Ya recibimos consultas",
    "hero.lead": "Fotos y video aéreos para casas en venta en Schaumburg y los suburbios cercanos del noroeste de Chicago.",
    "hero.sub": "Pensado para agentes inmobiliarios y para fotógrafos inmobiliarios que no vuelan dron.",
    "hero.cta1": "Ver paquetes",
    "hero.cta2": "Solicitar una sesión",
    "hero.p1": "Archivos editados dentro de las 24 horas del vuelo",
    "hero.p2": "Versiones sin marca listas para el MLS",
    "hero.p3": "Sesiones los fines de semana",
    "pk.kicker": "Paquetes",
    "pk.title": "Precios simples y fijos",
    "pk.intro": "Elige el paquete que mejor se adapte a la propiedad. Todos los paquetes incluyen edición profesional.",
    "pk.basic.name": "Aéreo Básico",
    "pk.basic.f1": "10 fotos aéreas editadas",
    "pk.basic.f2": "Versión MLS sin marca",
    "pk.basic.f3": "Entrega en 24 horas",
    "pk.popular": "Fotos + video",
    "pk.video.name": "Aéreo + Video",
    "pk.video.f1": "Todo lo del Aéreo Básico",
    "pk.video.f2": "Video de 60 segundos con música",
    "pk.video.f3": "Versión MLS sin marca",
    "pk.video.f4": "Versión con marca para redes sociales",
    "pk.sunset.name": "Atardecer",
    "pk.sunset.f1": "Aéreo + Video durante la hora dorada",
    "pk.sunset.f2": "Más 3 fotos al atardecer",
    "pk.forphoto": "Para fotógrafos",
    "pk.whole.name": "Mayorista",
    "pk.whole.f1": "10 fotos aéreas sin marca",
    "pk.whole.f2": "Entregadas a tu nombre",
    "pk.whole.f3": "Entrega en 24 horas",
    "pk.choose": "Elegir este paquete",
    "area.kicker": "Zona de servicio",
    "area.title": "Schaumburg, IL y suburbios cercanos",
    "area.text": "Estamos en Schaumburg y atendemos casas en venta en los suburbios del noroeste de Chicago. ¿No sabes si tu propiedad está dentro de la zona? Solo pregúntanos.",
    "how.kicker": "Cómo funciona",
    "how.title": "Cuatro pasos sencillos",
    "how.s1.t": "Solicitud",
    "how.s1.d": "Envía la dirección de la propiedad, el paquete que quieres y cualquier detalle a través del formulario de contacto.",
    "how.s2.t": "Agenda",
    "how.s2.d": "Acordamos un horario. Las sesiones se programan los fines de semana, sábados y domingos durante el día.",
    "how.s3.t": "Sesión",
    "how.s3.d": "Capturamos la propiedad desde el aire, si el clima y las condiciones del lugar lo permiten.",
    "how.s4.t": "Entrega",
    "how.s4.d": "Los archivos editados se entregan dentro de las 24 horas posteriores al vuelo.",
    "how.note": "Cada vuelo depende del clima, la ubicación y las condiciones del lugar, y la decisión de realizarlo queda siempre a criterio del piloto. Si un vuelo no puede realizarse, buscaremos contigo otra opción.",
    "pf.kicker": "Portafolio",
    "pf.title": "Nuestro trabajo",
    "pf.intro": "Nuestro portafolio está en camino. Pronto publicaremos aquí fotos y videos aéreos de muestra.",
    "pf.soon": "Próximamente",
    "ct.kicker": "Contacto",
    "ct.title": "Solicita una sesión",
    "ct.text": "Cuéntanos sobre la propiedad y te responderemos por correo electrónico. Ya recibimos consultas.",
    "ct.name": "Nombre",
    "ct.email": "Correo electrónico",
    "ct.phone": "Teléfono",
    "ct.optional": "(opcional)",
    "ct.address": "Dirección / ciudad de la propiedad",
    "ct.package": "Paquete",
    "opt.basic": "Aéreo Básico – $149",
    "opt.video": "Aéreo + Video – $279",
    "opt.sunset": "Atardecer – $399",
    "opt.wholesale": "Mayorista para fotógrafos – $110",
    "opt.unsure": "Todavía no lo sé",
    "ct.message": "Mensaje",
    "ct.messagePh": "Fin de semana preferido, detalles de la propiedad, cualquier cosa que debamos saber",
    "ct.submit": "Enviar consulta",
    "ft.area": "Fotos y video aéreos para casas en venta en Schaumburg, Hoffman Estates, Palatine, Arlington Heights, Elk Grove Village, Rolling Meadows, Streamwood, Hanover Park y Roselle, IL.",
    "ft.rights": "Todos los derechos reservados."
  };

  var MSG = {
    en: {
      title: "Elevated Estates Media | Aerial Real Estate Photo & Video in Schaumburg, IL",
      desc: "Aerial drone photos and video for homes for sale in Schaumburg and nearby northwest Chicago suburbs, for real estate agents and photographers.",
      required: "Please fill in your name, a valid email, and the property address/city.",
      notice: "Thanks! Your email app should open with your inquiry ready to send. If it didn't open, please email us at ",
      subject: "Shoot inquiry",
      bName: "Name", bEmail: "Email", bPhone: "Phone", bAddress: "Property address / city", bPackage: "Package", bMessage: "Message"
    },
    es: {
      title: "Elevated Estates Media | Fotos y video aéreos inmobiliarios en Schaumburg, IL",
      desc: "Fotos y video aéreos con dron para casas en venta en Schaumburg y suburbios cercanos del noroeste de Chicago, para agentes y fotógrafos inmobiliarios.",
      required: "Por favor completa tu nombre, un correo electrónico válido y la dirección/ciudad de la propiedad.",
      notice: "¡Gracias! Tu aplicación de correo debería abrirse con la consulta lista para enviar. Si no se abrió, escríbenos a ",
      subject: "Consulta de sesión",
      bName: "Nombre", bEmail: "Correo", bPhone: "Teléfono", bAddress: "Dirección / ciudad de la propiedad", bPackage: "Paquete", bMessage: "Mensaje"
    }
  };

  var current = "en";
  var originals = {}; // English text captured from the HTML

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  each("[data-i18n]", function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in originals)) originals[k] = el.textContent;
  });
  each("[data-i18n-placeholder]", function (el) {
    originals["ph:" + el.getAttribute("data-i18n-placeholder")] = el.getAttribute("placeholder");
  });
  originals.menu = "Open menu";

  function t(key) {
    if (current === "es" && ES[key] != null) return ES[key];
    return originals[key] != null ? originals[key] : "";
  }

  function setLang(lang) {
    current = lang === "es" ? "es" : "en";
    document.documentElement.lang = current;
    each("[data-i18n]", function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    each("[data-i18n-placeholder]", function (el) {
      var k = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", current === "es" ? ES[k] : originals["ph:" + k]);
    });
    each("[data-i18n-aria]", function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    each(".lang-toggle button", function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === current));
    });
    document.title = MSG[current].title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", MSG[current].desc);
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) { /* storage unavailable */ }
  }

  // Initial language: ?lang= URL param, then saved choice, then English.
  var initial = "en";
  var m = /[?&]lang=(en|es)\b/.exec(window.location.search);
  if (m) initial = m[1];
  else {
    try { initial = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) { initial = "en"; }
  }
  setLang(initial);

  each(".lang-toggle button", function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  // Mobile menu
  var nav = document.getElementById("site-nav");
  var menuBtn = document.querySelector(".menu-btn");
  if (nav && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    each("#site-nav a", function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // "Choose this package" buttons preselect the form
  var pkgSelect = document.getElementById("f-package");
  each("[data-package]", function (a) {
    a.addEventListener("click", function () {
      if (pkgSelect) pkgSelect.value = a.getAttribute("data-package");
    });
  });

  // Contact form -> mailto
  var form = document.getElementById("contact-form");
  var errBox = document.getElementById("form-error");
  var notice = document.getElementById("form-notice");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim();
      var email = f.email.value.trim();
      var phone = f.phone.value.trim();
      var address = f.address.value.trim();
      var pkgText = f["package"].options[f["package"].selectedIndex].text;
      var message = f.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      f.name.classList.toggle("invalid", !name);
      f.email.classList.toggle("invalid", !emailOk);
      f.address.classList.toggle("invalid", !address);

      if (!name || !emailOk || !address) {
        errBox.textContent = MSG[current].required;
        errBox.hidden = false;
        notice.hidden = true;
        return;
      }
      errBox.hidden = true;

      var L = MSG[current];
      var subject = L.subject + " – " + address;
      var body = [
        L.bName + ": " + name,
        L.bEmail + ": " + email,
        L.bPhone + ": " + (phone || "-"),
        L.bAddress + ": " + address,
        L.bPackage + ": " + pkgText,
        "",
        L.bMessage + ":",
        message || "-"
      ].join("\r\n");

      var href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      notice.textContent = "";
      notice.appendChild(document.createTextNode(L.notice));
      var a = document.createElement("a");
      a.href = "mailto:" + CONTACT_EMAIL;
      a.textContent = CONTACT_EMAIL;
      notice.appendChild(a);
      notice.appendChild(document.createTextNode("."));
      notice.hidden = false;

      window.location.href = href;
    });
  }
})();
