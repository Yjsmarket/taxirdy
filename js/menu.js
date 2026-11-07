/* Hamburgermenu voor smalle schermen.
   Bouwt zichzelf uit de bestaande .nav-links, dus elke pagina houdt
   automatisch de juiste relatieve links. Geen markup per pagina nodig. */
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;
  var links = nav.querySelector(".nav-links");
  if (!links) return;
  var acties = nav.querySelector(".nav-acties") || nav;

  var merk = nav.querySelector(".merk");
  var tel = nav.querySelector('a[href^="tel:"]');
  var wa = nav.querySelector('a[href*="wa.me"]');
  var res = nav.querySelector(".btn-goud");

  /* ---------- Knop ---------- */
  var knop = document.createElement("button");
  knop.type = "button";
  knop.className = "menu-knop";
  knop.setAttribute("aria-label", "Menu openen");
  knop.setAttribute("aria-expanded", "false");
  knop.setAttribute("aria-controls", "hoofdmenu");
  knop.innerHTML = "<span></span><span></span><span></span>";
  acties.appendChild(knop);

  /* ---------- Paneel ---------- */
  var paneel = document.createElement("div");
  paneel.className = "menu-paneel";
  paneel.id = "hoofdmenu";
  paneel.setAttribute("role", "dialog");
  paneel.setAttribute("aria-modal", "true");
  paneel.setAttribute("aria-label", "Hoofdmenu");

  var binnen = document.createElement("div");
  binnen.className = "menu-binnen";

  var lijst = document.createElement("nav");
  lijst.className = "menu-links";
  lijst.setAttribute("aria-label", "Paginas");

  if (merk && merk.getAttribute("href")) {
    var thuis = document.createElement("a");
    thuis.href = merk.getAttribute("href");
    thuis.textContent = "Home";
    lijst.appendChild(thuis);
  }
  Array.prototype.forEach.call(links.querySelectorAll("a"), function (a) {
    var k = document.createElement("a");
    k.href = a.getAttribute("href");
    k.textContent = a.textContent.trim();
    if (a.hasAttribute("aria-current")) k.setAttribute("aria-current", "page");
    lijst.appendChild(k);
  });
  binnen.appendChild(lijst);

  var rij = document.createElement("div");
  rij.className = "menu-acties";
  function voegToe(href, tekst, icoon, klasse) {
    if (!href) return;
    var a = document.createElement("a");
    a.className = "btn " + klasse;
    a.href = href;
    if (href.indexOf("http") === 0) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.innerHTML =
      '<svg class="i' + (icoon === "i-wa" ? " wa" : "") + '"><use href="#' + icoon + '"/></svg>' + tekst;
    rij.appendChild(a);
  }
  voegToe(res && res.getAttribute("href"), "Reserveren", "i-pijl", "btn-goud");
  voegToe(wa && wa.getAttribute("href"), "WhatsApp", "i-wa", "btn-lijn");
  voegToe(tel && tel.getAttribute("href"), (tel ? tel.textContent.trim() : "") || "Bellen", "i-tel", "btn-lijn");
  binnen.appendChild(rij);

  paneel.appendChild(binnen);
  document.body.appendChild(paneel);

  /* ---------- Openen en sluiten ---------- */
  var open = false;
  function zet(staat) {
    open = staat;
    paneel.classList.toggle("open", staat);
    knop.classList.toggle("open", staat);
    knop.setAttribute("aria-expanded", staat ? "true" : "false");
    knop.setAttribute("aria-label", staat ? "Menu sluiten" : "Menu openen");
    document.documentElement.classList.toggle("menu-op", staat);
    if (staat) {
      var eerste = lijst.querySelector("a");
      if (eerste) eerste.focus();
    } else {
      knop.focus();
    }
  }
  knop.addEventListener("click", function () {
    zet(!open);
  });
  paneel.addEventListener("click", function (e) {
    if (e.target === paneel || e.target.closest("a")) zet(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) zet(false);
  });
  var mq = window.matchMedia("(min-width: 1081px)");
  (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function () {
    if (mq.matches && open) zet(false);
  });
})();
