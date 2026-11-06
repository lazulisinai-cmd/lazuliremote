// Lazuli Remote — statische sitegenerator (v3: drie pagina's)
// Gebruik:  node build.mjs   → schrijft de HTML-pagina's, sitemap.xml en robots.txt naar ./public
// Alle teksten staan in dit bestand; pas ze hier aan en draai het script opnieuw.

import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "public");
// Versielabel per bestand (hash van de inhoud): na elke wijziging halen browsers de nieuwe versie op.
const v = (p) => p + "?v=" + createHash("md5").update(readFileSync(join(OUT, p))).digest("hex").slice(0, 8);

// ─── Instellingen ────────────────────────────────────────────────────────────
// Contactgegevens worden pas getoond als ze hier zijn ingevuld én geverifieerd.
const SITE = {
  url: "https://lazuliremote.com",
  name: "Lazuli Remote",
  email: "info@lazuliremote.com", // geverifieerd zakelijk e-mailadres
  phone: "", // geverifieerd telefoonnummer of WhatsApp
};

const BOOK = "/diensten-tarieven/#kennismaken"; // alle kennismakingsknoppen → één formulier
const CTA = "Plan een kennismaking";
const CTA_LONG = "Plan een vrijblijvend kennismakingsgesprek";

// ─── Drie diensten (overal dezelfde titels) ─────────────────────────────────
const SERVICES = [
  {
    id: "administratie-business-support",
    title: "Administratie & Business Support",
    short: "E-mail- en agendabeheer, administratie, CRM, klantenservice en commerciële opvolging.",
    intro: "Praktische ondersteuning bij administratie en dagelijkse bedrijfscommunicatie.",
    examples: ["E-mail- en agendabeheer", "Administratieve opvolging", "CRM en klantenservice", "Salesadministratie"],
    icon: "inbox",
  },
  {
    id: "executive-operational-support",
    title: "Executive & Operational Support",
    short: "Managementondersteuning, planning, projectcoördinatie en dagelijkse bedrijfsorganisatie.",
    intro: "Ervaren ondersteuning bij managementtaken, planning en bedrijfsorganisatie.",
    examples: ["Executive assistance", "Vergaderingen en planning", "Projectcoördinatie", "Operationele opvolging"],
    icon: "briefcase",
  },
  {
    id: "travel-hospitality-support",
    title: "Travel & Hospitality Support",
    short: "Zakelijke reisplanning, reserveringen, klantcommunicatie en hospitalityadministratie.",
    intro: "Organisatorische en administratieve ondersteuning voor zakelijke reizen en hospitality.",
    examples: ["Zakelijke reisplanning", "Reserveringsadministratie", "Hospitalitycommunicatie", "Praktische reiscoördinatie"],
    icon: "plane",
  },
];

// ─── Tarieven (excl. btw) ────────────────────────────────────────────────────
const PLANS = [
  { name: "Pakket A", hours: 16, amount: 784, items: ["Ongeveer 4 uur per week", "Betaling per maand vooraf", "Werkzaamheden in overleg", "Gratis kennismakingsgesprek"] },
  { name: "Pakket B", hours: 24, amount: 1128, items: ["Ongeveer 6 uur per week", "Betaling per maand vooraf", "Werkzaamheden in overleg", "Gratis kennismakingsgesprek"], highlight: true },
  { name: "Pakket C", hours: 32, amount: 1440, items: ["Ongeveer 8 uur per week", "Betaling per maand vooraf", "Werkzaamheden in overleg", "Gratis kennismakingsgesprek"] },
];
const HOURLY = { name: "Los uurtarief", amount: 50, items: ["Per uur berekend", "Betaling binnen 14 dagen achteraf", "Werkzaamheden in overleg"] };
const euro = (n) => n.toLocaleString("nl-NL");

// ─── Iconen ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (path) => SITE.url + path;
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const arrowLink = (href, text, extra = "") => `<a class="text-link" href="${href}"${extra}>${text}${icon("arrow")}</a>`;

const NAV = [
  ["Home", "/"],
  ["Diensten & tarieven", "/diensten-tarieven/"],
  ["Over mij", "/over-mij/"],
];

