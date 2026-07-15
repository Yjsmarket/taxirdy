PLACEHOLDER-MAP: img/

Nog aan te leveren door de klant:
- spotlight.jpg   -> foto voor de donkere sectie "Voor wie je liefhebt"
                     (nu een tijdelijke Unsplash-foto van Amsterdam, zie css/styles.css bij .spotlight)
- sedan.jpg       -> foto Sedan (vervangt [FOTO VOERTUIG · SEDAN] in de tarieven-sectie)
- bus.jpg         -> foto Bus / groepsvervoer
- premium.jpg     -> foto Premium voertuig
- logo.svg/png    -> eigen logo (nu een tekst-wordmark "APT / Amsterdam Pro Taxi" in de header)

Vloot-pagina + tarieven-secties - KLAAR (gegenereerd met Higgsfield, mag je vervangen door echte foto's):
- fleet-sedan.jpg    -> Mercedes E-Klasse sedan (diepgroene studio-achtergrond)
- fleet-bus.jpg      -> Mercedes V-Klasse taxibus
- fleet-premium.jpg  -> Mercedes S-Klasse premium

Tours-pagina (tours.html) - zodra deze bestanden bestaan verschijnen ze automatisch:
- tour-zaanse-schans.jpg   -> foto molens Zaanse Schans
- tour-giethoorn.jpg       -> foto kanalen Giethoorn
- tour-kinderdijk.jpg      -> foto molens Kinderdijk
- tour-denhaag-delft.jpg   -> foto Den Haag of Delft
- grachten.jpg             -> eigen grachtenfoto voor de hero (nu tijdelijk Unsplash, zie .hero-tours in css/styles.css)
- tour-grachten.jpg        -> foto grachten voor de Amsterdam Highlights kaart (nu tijdelijk Unsplash)
- tour-keukenhof.jpg       -> foto Keukenhof (nu tijdelijk Unsplash)

Zodra de foto's er zijn: vervang in index.html de <div class="fleet-visual">
blokken door <img src="img/sedan.jpg" alt="..."> en pas in css/styles.css
de achtergrond-URL van .spotlight aan naar img/spotlight.jpg.
