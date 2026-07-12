/* Amsterdam Pro Taxi - main.js
   Statisch, geen backend: de boekingswidget stuurt alles door naar WhatsApp. */

const WHATSAPP_NUMMER = "31202101637";

/* ==========================================================
   Boekingswidget: 2 stappen + versturen naar WhatsApp
   ========================================================== */
const form = document.getElementById("boekingForm");
const panels = document.querySelectorAll(".bpanel");
const bsteps = document.querySelectorAll(".bstep");
const blineFill = document.getElementById("blineFill");
const bookingTitle = document.getElementById("bookingTitle");

if (form) {

function toonStap(n) {
  panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === String(n)));
  bsteps.forEach((s) => {
    const num = Number(s.dataset.bstep);
    s.classList.toggle("is-active", num === n);
    s.classList.toggle("is-done", num < n);
  });
  blineFill.style.width = n === 2 ? "100%" : "0%";
  bookingTitle.textContent = n === 1 ? "Stap 1 · Jouw rit" : "Stap 2 · Jouw gegevens";
}

function valideer(namen) {
  let eersteFout = null;
  namen.forEach((name) => {
    const veld = form.querySelector(`[name='${name}']`);
    if (!veld) return;
    if (!veld.value.trim()) {
      veld.classList.add("veld-fout");
      if (!eersteFout) eersteFout = veld;
    } else {
      veld.classList.remove("veld-fout");
    }
  });
  if (eersteFout) {
    eersteFout.focus();
    eersteFout.reportValidity();
    return false;
  }
  return true;
}

document.getElementById("naarStap2").addEventListener("click", () => {
  if (valideer(["ophaaladres", "bestemming", "datumtijd"])) toonStap(2);
});
document.getElementById("terugStap1").addEventListener("click", () => toonStap(1));

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!valideer(["ophaaladres", "bestemming", "datumtijd"])) { toonStap(1); return; }
  if (!valideer(["naam"])) return;

  const v = (name) => this.querySelector(`[name='${name}']`)?.value.trim();
  const voertuig = this.querySelector("[name='voertuig']:checked")?.value;

  const regels = [
    `Hoi Amsterdam Pro Taxi! Ik wil graag een rit reserveren.`,
    `Naam: ${v("naam")}`,
    `Type dienst: ${v("dienst")}`,
    `Ophaaladres: ${v("ophaaladres")}`,
    `Bestemming: ${v("bestemming")}`,
    `Datum/tijd: ${v("datumtijd")}`,
    `Aantal personen: ${v("personen")}`,
    v("koffers") !== "0" ? `Koffers: ${v("koffers")}` : "",
    voertuig ? `Voertuig: ${voertuig}` : "",
    v("vlucht") ? `Vluchtnummer: ${v("vlucht")}` : "",
    v("opmerkingen") ? `Opmerkingen: ${v("opmerkingen")}` : "",
  ].filter(Boolean);

  const bericht = encodeURIComponent(regels.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMMER}?text=${bericht}`, "_blank", "noopener");
});

form.querySelectorAll("[required]").forEach((veld) => {
  veld.addEventListener("input", () => veld.classList.remove("veld-fout"));
});

/* Vooraf reserveren: geen datum in het verleden */
(function () {
  const veld = document.getElementById("f-datumtijd");
  if (!veld) return;
  const nu = new Date();
  nu.setMinutes(nu.getMinutes() - nu.getTimezoneOffset());
  veld.min = nu.toISOString().slice(0, 16);
})();

/* ==========================================================
   Prefill vanuit dienstenkaarten en knoppen (data-boek)
   ========================================================== */
document.querySelectorAll("[data-boek]").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const { dienst, ophaal, bestemming } = this.dataset;
    if (dienst) {
      const select = document.getElementById("f-dienst");
      if ([...select.options].some((o) => o.value === dienst)) select.value = dienst;
    }
    if (ophaal) document.getElementById("f-ophaal").value = ophaal;
    if (bestemming) document.getElementById("f-bestemming").value = bestemming;
    toonStap(1);
    sluitMobielMenu();
    document.getElementById("boeken").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

}

/* ==========================================================
   Swipe-tracks: pijltjes
   ========================================================== */
document.querySelectorAll(".tarrow").forEach((knop) => {
  knop.addEventListener("click", () => {
    const track = document.getElementById(knop.dataset.track);
    const kaart = track.firstElementChild;
    const stap = (kaart ? kaart.getBoundingClientRect().width : 320) + 16;
    track.scrollBy({ left: stap * Number(knop.dataset.dir), behavior: "smooth" });
  });
});

/* ==========================================================
   Hoe het werkt: lijn gloeit mee met scroll/swipe
   ========================================================== */
(function () {
  const wrap = document.getElementById("stepsWrap");
  const track = document.getElementById("stepsTrack");
  const fill = document.getElementById("stepsFill");
  if (!wrap || !track || !fill) return;
  const steps = [...track.querySelectorAll(".step")];
  if (!steps.length) return;

  function zetVoortgang(pct) {
    fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
    const actief = Math.round((pct / 100) * (steps.length - 1));
    steps.forEach((s, i) => s.classList.toggle("is-lit", i <= actief && pct > 4));
  }

  function trackScrollbaar() {
    return track.scrollWidth > track.clientWidth + 8;
  }

  /* Mobiel: voortgang volgt de swipe door de stappen */
  track.addEventListener("scroll", () => {
    if (!trackScrollbaar()) return;
    const max = track.scrollWidth - track.clientWidth;
    zetVoortgang(12 + (track.scrollLeft / max) * 88);
  }, { passive: true });

  /* Desktop (en eerste keer in beeld): stappen lichten na elkaar op */
  let gespeeld = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || gespeeld) return;
      gespeeld = true;
      if (trackScrollbaar()) { zetVoortgang(12); return; }
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        zetVoortgang((i / (steps.length - 1)) * 100);
        if (i >= steps.length - 1) clearInterval(timer);
      }, 550);
      zetVoortgang(6);
    });
  }, { threshold: 0.4 });
  io.observe(wrap);
})();

/* ==========================================================
   Voertuig-tabs bij tarieven
   ========================================================== */
document.querySelectorAll(".vtab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".vtab").forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", String(t === tab));
    });
    document.querySelectorAll(".vpanel").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.vp === tab.dataset.vt);
    });
  });
});

/* ==========================================================
   FAQ accordion
   ========================================================== */
document.querySelectorAll(".faq-q").forEach((knop) => {
  knop.addEventListener("click", () => {
    const open = knop.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-q").forEach((andere) => {
      andere.setAttribute("aria-expanded", "false");
      andere.nextElementSibling.style.maxHeight = null;
    });
    if (!open) {
      knop.setAttribute("aria-expanded", "true");
      const antwoord = knop.nextElementSibling;
      antwoord.style.maxHeight = antwoord.scrollHeight + "px";
    }
  });
});

/* ==========================================================
   Reveal bij scroll
   ========================================================== */
(function () {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  els.forEach((el) => io.observe(el));
})();

/* ==========================================================
   Mobiel menu
   ========================================================== */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function sluitMobielMenu() {
  mainNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", sluitMobielMenu));

/* Jaartal */
document.getElementById("jaar").textContent = new Date().getFullYear();