const ORG = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": SITE.url + "/#organisatie",
  name: SITE.name,
  slogan: "Jouw rechterhand. Waar je ook onderneemt.",
  url: SITE.url + "/",
  logo: SITE.url + "/favicon.svg",
  ...(SITE.email ? { email: SITE.email } : {}),
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
  description: "Virtual assistance en business support op afstand voor zelfstandigen en ondernemers in Nederland en België, door een Executive Assistant en Area Sales Manager met 15 jaar ervaring.",
  areaServed: [{ "@type": "Country", name: "Nederland" }, { "@type": "Country", name: "België" }],
  knowsLanguage: ["nl", "en"],
  priceRange: "€50 – €1.440",
};

const crumbs = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([n, p], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: abs(p) })),
});

const ctaBand = ({ id, title, text, secondary = "" }) => `
<section class="section" aria-labelledby="${id}"><div class="wrap">
  <div class="cta-band">
    <h2 id="${id}">${title}</h2>
    <p>${text}</p>
    <div class="btn-row"><a class="btn btn--gold" href="${BOOK}">${CTA_LONG}</a>${secondary}</div>
  </div>
</div></section>`;

// ─── Layout ──────────────────────────────────────────────────────────────────
function layout({ path, title, description, body, ld = [], noindex = false }) {
  const isActive = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  const nav = NAV.map(([n, href]) => `<li><a href="${href}"${isActive(href) ? ' aria-current="page"' : ""}>${n}</a></li>`).join("");
  const year = new Date().getFullYear();
  const logo = (cls = "") => `<a class="logo${cls}" href="/" aria-label="${SITE.name}, naar de homepage"><span class="logo-name">LAZULI REMOTE</span><span class="logo-sub">Virtual Assistance · Business Support</span></a>`;

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${abs(path)}">
<link rel="alternate" hreflang="nl-NL" href="${abs(path)}">
<link rel="alternate" hreflang="nl-BE" href="${abs(path)}">
<link rel="alternate" hreflang="x-default" href="${abs(path)}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="nl_NL">
<meta property="og:locale:alternate" content="nl_BE">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${abs("/assets/img/werkplek-schets.webp")}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#10205a">
<link rel="icon" href="${v("/favicon.svg")}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;1,500&display=swap">
<link rel="stylesheet" href="${v("/assets/css/style.css")}">
${[ORG, ...ld].map(jsonLd).join("\n")}
</head>
<body>
<a class="skip-link" href="#main">Naar de inhoud</a>
<header class="site-header">
  <div class="wrap header-inner">
    ${logo()}
    <div class="nav-wrap">
      <nav id="main-nav" class="main-nav" aria-label="Hoofdmenu">
        <ul>${nav}<li class="nav-cta"><a href="${BOOK}">${CTA}</a></li></ul>
      </nav>
      <a class="btn btn--primary header-cta" href="${BOOK}">${CTA}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Menu openen">${icon("menu")}</button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        ${logo()}
        <p class="footer-tagline">Jouw rechterhand. Waar je ook onderneemt.</p>
      </div>
      <nav aria-labelledby="f-nav"><h2 id="f-nav">Menu</h2><ul>
        ${NAV.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join("")}
        <li><a href="${BOOK}">${CTA}</a></li>
      </ul></nav>
      <div><h2>Contact</h2><ul>
        ${SITE.email ? `<li><a href="mailto:${SITE.email}">${SITE.email}</a></li>` : `<li><a href="${BOOK}">Via het kennismakingsformulier</a></li>`}
        ${SITE.phone ? `<li><a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a></li>` : ""}
        <li>Volledig op afstand, voor Nederland en België</li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year">${year}</span> ${SITE.name}</span>
      <a href="/privacy/">Privacyverklaring</a>
    </div>
  </div>
</footer>
<script src="${v("/assets/js/main.js")}" defer></script>
</body>
</html>
`;
}

// ─── Pagina's ────────────────────────────────────────────────────────────────
const pages = [];
const page = (p) => pages.push(p);

// HOME — vijf secties
page({
  path: "/",
  title: "Virtuele Assistent Nederland & België | Lazuli Remote",
  description: "15 jaar ervaring als Executive Assistant en Area Sales Manager. Persoonlijke administratieve en zakelijke ondersteuning op afstand voor ondernemers.",
  body: `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Virtual Assistance · Business Support</p>
      <h1 id="hero-title">Jouw rechterhand. Waar je ook onderneemt.</h1>
      <p class="lead">Meer overzicht, minder administratieve druk en professionele ondersteuning wanneer je die nodig hebt. Met 15 jaar ervaring als Executive Assistant en Area Sales Manager help ik zelfstandigen en ondernemers in Nederland en België om hun dagelijkse werkzaamheden efficiënter te organiseren.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${BOOK}">${CTA}</a>
        <a class="btn btn--ghost" href="/diensten-tarieven/">Bekijk mijn diensten</a>
      </div>
      <p class="trust-line">15 jaar ervaring<span aria-hidden="true">·</span>Persoonlijk contact<span aria-hidden="true">·</span>Volledig op afstand</p>
    </div>
    <figure class="sketch hero-art">
      <img src="${v("/assets/img/werkplek-schets.webp")}" width="430" height="298" alt="Potloodschets van een overzichtelijke werkplek met laptop, takenlijst, agenda, notitieboek en een kop koffie." fetchpriority="high">
    </figure>
  </div>
</section>

<section class="section" aria-labelledby="diensten-title">
  <div class="wrap">
    <div class="section-head section-head--center">
      <h2 id="diensten-title">Waarmee kan ik je ondersteunen?</h2>
      <p class="lead">Remote business support voor zelfstandigen en ondernemers, van administratieve ondersteuning op afstand tot een ervaren executive assistant.</p>
    </div>
    <div class="services">
      ${SERVICES.map((s) => `<article class="service">
        <div class="service-icon">${icon(s.icon)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.short)}</p>
        ${arrowLink(`/diensten-tarieven/#${s.id}`, `Meer informatie<span class="sr-only"> over ${esc(s.title)}</span>`)}
      </article>`).join("\n      ")}
    </div>
    <p class="center-cta"><a class="btn btn--primary" href="/diensten-tarieven/">Ontdek mijn diensten &amp; tarieven</a></p>
  </div>
</section>

<section class="section section--sand" aria-labelledby="ervaring-title">
  <div class="wrap">
    <div class="experience">
      <h2 id="ervaring-title">15 jaar ervaring. Eén vertrouwd aanspreekpunt.</h2>
      <div class="copy">
        <p>Als Executive Assistant en Area Sales Manager heb ik ervaring opgebouwd in organisatie, zakelijke communicatie, planning en commerciële opvolging.</p>
        <p>Met Lazuli Remote zet ik deze expertise in om ondernemers persoonlijk te ondersteunen. Je werkt rechtstreeks met mij, zonder tussenpersonen of wisselende contactpersonen.</p>
        ${arrowLink("/over-mij/", "Meer over mij")}
      </div>
    </div>
    <ul class="benefits">
      <li><strong>Ervaren</strong><span>15 jaar professionele achtergrond.</span></li>
      <li><strong>Persoonlijk</strong><span>Rechtstreeks contact en duidelijke afspraken.</span></li>
      <li><strong>Flexibel</strong><span>Ondersteuning op afstand, afgestemd op jouw onderneming.</span></li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="samenwerken-title">
  <div class="wrap">
    <div class="section-head section-head--center"><h2 id="samenwerken-title">Samenwerken is eenvoudig.</h2></div>
    <ol class="steps">
      <li><span class="step-num" aria-hidden="true">01</span><h3>Kennismaken</h3><p>We bespreken jouw onderneming en ondersteuningsbehoeften.</p></li>
      <li><span class="step-num" aria-hidden="true">02</span><h3>Afstemmen</h3><p>Je ontvangt een voorstel met passende werkzaamheden en uren.</p></li>
      <li><span class="step-num" aria-hidden="true">03</span><h3>Samenwerken</h3><p>Ik ondersteun je op afstand, met duidelijke communicatie en opvolging.</p></li>
    </ol>
  </div>
</section>
${ctaBand({
  id: "cta-title",
  title: "Klaar voor meer rust en overzicht?",
  text: "Ontdek wat ervaren ondersteuning voor jouw onderneming kan betekenen.",
  secondary: arrowLink("/diensten-tarieven/#tarieven", "Bekijk eerst mijn tarieven"),
})}`,
});

// DIENSTEN & TARIEVEN — vier secties
page({
  path: "/diensten-tarieven/",
  title: "Diensten & Tarieven | Lazuli Remote",
  description: "Ontdek de diensten en tarieven van Lazuli Remote. Administratieve, executive en operationele ondersteuning vanaf €50 per uur.",
  ld: [
    crumbs([["Home", "/"], ["Diensten & tarieven", "/diensten-tarieven/"]]),
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Diensten en tarieven Lazuli Remote",
      itemListElement: [
        ...SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.short, provider: { "@id": SITE.url + "/#organisatie" } } })),
        ...PLANS.map((p) => ({ "@type": "Offer", name: `${p.name}, ${p.hours} uur per maand`, price: p.amount, priceCurrency: "EUR", valueAddedTaxIncluded: false })),
        { "@type": "Offer", name: HOURLY.name, price: HOURLY.amount, priceCurrency: "EUR", valueAddedTaxIncluded: false },
      ],
    },
  ],
  body: `
<section class="page-intro"><div class="wrap">
  <p class="eyebrow">Diensten &amp; tarieven</p>
  <h1>Professionele ondersteuning op maat.</h1>
  <p class="lead">Van dagelijkse administratie tot managementondersteuning en hospitality: ik help ondernemers hun werkzaamheden overzichtelijk en efficiënt te organiseren.</p>
</div></section>

<section class="section" aria-label="Diensten"><div class="wrap">
  <div class="service-details">
    ${SERVICES.map((s, i) => `<article class="service-detail" id="${s.id}">
      <span class="num">0${i + 1}</span>
      <h2>${esc(s.title)}</h2>
      <p>${esc(s.intro)}</p>
      <ul class="dash-list">${s.examples.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
    </article>`).join("\n    ")}
  </div>
</div></section>

<section class="section section--sand" id="tarieven" aria-labelledby="tarieven-title"><div class="wrap">
  <div class="section-head section-head--center">
    <h2 id="tarieven-title">Duidelijke tarieven. Flexibele ondersteuning.</h2>
    <p class="lead">Kies de hoeveelheid ondersteuning die bij jouw onderneming past.</p>
  </div>
  <div class="plans">
    ${PLANS.map((p) => `<article class="plan${p.highlight ? " plan--highlight" : ""}">
      <div class="plan-head"><h3>${p.name}</h3><p class="plan-tag">${p.hours} uur per maand</p></div>
      <div class="plan-body">
        <p class="plan-amount"><span class="cur">€</span>${euro(p.amount)}</p>
        <p class="plan-unit">per maand excl. btw</p>
        <ul class="dash-list">${p.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <a class="btn ${p.highlight ? "btn--primary" : "btn--ghost"}" href="#kennismaken">Neem contact op<span class="sr-only"> over ${p.name}</span></a>
      </div>
    </article>`).join("\n    ")}
  </div>
  <article class="plan plan--hourly">
    <div class="plan-head"><h3>${HOURLY.name}</h3><p class="plan-tag">Ondersteuning wanneer nodig</p></div>
    <div class="hourly-price"><p class="plan-amount"><span class="cur">€</span>${HOURLY.amount}</p><p class="plan-unit">per uur excl. btw</p></div>
    <ul class="dash-list">${HOURLY.items.map((i) => `<li>${i}</li>`).join("")}</ul>
    <a class="btn btn--ghost" href="#kennismaken">Neem contact op<span class="sr-only"> over het losse uurtarief</span></a>
  </article>
  <ul class="price-notes">
    <li>Alle bedragen zijn exclusief btw</li>
    <li>Pakketten betaal je per maand vooraf</li>
    <li>Losse uren factureer ik achteraf, te betalen binnen 14 dagen</li>
    <li>Werkzaamheden stemmen we altijd samen af</li>
  </ul>
</div></section>

<section class="section" id="kennismaken" aria-labelledby="kennismaken-title"><div class="wrap contact-grid">
  <div>
    <h2 id="kennismaken-title">Welke ondersteuning past bij jou?</h2>
    <p class="lead">Tijdens een vrijblijvend gesprek bekijken we welke werkzaamheden je graag zou uitbesteden en welke samenwerking het beste bij je past.</p>
    <div class="meeting">${icon("calendar")}<div><strong>Vrijblijvend kennismakingsgesprek — 20 minuten</strong><span>Laat je gegevens achter, dan plannen we samen een moment dat jou past.</span></div></div>
  </div>
  <div class="panel">
    <h3>${CTA}</h3>
    <div id="form-status" class="form-status" role="status" aria-live="polite" hidden></div>
    <form id="contact-form" action="/contact.php" method="post">
      <div class="form-grid">
        <div class="field">
          <label for="naam">Naam</label>
          <input id="naam" name="naam" type="text" autocomplete="name" required data-required="Vul je naam in." aria-describedby="naam-error">
          <p class="error" id="naam-error"></p>
        </div>
        <div class="field">
          <label for="email">E-mailadres</label>
          <input id="email" name="email" type="email" autocomplete="email" required data-required="Vul je e-mailadres in." aria-describedby="email-error">
          <p class="error" id="email-error"></p>
        </div>
        <div class="field full">
          <label for="bedrijf">Bedrijf <span class="hint">(optioneel)</span></label>
          <input id="bedrijf" name="bedrijf" type="text" autocomplete="organization">
        </div>
        <div class="field full">
          <label for="bericht">Waarmee kan ik je helpen?</label>
          <textarea id="bericht" name="bericht" required data-required="Vertel kort waarmee ik je kan helpen." aria-describedby="bericht-error"></textarea>
          <p class="error" id="bericht-error"></p>
        </div>
        <div class="hp" aria-hidden="true"><label for="website">Laat dit veld leeg</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="field full">
          <div class="check-field">
            <input id="privacy" name="privacy" type="checkbox" value="ja" required data-required="Geef toestemming om je gegevens te gebruiken." aria-describedby="privacy-error">
            <label for="privacy">Ik ga ermee akkoord dat mijn gegevens worden gebruikt om contact met mij op te nemen, zoals beschreven in de <a href="/privacy/">privacyverklaring</a>.</label>
          </div>
          <p class="error" id="privacy-error"></p>
        </div>
        <div class="full"><button class="btn btn--primary" type="submit">Vraag een kennismaking aan</button></div>
      </div>
    </form>
  </div>
</div></section>`,
});

