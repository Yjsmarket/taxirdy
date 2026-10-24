/* Cookietoestemming, Google Consent Mode v2 en conversiemeting.
   Werkt op elke pagina. Zolang de codes hieronder niet zijn ingevuld,
   wordt er niets geladen en niets gemeten, maar de balk werkt wel. */
(() => {

  /* ===================================================================
     HIER INVULLEN, de rest hoef je niet aan te raken.

     ADS_ID        staat in Google Ads onder Doelen, Conversies,
                   Google-tag. Ziet eruit als AW-123456789.

     WHATSAPP      conversielabel van de conversieactie die je aanmaakt
     BELLEN        voor WhatsApp-aanvragen en voor telefoongesprekken.
                   Formaat: AW-123456789/AbCdEfGhIjKlMnOp
     =================================================================== */
  const ADS_ID = "AW-18533695969";
  const CONVERSIES = {
    whatsapp: "AW-18533695969/MHBdCK_pn6gdEOGDx4VF",
    bellen:   "AW-18533695969/mQ37CLLpn6gdEOGDx4VF"
  };
  const PRIVACY_URL = ""; /* straks: "/privacy/" */
  /* =================================================================== */

  const ingevuld = /^AW-\d+$/.test(ADS_ID);
  const SLEUTEL = "fr-toestemming";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  /* ---------- Consent Mode v2 ----------
     Standaard staat alles op geweigerd. Dat moet, voordat de Google-tag
     laadt, anders worden er al cookies gezet voordat iemand iets kiest. */
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  const bewaard = (() => { try { return localStorage.getItem(SLEUTEL); } catch { return null; } })();
  if (bewaard === "alles") verleen();

  function verleen() {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
  }

  /* ---------- Google-tag laden ---------- */
  if (ingevuld) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ADS_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", ADS_ID);
  }

  /* ---------- Conversies meten ----------
     Google telt ook zonder toestemming mee, via geschatte conversies,
     dus we sturen het signaal altijd. Wat er niet is, zijn de cookies. */
  const laatste = {};
  function conversie(soort) {
    const doel = CONVERSIES[soort];
    if (!ingevuld || !doel || doel.includes("NOG-INVULLEN")) return;
    const nu = Date.now();
    if (laatste[soort] && nu - laatste[soort] < 30000) return; /* niet dubbel tellen */
    laatste[soort] = nu;
    gtag("event", "conversion", { send_to: doel });
  }

  addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const h = a.getAttribute("href") || "";
    if (h.startsWith("https://wa.me/") || h.startsWith("https://api.whatsapp.com/")) conversie("whatsapp");
    else if (h.startsWith("tel:")) conversie("bellen");
  }, true);

  /* Het reserveerformulier op de homepage opent WhatsApp via window.open,
     dus dat is geen gewone linkklik. Die vangen we apart af. */
  const boek = document.getElementById("boek");
  if (boek) boek.addEventListener("submit", () => {
    setTimeout(() => { if (!document.getElementById("waGo")?.closest("[hidden]")) conversie("whatsapp"); }, 50);
  });

  /* ---------- Toestemmingsbalk ---------- */
  if (bewaard) return;

  const balk = document.createElement("div");
  balk.className = "ck";
  balk.setAttribute("role", "dialog");
  balk.setAttribute("aria-label", "Cookievoorkeuren");
  balk.innerHTML =
    '<div class="ck-in">' +
      '<div class="ck-tekst">' +
        '<strong>Wij gebruiken cookies</strong>' +
        '<p>Noodzakelijke cookies laten de site werken. Met uw toestemming meten wij ook welke advertenties tot een aanvraag leiden.' +
        (PRIVACY_URL ? ' <a href="' + PRIVACY_URL + '">Lees ons privacybeleid</a>.' : '') +
        '</p>' +
      '</div>' +
      '<div class="ck-knoppen">' +
        '<button type="button" class="btn btn-lijn" data-ck="nodig">Alleen noodzakelijk</button>' +
        '<button type="button" class="btn btn-goud" data-ck="alles">Accepteren</button>' +
      '</div>' +
    '</div>';

  balk.addEventListener("click", e => {
    const keuze = e.target.closest("[data-ck]")?.dataset.ck;
    if (!keuze) return;
    try { localStorage.setItem(SLEUTEL, keuze); } catch {}
    if (keuze === "alles") verleen();
    balk.classList.remove("ck-op");
    setTimeout(() => balk.remove(), 400);
  });

  addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(balk);
    requestAnimationFrame(() => balk.classList.add("ck-op"));
  });
})();
