/* Amsterdam Pro Taxi - main.js
   Statisch, geen backend: het boekingsformulier stuurt door naar WhatsApp. */

const WHATSAPP_NUMMER = "31202101637";

/* ---------- Boekingsformulier: verstuur naar WhatsApp ---------- */
document.getElementById("boekingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const v = (name) => this.querySelector(`[name='${name}']`)?.value.trim();

  // Verplichte velden valideren voordat er iets verstuurd wordt
  const verplicht = ["naam", "ophaaladres", "bestemming", "datumtijd"];
  let eersteFout = null;
  verplicht.forEach((name) => {
    const veld = this.querySelector(`[name='${name}']`);
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
    return;
  }

  const regels = [
    `Hoi Amsterdam Pro Taxi! Ik wil graag een rit reserveren.`,
    `Naam: ${v("naam")}`,
    `Type dienst: ${v("dienst")}`,
    `Ophaaladres: ${v("ophaaladres")}`,
    `Bestemming: ${v("bestemming")}`,
    `Datum/tijd: ${v("datumtijd")}`,
    v("personen") ? `Aantal personen: ${v("personen")}` : "",
    v("vlucht") ? `Vluchtnummer: ${v("vlucht")}` : "",
    v("opmerkingen") ? `Opmerkingen: ${v("opmerkingen")}` : "",
  ].filter(Boolean);

  const bericht = encodeURIComponent(regels.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMMER}?text=${bericht}`, "_blank", "noopener");
});

/* Foutmarkering weghalen zodra er getypt wordt */
document.querySelectorAll("#boekingForm [required]").forEach((veld) => {
  veld.addEventListener("input", () => veld.classList.remove("veld-fout"));
});

/* Vooraf reserveren: datum/tijd in het verleden niet toestaan */
(function () {
  const veld = document.getElementById("f-datumtijd");
  if (!veld) return;
  const nu = new Date();
  nu.setMinutes(nu.getMinutes() - nu.getTimezoneOffset());
  veld.min = nu.toISOString().slice(0, 16);
})();

/* ---------- Prefill vanuit diensten- en route-kaarten ---------- */
document.querySelectorAll(".js-boek").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const dienst = this.dataset.dienst;
    const ophaal = this.dataset.ophaal;
    const bestemming = this.dataset.bestemming;

    if (dienst) {
      const select = document.getElementById("f-dienst");
      const optie = Array.from(select.options).find((o) => o.value === dienst);
      if (optie) select.value = dienst;
    }
    if (ophaal) document.getElementById("f-ophaal").value = ophaal;
    if (bestemming) document.getElementById("f-bestemming").value = bestemming;

    document.getElementById("boeken").scrollIntoView({ behavior: "smooth" });
  });
});

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-q").forEach((knop) => {
  knop.addEventListener("click", () => {
    const open = knop.getAttribute("aria-expanded") === "true";
    const antwoord = knop.nextElementSibling;

    // Andere items sluiten
    document.querySelectorAll(".faq-q").forEach((andere) => {
      andere.setAttribute("aria-expanded", "false");
      andere.nextElementSibling.style.maxHeight = null;
    });

    if (!open) {
      knop.setAttribute("aria-expanded", "true");
      antwoord.style.maxHeight = antwoord.scrollHeight + "px";
    }
  });
});

/* ---------- Diensten-dropdown in de navigatie ---------- */
(function () {
  const item = document.querySelector(".nav-item.has-dropdown");
  const knop = item.querySelector(".dropdown-toggle");

  knop.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = item.classList.toggle("open");
    knop.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (!item.contains(e.target)) {
      item.classList.remove("open");
      knop.setAttribute("aria-expanded", "false");
    }
  });

  // Na klik op een dropdown-link: dropdown en mobiel menu sluiten
  item.querySelectorAll(".dropdown a").forEach((link) => {
    link.addEventListener("click", () => {
      item.classList.remove("open");
      knop.setAttribute("aria-expanded", "false");
      sluitMobielMenu();
    });
  });
})();

/* ---------- Mobiel menu ---------- */
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

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", sluitMobielMenu);
});

/* ---------- Jaartal in footer ---------- */
document.getElementById("jaar").textContent = new Date().getFullYear();