// OVER MIJ — drie secties, zonder portret
page({
  path: "/over-mij/",
  title: "Over Mij | 15 Jaar Ervaring | Lazuli Remote",
  description: "Ontdek de ervaring en persoonlijke aanpak achter Lazuli Remote. 15 jaar ervaring als Executive Assistant en Area Sales Manager.",
  ld: [crumbs([["Home", "/"], ["Over mij", "/over-mij/"]])],
  body: `
<section class="page-intro" aria-labelledby="over-title"><div class="wrap about-intro">
  <div class="copy">
    <p class="eyebrow">Over mij</p>
    <h1 id="over-title">Ervaring waarop je kunt bouwen.</h1>
    <p class="subtitle">15 jaar ervaring als Executive Assistant &amp; Area Sales Manager.</p>
    <p>Met 15 jaar ervaring als Executive Assistant en Area Sales Manager weet ik hoe belangrijk goede organisatie, duidelijke communicatie en betrouwbare ondersteuning zijn.</p>
    <p>In mijn professionele loopbaan heb ik ervaring opgebouwd met administratie, planning, managementondersteuning en commerciële opvolging.</p>
    <p>Met Lazuli Remote zet ik die ervaring vandaag in voor ondernemers die behoefte hebben aan een ervaren rechterhand op afstand.</p>
  </div>
  <div class="about-intro-wrap">
    <div class="exp-card" aria-hidden="true">
      <span class="big">15</span>
      <span class="big-sub">jaar ervaring</span>
      <ul><li>Executive Assistant</li><li>Area Sales Manager</li></ul>
      <span class="hand">Jouw rechterhand, waar je ook onderneemt.</span>
    </div>
  </div>
</div></section>

<section class="section" aria-labelledby="aanpak-title"><div class="wrap approach">
  <div class="copy">
    <h2 id="aanpak-title">Persoonlijk, professioneel en betrokken.</h2>
    <p>Ik geloof in duidelijke afspraken, open communicatie en een persoonlijke samenwerking.</p>
    <p>Je werkt rechtstreeks met mij. Ik leer jouw onderneming en werkwijze kennen, zodat mijn ondersteuning zo goed mogelijk aansluit bij wat jij nodig hebt.</p>
    <p>Vanuit Egypte werk ik volledig op afstand voor zelfstandigen en ondernemers in Nederland en België. Dankzij digitale samenwerking hoeft afstand geen belemmering te zijn voor een professionele, persoonlijke werkrelatie.</p>
  </div>
  <div>
    <ul class="values">
      <li><strong>Betrouwbaarheid</strong><span>Zorgvuldige opvolging en duidelijke afspraken.</span></li>
      <li><strong>Zelfstandigheid</strong><span>Meedenken, organiseren en praktisch ondersteunen.</span></li>
      <li><strong>Persoonlijk contact</strong><span>Rechtstreeks samenwerken met één vast aanspreekpunt.</span></li>
    </ul>
    <figure class="nile">
      <img src="${v("/assets/img/nijl-schets.webp")}" width="436" height="143" alt="Potloodschets van de piramides aan de Nijl met palmbomen en een zeilboot." loading="lazy">
      <figcaption>Werkplek op afstand, vanuit Egypte</figcaption>
    </figure>
  </div>
</div></section>
${ctaBand({
  id: "kennismaken-title",
  title: "Laten we kennismaken.",
  text: "Ben je op zoek naar ervaren ondersteuning voor jouw onderneming? Ik bespreek graag wat ik voor je kan betekenen.",
})}`,
});

