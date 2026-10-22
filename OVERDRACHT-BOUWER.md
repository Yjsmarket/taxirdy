# Overdracht aan de bouwer: homepage Fixed Ride

**Goedgekeurd design:** `designs/fixed-ride-premium.html`
**Preview:** https://claude.ai/artifact/EeUxnCLMkvcrfn6u1JhiTf (privé, eigenaar moet hem delen)
**Indeling oude site:** `INDELING.md`

## Wat er staat
- Premium homepage: privé chauffeur, gespecialiseerd in vooraf reserveren (geen "ordinaire taxi").
- Openingssectie: belofte + foto **Mercedes E-Klasse** + live ritkaart (animatie), concierge-balk met Enkele rit / Met tussenstops / Per uur.
- Reserveerformulier staat **niet** in de opening maar in een paneel dat opent bij elke "Reserveren"-knop (desktop van rechts, mobiel van onderen).
  - Modi: Enkele rit (met retour), Met stops (max 4 tussenstops), Per uur (3 tot 12 uur of Dag).
  - "Wat mogen wij voor u regelen?": Stadsrit, Intercity rit, Luchthaven, Zakelijk, Evenement.
  - Voertuig: Business (E-Klasse), Elektrisch (Tesla), Van (V-Klasse), First class (S-Klasse).
  - Versturen = WhatsApp-bericht naar +31 20 210 1637 met alle gegevens.
- Bel- en WhatsApp-knoppen in header, opening, CTA en vaste balk op mobiel.
- Overige secties: vertrouwensrij, diensten (bento), werkwijze-tijdlijn, vloot + vaste prijzen (prijzen van de oude site), reviews + FAQ, CTA, footer.
- Fonts: Inter Tight, Instrument Serif, JetBrains Mono. Kleuren: donkergroen-zwart, champagne goud, crème.

## To do voor de bouwer
1. **Reviews plaatsen** in de reviewkaart (`#vragen`, nu placeholder): gebruik **alleen echte Google-reviews** van Fixed Ride, met naam zoals op Google en de echte score + aantal reviews. Niets verzinnen. Eventueel meerdere reviews als slider.
2. Afbeeldingspaden: het design gebruikt `../img/...` (vanuit `designs/`). Bij overzetten naar de root wordt dat `img/...`.
3. **Service-afspraken laten bevestigen door de klant** voordat het live gaat (staan nu als tekst in de pagina):
   bevestiging binnen het uur · chauffeur 24 uur vooraf bekend · chauffeur 10 min eerder · wachttijd bij vertraging inbegrepen · naambord · betaling vooraf · zakelijk maandfactuur · per uur minimaal 3 uur, dag tot 10 uur · water/laders/wifi · 24/7 · minimaal 24 uur vooraf reserveren · geen toeslag files · capaciteit per auto.
4. Logo: het huidige `img/logo.png` (taxi met blokjes) past niet bij premium; nu staat er een tekstlogo "F · Fixed Ride".
5. Daarna de andere pagina's (airport, diensten, vloot, tours, over ons) in deze stijl, volgens `INDELING.md`.