// PRIVACY (juridische hulppagina in de footer)
page({
  path: "/privacy/",
  title: "Privacyverklaring | Lazuli Remote",
  description: "Privacyverklaring van Lazuli Remote: hoe persoonsgegevens worden verwerkt en beschermd.",
  body: `
<section class="page-intro"><div class="wrap">
  <h1>Privacyverklaring</h1>
  <p class="lead">Lazuli Remote gaat zorgvuldig om met persoonsgegevens, in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR).</p>
</div></section>
<section class="section"><div class="wrap prose">
  <!-- TODO: laat deze privacyverklaring controleren en vul de bedrijfsgegevens aan. -->
  <h2>Welke gegevens verwerk ik?</h2>
  <p>Via het kennismakingsformulier verwerk ik je naam, e-mailadres, eventueel je bedrijfsnaam en de inhoud van je bericht. Deze gegevens verstrek je zelf.</p>
  <h2>Waarvoor gebruik ik deze gegevens?</h2>
  <p>Uitsluitend om contact met je op te nemen naar aanleiding van je aanvraag en, als we gaan samenwerken, voor de uitvoering van de overeenkomst.</p>
  <h2>Hoe lang bewaar ik gegevens?</h2>
  <p>Niet langer dan noodzakelijk. Gegevens van aanvragen die niet tot een samenwerking leiden, verwijder ik uiterlijk twaalf maanden na het laatste contact.</p>
  <h2>Delen met derden</h2>
  <p>Ik verkoop je gegevens nooit en deel ze alleen met derden wanneer dat nodig is voor de uitvoering van mijn diensten of wettelijk verplicht is.</p>
  <h2>Cookies</h2>
  <p>Deze website plaatst geen tracking- of marketingcookies.</p>
  <h2>Je rechten</h2>
  <p>Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen. ${SITE.email ? `Neem hiervoor contact op via <a href="mailto:${SITE.email}">${SITE.email}</a>.` : `Neem hiervoor contact op via het <a href="${BOOK}">kennismakingsformulier</a>.`}</p>
</div></section>`,
});

// 404
page({
  path: "/404.html",
  file: "404.html",
  title: "Pagina niet gevonden | Lazuli Remote",
  description: "Deze pagina bestaat niet (meer).",
  noindex: true,
  body: `
<section class="page-intro"><div class="wrap">
  <p class="eyebrow">404</p>
  <h1>Deze pagina bestaat niet (meer)</h1>
  <p class="lead">Mogelijk is de pagina verplaatst. Ga terug naar de homepage of bekijk mijn diensten en tarieven.</p>
  <div class="btn-row" style="margin-top:24px"><a class="btn btn--primary" href="/">Naar de homepage</a><a class="btn btn--ghost" href="/diensten-tarieven/">Diensten &amp; tarieven</a></div>
</div></section>`,
});

// ─── Schrijven ───────────────────────────────────────────────────────────────
// Oude pagina's verwijderen (ze worden via .htaccess doorgestuurd)
for (const r of ["diensten", "tarieven", "werkwijze", "contact"]) {
  const p = join(OUT, r);
  if (existsSync(p)) rmSync(p, { recursive: true });
}

for (const p of pages) {
  const rel = p.file || (p.path === "/" ? "index.html" : p.path.replace(/^\//, "") + "index.html");
  const out = join(OUT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, layout(p));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);

console.log(`✓ ${pages.length} pagina's gegenereerd in ./public`);
