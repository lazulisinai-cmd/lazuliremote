// Lazuli Remote — statische sitegenerator
// Gebruik:  node build.mjs   → schrijft alle HTML-pagina's, sitemap.xml en robots.txt naar ./public
// Alle teksten staan in dit bestand; pas ze hier aan en draai het script opnieuw.

import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "public");

// ─── Instellingen ────────────────────────────────────────────────────────────
// TODO: vervang door het definitieve domein en contactgegevens.
const SITE = {
  url: "https://www.lazuliremote.com",
  name: "Lazuli Remote",
  email: "info@lazuliremote.com",
  phone: "", // bv. "+31 6 12 34 56 78" — leeg = niet tonen
  kvk: "",   // KvK- of ondernemingsnummer — leeg = niet tonen
  locale: "nl_NL",
};

// ─── Diensten (exact vijf) ───────────────────────────────────────────────────
const SERVICES = [
  {
    slug: "administratie-emailbeheer",
    title: "Administratie & e-mailbeheer",
    intro: "Meer overzicht in je administratie en inbox, zonder dat je er zelf dagelijks tijd aan hoeft te besteden.",
    items: [
      "E-mailbeheer en inboxorganisatie.",
      "Digitale administratie.",
      "Documenten opstellen en organiseren.",
      "Gegevensverwerking.",
      "Administratieve opvolging.",
      "Bestands- en documentbeheer.",
    ],
    icon: "inbox",
    seoTitle: "Administratieve ondersteuning op afstand & e-mailbeheer uitbesteden",
    metaDesc: "E-mailbeheer uitbesteden en administratieve ondersteuning op afstand voor zzp'ers, ondernemers en kmo's in Nederland en België. Overzicht in je inbox en administratie.",
    h1: "Administratie & e-mailbeheer uitbesteden",
    lead: "Administratieve ondersteuning op afstand voor zelfstandigen, ondernemers en kmo's. Ik houd je inbox, documenten en digitale administratie op orde — zodat jij daar geen dagelijkse aandacht meer aan hoeft te geven.",
    body: [
      ["Waarom e-mailbeheer uitbesteden?", "Een volle inbox en achterstallige administratie kosten meer tijd dan je denkt. Elke dag even sorteren, beantwoorden, opzoeken en archiveren loopt snel op tot uren per week. Door e-mailbeheer en administratie uit te besteden aan een virtuele assistent krijg je die tijd terug — en de rust dat alles op de juiste plek ligt."],
      ["Administratieve hulp voor zzp'ers en kmo's", "Of je nu als zzp'er alles zelf doet of met een klein team werkt: ik pas me aan jouw systemen en werkwijze aan. Ik werk met de tools die je al gebruikt, zoals Microsoft 365, Google Workspace en gangbare cloudopslag, en spreek duidelijke afspraken met je af over wat ik zelfstandig afhandel en wat ik aan jou voorleg."],
    ],
    forWho: ["Zelfstandigen en zzp'ers met een overvolle inbox", "Ondernemers die administratie steeds voor zich uit schuiven", "Kmo's zonder eigen administratieve kracht", "Professionals die meer structuur willen in hun documenten"],
    faq: [
      ["Hoe werkt e-mailbeheer op afstand?", "Je geeft mij gedelegeerde toegang tot je mailbox. Samen spreken we af welke mails ik sorteer, beantwoord, doorstuur of voor je klaarzet. Je houdt altijd zelf het overzicht en de eindverantwoordelijkheid."],
      ["Doe je ook boekhouding?", "Nee, ik ben geen boekhouder. Ik ondersteun wel bij de administratieve kant: documenten verzamelen en ordenen, gegevens verwerken en zorgen dat je boekhouder alles op tijd en compleet ontvangt."],
      ["Hoe ga je om met vertrouwelijke informatie?", "Vertrouwelijk. Ik werk volgens de AVG/GDPR, sluit op verzoek een verwerkersovereenkomst en geheimhoudingsverklaring af en werk alleen met beveiligde toegang."],
    ],
  },
  {
    slug: "executive-assistant",
    title: "Executive Assistant & managementondersteuning",
    intro: "Een professionele rechterhand die je helpt om overzicht te bewaren en jouw werkdag efficiënter te organiseren.",
    items: [
      "Agendabeheer.",
      "Vergaderingen voorbereiden.",
      "Zakelijke correspondentie.",
      "Actielijsten en deadlines opvolgen.",
      "Managementondersteuning.",
      "Prioriteiten en werkprocessen organiseren.",
    ],
    icon: "briefcase",
    seoTitle: "Executive assistant op afstand | Persoonlijke managementondersteuning",
    metaDesc: "Een executive assistant op afstand: persoonlijke managementondersteuning bij agendabeheer, vergaderingen, correspondentie en deadlines. Voor ondernemers in Nederland en België.",
    h1: "Executive assistant op afstand",
    lead: "Persoonlijke managementondersteuning voor ondernemers en leidinggevenden. Een vaste rechterhand die je agenda bewaakt, vergaderingen voorbereidt en ervoor zorgt dat afspraken en deadlines niet tussen wal en schip vallen.",
    body: [
      ["Een rechterhand, zonder vaste medewerker", "Een executive assistant in loondienst is voor veel ondernemers een te grote stap. Met een executive assistant op afstand krijg je dezelfde professionele ondersteuning, flexibel en afgestemd op wat je werkelijk nodig hebt. Je betaalt alleen voor de ondersteuning die je afneemt."],
      ["Meer focus op wat écht belangrijk is", "Ik neem de organisatie rondom je werk over: van het plannen van afspraken en het voorbereiden van overleggen tot het opvolgen van actiepunten. Zo houd jij je hoofd vrij voor beslissingen, klanten en de groei van je onderneming."],
    ],
    forWho: ["Ondernemers met een volle agenda", "Directeuren en managers van kleine bedrijven", "Consultants en zelfstandige professionals", "Ondernemers die werken over meerdere projecten of vestigingen"],
    faq: [
      ["Wat is het verschil tussen een virtuele assistent en een executive assistant?", "Een virtuele assistent ondersteunt vaak bij losse taken. Als executive assistant werk ik nauwer met je samen: ik ken je prioriteiten, bewaak je agenda en denk proactief mee over je werkprocessen."],
      ["Kan ik je ook dagelijks inzetten?", "Ja. Met het pakket Executive spreken we vaste beschikbaarheid af, zodat je dagelijks op mij kunt rekenen."],
      ["Schrijf je ook namens mij?", "Ja, ik verzorg zakelijke correspondentie in jouw naam en toon, altijd binnen de afspraken die we samen maken."],
    ],
  },
  {
    slug: "planning-coordinatie",
    title: "Planning & operationele coördinatie",
    intro: "Van dagelijkse planning tot praktische coördinatie: zorg dat alles achter de schermen vlot blijft verlopen.",
    items: [
      "Afspraken en agenda's coördineren.",
      "Operationele planning.",
      "Projectadministratie.",
      "Leverancierscommunicatie.",
      "Taken en deadlines opvolgen.",
      "Organisatorische ondersteuning.",
    ],
    icon: "calendar",
    seoTitle: "Planning en operationele ondersteuning op afstand",
    metaDesc: "Planning en operationele ondersteuning op afstand: agenda's coördineren, projectadministratie, leverancierscommunicatie en deadlines opvolgen. Voor ondernemers in NL en BE.",
    h1: "Planning en operationele ondersteuning",
    lead: "Praktische coördinatie achter de schermen. Ik zorg dat planningen kloppen, leveranciers op de hoogte zijn en taken op tijd worden opgevolgd — zodat jouw onderneming soepel blijft draaien.",
    body: [
      ["Overzicht in planning en uitvoering", "Naarmate je onderneming groeit, groeit ook het aantal afspraken, projecten en partijen waarmee je schakelt. Ik breng structuur aan in je operationele planning, coördineer agenda's van meerdere betrokkenen en houd bij wat wanneer moet gebeuren."],
      ["Remote business support die meedenkt", "Operationele coördinatie is meer dan afspraken inplannen. Ik signaleer knelpunten, stem af met leveranciers en partners en houd de projectadministratie bij, zodat je altijd weet waar je staat."],
    ],
    forWho: ["Ondernemers met meerdere lopende projecten", "Kleine teams zonder vaste office manager", "Bedrijven die met veel externe leveranciers werken", "Zelfstandigen die structuur willen in hun planning"],
    faq: [
      ["Met welke planningstools werk je?", "Ik werk met de tools die jij al gebruikt, zoals Outlook, Google Agenda, Trello, Asana, Monday of Notion. Heb je nog geen systeem, dan help ik je bij het opzetten van een eenvoudige structuur."],
      ["Neem je ook contact op met leveranciers?", "Ja. Ik verzorg de praktische communicatie met leveranciers, zoals planningen afstemmen, bevestigingen opvragen en levermomenten opvolgen."],
      ["Kan ik je per project inzetten?", "Zeker. Met het pakket Flexibel kun je mij per opdracht of project inschakelen."],
    ],
  },
  {
    slug: "reisorganisatie-reserveringen",
    title: "Reisorganisatie & reserveringen",
    intro: "Professionele ondersteuning bij het organiseren van zakelijke reizen, verblijven en reserveringen.",
    items: [
      "Zakelijke reisplanning.",
      "Hotelreserveringen.",
      "Transportcoördinatie.",
      "Reisschema's opstellen.",
      "Reisdocumenten organiseren.",
      "Boekingen en wijzigingen opvolgen.",
    ],
    icon: "plane",
    seoTitle: "Zakelijke reisplanning uitbesteden | Reisorganisatie & reserveringen",
    metaDesc: "Zakelijke reisplanning uitbesteden: hotelreserveringen, transport, reisschema's en reisdocumenten geregeld door een virtuele assistent. Voor ondernemers in Nederland en België.",
    h1: "Zakelijke reisplanning uitbesteden",
    lead: "Van hotel en transport tot een overzichtelijk reisschema: ik organiseer je zakelijke reizen tot in de puntjes, zodat jij onderweg alleen nog hoeft te focussen op je afspraken.",
    body: [
      ["Zakelijk reizen zonder gedoe", "Een zakelijke reis plannen kost tijd: opties vergelijken, boeken, bevestigingen verzamelen en alles op elkaar afstemmen. Ik neem dat volledig uit handen en houd rekening met jouw voorkeuren, budget en agenda."],
      ["Ook als plannen veranderen", "Wordt een afspraak verplaatst of loopt een vlucht vertraging? Ik volg boekingen en wijzigingen op en pas je reisschema aan, zodat je altijd de actuele informatie bij de hand hebt."],
    ],
    forWho: ["Ondernemers die regelmatig zakelijk reizen", "Teams die beurzen, congressen of klantbezoeken bijwonen", "Consultants met afspraken op wisselende locaties", "Bedrijven zonder eigen travel desk"],
    faq: [
      ["Boek je ook voor meerdere reizigers?", "Ja, ik organiseer zowel individuele reizen als reizen voor kleine teams."],
      ["Wie betaalt de boekingen?", "Boekingen worden betaald met jouw zakelijke betaalmiddelen of op rekening van je onderneming. Daarover maken we vooraf duidelijke afspraken."],
      ["Help je ook bij reisdocumenten?", "Ik zorg dat je weet welke documenten nodig zijn, help bij het organiseren ervan en zet alles overzichtelijk klaar in je reisschema."],
    ],
  },
  {
    slug: "hospitality-support",
    title: "Hospitality & reserveringsbeheer",
    intro: "Gespecialiseerde administratieve en organisatorische ondersteuning voor ondernemers in de reis- en hospitalitysector.",
    items: [
      "Reserveringsadministratie.",
      "Gastcommunicatie.",
      "Boekingsopvolging.",
      "Leverancierscoördinatie.",
      "Operationele planning.",
      "Administratieve ondersteuning voor accommodaties en reisorganisaties.",
    ],
    icon: "key",
    seoTitle: "Reserveringsbeheer op afstand | Hospitality administratieve ondersteuning",
    metaDesc: "Reserveringsbeheer op afstand en administratieve ondersteuning voor accommodaties, B&B's, vakantieverhuur en reisorganisaties in Nederland en België.",
    h1: "Reserveringsbeheer op afstand voor hospitality",
    lead: "Gespecialiseerde administratieve ondersteuning voor accommodaties, vakantieverhuur, B&B's en reisorganisaties. Ik beheer je reserveringen en gastcommunicatie, zodat jij je kunt richten op de gastbeleving.",
    body: [
      ["Hospitality administratieve ondersteuning", "In de reis- en hospitalitysector komt veel administratie kijken: boekingen verwerken, vragen van gasten beantwoorden, wijzigingen doorvoeren en leveranciers aansturen. Ik ken de dynamiek van de sector en neem die taken professioneel en gastvriendelijk van je over."],
      ["Reserveringen op orde, gasten goed geïnformeerd", "Ik houd je reserveringsadministratie bij, volg boekingen op en zorg dat gasten tijdig de juiste informatie ontvangen. Ook coördineer ik met schoonmaak, onderhoud en andere leveranciers, zodat elke aankomst goed is voorbereid."],
    ],
    forWho: ["Eigenaren van B&B's, gastenverblijven en boutique hotels", "Beheerders van vakantieverhuur", "Kleine reisorganisaties en touroperators", "Ondernemers met accommodaties in Nederland en België"],
    faq: [
      ["Werk je met boekingsplatformen en channel managers?", "Ja, ik werk met de systemen die je al gebruikt. Denk aan gangbare boekingsplatformen, property management systemen en channel managers."],
      ["Beantwoord je gastvragen ook in andere talen?", "Ik verzorg gastcommunicatie in het Nederlands en Engels. Andere talen in overleg."],
      ["Kan ik je seizoensgebonden inzetten?", "Zeker. Veel hospitality-ondernemers zetten mij extra in tijdens het hoogseizoen. Dat kan flexibel of met een vast maandpakket."],
    ],
  },
];

// Contactformulier: exact deze zes keuzes
const FORM_OPTIONS = [
  ...SERVICES.map((s) => ({ label: s.title, slug: s.slug })),
  { label: "Andere ondersteuning", slug: "andere" },
];

const PLANS = [
  {
    name: "Flexibel",
    tag: "Ondersteuning wanneer nodig",
    desc: "Voor incidentele administratieve en organisatorische opdrachten.",
    items: ["Inzetbaar per opdracht of project", "Administratie, planning of reisorganisatie op afroep", "Geen vaste maandelijkse verplichting", "Heldere afspraken vooraf per opdracht"],
    price: "Tarief per uur",
    priceNote: "Je betaalt alleen voor de uren die je afneemt.",
  },
  {
    name: "Structureel",
    tag: "Vaste ondersteuning per maand",
    desc: "Voor terugkerende administratie, inboxbeheer, planning en operationele coördinatie.",
    items: ["Vast aantal uren per maand", "Doorlopend inbox- en administratiebeheer", "Planning en operationele coördinatie", "Vaste contactmomenten en maandelijkse terugkoppeling"],
    price: "Vast maandbedrag",
    priceNote: "Afgestemd op het aantal uren dat je nodig hebt.",
    featured: true,
  },
  {
    name: "Executive",
    tag: "Persoonlijke managementondersteuning",
    desc: "Voor ondernemers die bredere executive assistance, complexe planning en organisatorische ondersteuning nodig hebben.",
    items: ["Persoonlijke executive assistant op afstand", "Agendabeheer en vergadervoorbereiding", "Complexe planning en reisorganisatie", "Ruime, vaste beschikbaarheid"],
    price: "Op maat",
    priceNote: "Samengesteld na een kennismakingsgesprek.",
  },
];

const STEPS = [
  ["Kennismaking", "In een vrijblijvend gesprek bespreken we jouw onderneming, je uitdagingen en waar je ondersteuning bij zoekt."],
  ["Voorstel op maat", "Je ontvangt een helder voorstel met de taken, het gekozen pakket en de afspraken over beschikbaarheid."],
  ["Soepele start", "We regelen toegang tot je systemen, leggen werkafspraken vast en ik ga direct voor je aan de slag."],
  ["Afstemmen & bijsturen", "Via vaste contactmomenten houden we de samenwerking scherp en passen we aan waar nodig."],
];

const BENEFITS = [
  ["clock", "Meer tijd voor je onderneming", "Besteed je uren aan klanten, groei en strategie in plaats van aan administratie en organisatie."],
  ["sliders", "Flexibel inzetbaar", "Per opdracht of met vaste uren per maand: je schaalt op of af wanneer jij dat nodig hebt."],
  ["shield", "Discreet & betrouwbaar", "Vertrouwelijke omgang met jouw gegevens, conform de AVG/GDPR en desgewenst met geheimhoudingsverklaring."],
  ["globe", "Nederland & België", "Ondersteuning op afstand voor ondernemers in Nederland en Vlaanderen, in het Nederlands en Engels."],
  ["euro", "Geen werkgeverslasten", "Professionele ondersteuning zonder loonkosten, werving of vaste contracten."],
  ["user", "Eén vast aanspreekpunt", "Je werkt altijd met dezelfde persoon die jouw onderneming en voorkeuren kent."],
];

const HOME_FAQ = [
  ["Wat doet een virtuele assistent?", "Een virtuele assistent neemt op afstand administratieve en organisatorische taken van je over, zoals e-mailbeheer, agendabeheer, planning, reisorganisatie en reserveringsbeheer."],
  ["Werk je voor ondernemers in Nederland én België?", "Ja. Lazuli Remote ondersteunt zelfstandigen, ondernemers en kleine bedrijven in heel Nederland en België, volledig op afstand."],
  ["Hoeveel uur moet ik minimaal afnemen?", "Er is geen groot minimum. Met het pakket Flexibel schakel je mij in wanneer nodig; met Structureel of Executive spreken we een vast aantal uren per maand af."],
  ["Hoe wordt de samenwerking veilig ingericht?", "Ik werk met gedelegeerde toegang en beveiligde wachtwoordmanagers, en sluit op verzoek een verwerkersovereenkomst en geheimhoudingsverklaring af."],
  ["Hoe snel kunnen we starten?", "Na het kennismakingsgesprek en akkoord op het voorstel kunnen we doorgaans binnen één tot twee weken starten."],
];

// ─── Iconen (inline SVG, lijnstijl) ──────────────────────────────────────────
const ICON_PATHS = {
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  key: '<path d="M3 21h18"/><path d="M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  euro: '<path d="M4 10h12M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
};
const icon = (name, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${ICON_PATHS[name]}</svg>`;

const LOGO_MARK = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#1e3a8a" d="M32 3 57 17.5v29L32 61 7 46.5v-29Z"/><path fill="#2547a6" d="M32 3 57 17.5 32 32 7 17.5Z"/><path fill="#10205a" d="M32 32v29L7 46.5v-29Z"/><circle cx="40" cy="22" r="2.6" fill="#d8b45a"/><circle cx="22" cy="40" r="1.8" fill="#d8b45a"/><circle cx="44" cy="42" r="1.4" fill="#d8b45a"/></svg>`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const noDot = (s) => s.replace(/\.$/, "");
const abs = (path) => SITE.url + path;
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const NAV = [
  ["Home", "/"],
  ["Diensten", "/diensten/"],
  ["Werkwijze", "/werkwijze/"],
  ["Tarieven", "/tarieven/"],
  ["Over mij", "/over-mij/"],
  ["Contact", "/contact/"],
];

const CTA_PRIMARY = "Plan een vrijblijvend kennismakingsgesprek";
const CTA_SECONDARY = "Ontdek mijn diensten";

const ORG = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": SITE.url + "/#organisatie",
  name: SITE.name,
  url: SITE.url + "/",
  logo: SITE.url + "/favicon.svg",
  email: SITE.email,
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
  description: "Professionele virtual assistance en business support op afstand voor zelfstandigen, ondernemers en kleine bedrijven in Nederland en België.",
  areaServed: [{ "@type": "Country", name: "Nederland" }, { "@type": "Country", name: "België" }],
  knowsLanguage: ["nl", "en"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Diensten",
    itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: abs(`/diensten/${s.slug}/`) } })),
  },
};

function breadcrumbs(trail) {
  // trail: [[naam, pad], ...] — laatste item = huidige pagina
  const html = `<nav class="breadcrumbs" aria-label="Kruimelpad"><ol>${trail
    .map(([n, p], i) => (i === trail.length - 1 ? `<li><span aria-current="page">${esc(n)}</span></li>` : `<li><a href="${p}">${esc(n)}</a></li>`))
    .join("")}</ol></nav>`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([n, p], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: abs(p) })),
  };
  return { html, ld };
}

function faqBlock(items, headingId = "faq-title", heading = "Veelgestelde vragen") {
  return {
    html: `<h2 id="${headingId}">${heading}</h2><div class="faq">${items
      .map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`)
      .join("")}</div>`,
    ld: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  };
}

const ctaBand = (title = "Klaar om taken uit handen te geven?", text = "Ontdek in een vrijblijvend kennismakingsgesprek hoe Lazuli Remote jouw onderneming kan ondersteunen.", href = "/contact/") => `
<section class="section" aria-labelledby="cta-title"><div class="wrap">
  <div class="cta-band">
    <div><h2 id="cta-title">${title}</h2><p>${text}</p></div>
    <div><a class="btn btn--gold" href="${href}">${CTA_PRIMARY}</a></div>
  </div>
</div></section>`;

function serviceCard(s, headingTag = "h3") {
  return `<article class="service-card">
    <div class="service-icon">${icon(s.icon)}</div>
    <${headingTag}><a href="/diensten/${s.slug}/">${esc(s.title)}</a></${headingTag}>
    <p>${esc(s.intro)}</p>
    <ul class="check-list">${s.items.map((i) => `<li>${esc(noDot(i))}</li>`).join("")}</ul>
    <span class="card-link" aria-hidden="true">Meer over deze dienst ${icon("arrow")}</span>
  </article>`;
}

function planCard(p, headingTag = "h3") {
  return `<article class="plan${p.featured ? " plan--featured" : ""}">
    ${p.featured ? '<span class="plan-badge">Meest gekozen</span>' : ""}
    <${headingTag}>${esc(p.name)}</${headingTag}>
    <p class="plan-tag">${esc(p.tag)}</p>
    <p class="plan-desc">${esc(p.desc)}</p>
    <p class="plan-price">${esc(p.price)}<small>${esc(p.priceNote)}</small></p>
    <ul class="check-list">${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    <a class="btn ${p.featured ? "btn--primary" : "btn--ghost"}" href="/contact/">Vraag een voorstel aan<span class="sr-only"> voor ${esc(p.name)}</span></a>
  </article>`;
}

// ─── Layout ──────────────────────────────────────────────────────────────────
function layout({ path, title, description, body, ld = [], noindex = false, ogType = "website" }) {
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;
  const isActive = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  const nav = NAV.map(([n, href]) => `<li><a href="${href}"${isActive(href) ? ' aria-current="page"' : ""}>${n}</a></li>`).join("");
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${abs(path)}">`}
<link rel="alternate" hreflang="nl-NL" href="${abs(path)}">
<link rel="alternate" hreflang="nl-BE" href="${abs(path)}">
<link rel="alternate" hreflang="x-default" href="${abs(path)}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:locale:alternate" content="nl_BE">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#10205a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
${[ORG, ...ld].map(jsonLd).join("\n")}
</head>
<body>
<a class="skip-link" href="#main">Naar de inhoud</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/" aria-label="${SITE.name} — naar de homepage">${LOGO_MARK}<span>Lazuli <em>Remote</em></span></a>
    <div style="display:flex;align-items:center">
      <nav id="main-nav" class="main-nav" aria-label="Hoofdmenu">
        <ul>${nav}<li class="nav-cta"><a href="/contact/">Plan een kennismaking</a></li></ul>
      </nav>
      <a class="btn btn--primary header-cta" href="/contact/">Plan een kennismaking</a>
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
      <div>
        <a class="logo" href="/">${LOGO_MARK}<span>Lazuli <em>Remote</em></span></a>
        <p style="margin-top:14px;max-width:34ch">Jouw rechterhand. Waar je ook onderneemt. Virtual assistance en business support voor ondernemers in Nederland en België.</p>
      </div>
      <nav aria-labelledby="f-nav"><h2 id="f-nav">Navigatie</h2><ul>${NAV.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join("")}</ul></nav>
      <nav aria-labelledby="f-diensten"><h2 id="f-diensten">Diensten</h2><ul>${SERVICES.map((s) => `<li><a href="/diensten/${s.slug}/">${esc(s.title)}</a></li>`).join("")}</ul></nav>
      <div><h2>Contact</h2><ul>
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        ${SITE.phone ? `<li><a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a></li>` : ""}
        <li>Actief in Nederland &amp; België</li>
        ${SITE.kvk ? `<li>KvK ${esc(SITE.kvk)}</li>` : ""}
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year">${year}</span> ${SITE.name}. Alle rechten voorbehouden.</span>
      <a href="/privacy/">Privacyverklaring</a>
    </div>
  </div>
</footer>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

// ─── Pagina's ────────────────────────────────────────────────────────────────
const pages = [];
const page = (p) => pages.push(p);

// HOME
{
  const faq = faqBlock(HOME_FAQ);
  page({
    path: "/",
    title: "Lazuli Remote | Virtuele assistent in Nederland & België",
    description: "Freelance virtual assistant voor zzp'ers, ondernemers en kmo's in Nederland en België. Administratieve ondersteuning op afstand, executive assistance, planning en reserveringsbeheer.",
    ld: [faq.ld],
    body: `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Virtuele assistent · Nederland &amp; België</p>
      <h1 id="hero-title">Jouw rechterhand. <span class="accent">Waar je ook onderneemt.</span></h1>
      <p class="lead">Professionele virtual assistance en business support voor zelfstandigen, ondernemers en kleine bedrijven in Nederland en België.</p>
      <p class="sub">Van administratie en e-mailbeheer tot managementondersteuning, planning en reserveringen. Lazuli Remote neemt organisatorische en administratieve taken uit handen, zodat jij je kunt concentreren op wat écht belangrijk is: jouw onderneming.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="/contact/">${CTA_PRIMARY}</a>
        <a class="btn btn--ghost" href="/diensten/">${CTA_SECONDARY}</a>
      </div>
      <ul class="hero-points">
        <li>${icon("check")}100% op afstand</li>
        <li>${icon("check")}Flexibel of vaste uren</li>
        <li>${icon("check")}Discreet &amp; AVG-proof</li>
      </ul>
    </div>
    <div class="day-card" role="img" aria-label="Voorbeeld van een werkdag: inbox bijgewerkt, vergadering voorbereid, hotel geboekt en leveranciers bevestigd.">
      <div class="day-head"><span class="day-title">Vandaag geregeld</span><span class="day-date">Lazuli Remote</span></div>
      <ul class="day-list" aria-hidden="true">
        <li><span class="check">${icon("check")}</span><span>Inbox bijgewerkt en gesorteerd<small>Administratie &amp; e-mailbeheer</small></span></li>
        <li><span class="check">${icon("check")}</span><span>Agenda en overleg van donderdag voorbereid<small>Executive Assistant</small></span></li>
        <li><span class="check">${icon("check")}</span><span>Planning met leveranciers afgestemd<small>Operationele coördinatie</small></span></li>
        <li><span class="check">${icon("check")}</span><span>Hotel en trein naar Antwerpen geboekt<small>Reisorganisatie</small></span></li>
        <li><span class="check">${icon("check")}</span><span>Gasten van het weekend geïnformeerd<small>Reserveringsbeheer</small></span></li>
      </ul>
      <p class="day-foot" aria-hidden="true">Jij focust op je onderneming.</p>
    </div>
  </div>
</section>

<section class="strip" aria-label="Kenmerken">
  <div class="wrap"><ul>
    <li>${icon("user")}Voor zzp'ers, ondernemers &amp; kmo's</li>
    <li>${icon("globe")}Nederland &amp; België</li>
    <li>${icon("sliders")}Flexibel inzetbaar</li>
    <li>${icon("shield")}Discreet &amp; betrouwbaar</li>
  </ul></div>
</section>

<section class="section" id="diensten" aria-labelledby="diensten-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Diensten</p>
      <h2 id="diensten-title">De juiste ondersteuning voor jouw onderneming.</h2>
      <p class="lead">Van dagelijkse administratie en agendabeheer tot managementondersteuning, planning en reserveringen. Lazuli Remote biedt professionele ondersteuning op afstand, afgestemd op jouw onderneming en manier van werken.</p>
    </div>
    <div class="services-grid">${SERVICES.map((s) => serviceCard(s)).join("")}</div>
  </div>
</section>

<section class="section section--dark" aria-labelledby="werkwijze-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Werkwijze</p>
      <h2 id="werkwijze-title">In vier stappen ontzorgd</h2>
      <p class="lead" style="color:#b8c2e2">Een heldere start en een samenwerking die meegroeit met jouw onderneming.</p>
    </div>
    <ol class="steps">${STEPS.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
    <p class="mt-lg"><a class="btn btn--gold" href="/werkwijze/">Bekijk de werkwijze</a></p>
  </div>
</section>

<section class="section" aria-labelledby="waarom-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Waarom Lazuli Remote</p>
      <h2 id="waarom-title">Remote business support die écht ontzorgt</h2>
      <p class="lead">Een freelance virtual assistant geeft je de ondersteuning van een vaste kracht, zonder de verplichtingen.</p>
    </div>
    <div class="benefits">${BENEFITS.map(([i, t, d]) => `<div class="benefit"><h3>${icon(i)}${t}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="tarieven-title">
  <div class="wrap">
    <div class="section-head section-head--center">
      <p class="eyebrow">Tarieven</p>
      <h2 id="tarieven-title">Een pakket dat past bij jouw onderneming</h2>
      <p class="lead">Kies voor ondersteuning wanneer nodig, vaste uren per maand of persoonlijke managementondersteuning.</p>
    </div>
    <div class="plans">${PLANS.map((p) => planCard(p)).join("")}</div>
    <p class="center mt-lg"><a href="/tarieven/">Alles over de tarieven en pakketten</a></p>
  </div>
</section>

<section class="section" aria-labelledby="faq-title"><div class="wrap">${faq.html}</div></section>
${ctaBand()}`,
  });
}

// DIENSTEN OVERZICHT
{
  const bc = breadcrumbs([["Home", "/"], ["Diensten", "/diensten/"]]);
  page({
    path: "/diensten/",
    title: "Diensten | Virtuele assistent voor administratie, planning & reserveringen",
    description: "Vijf diensten van Lazuli Remote: administratie & e-mailbeheer, executive assistant, planning & operationele coördinatie, reisorganisatie en hospitality reserveringsbeheer.",
    ld: [bc.ld, {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: abs(`/diensten/${s.slug}/`) })),
    }],
    body: `
<section class="page-hero"><div class="wrap">
  ${bc.html}
  <p class="eyebrow">Diensten</p>
  <h1>De juiste ondersteuning voor jouw onderneming.</h1>
  <p class="lead">Van dagelijkse administratie en agendabeheer tot managementondersteuning, planning en reserveringen. Lazuli Remote biedt professionele ondersteuning op afstand, afgestemd op jouw onderneming en manier van werken.</p>
  <div class="btn-row"><a class="btn btn--primary" href="/contact/">${CTA_PRIMARY}</a></div>
</div></section>
<section class="section" aria-label="Overzicht van de vijf diensten"><div class="wrap">
  <div class="services-grid">${SERVICES.map((s) => serviceCard(s, "h2")).join("")}</div>
</div></section>
<section class="section section--tint" aria-labelledby="combi-title"><div class="wrap split">
  <div>
    <h2 id="combi-title">Diensten combineren</h2>
    <p class="lead">Veel ondernemers combineren meerdere diensten. Bijvoorbeeld inboxbeheer met agendabeheer, of reisorganisatie met operationele planning.</p>
  </div>
  <div class="panel">
    <h3>Twijfel je welke ondersteuning past?</h3>
    <p>In een vrijblijvend kennismakingsgesprek bekijken we samen welke taken je het beste kunt uitbesteden en welk pakket daarbij hoort.</p>
    <a class="btn btn--primary" href="/contact/">${CTA_PRIMARY}</a>
  </div>
</div></section>`,
  });
}

// DIENST-LANDINGSPAGINA'S (exact vijf)
for (const s of SERVICES) {
  const path = `/diensten/${s.slug}/`;
  const bc = breadcrumbs([["Home", "/"], ["Diensten", "/diensten/"], [s.title, path]]);
  const faq = faqBlock(s.faq);
  const others = SERVICES.filter((o) => o.slug !== s.slug);
  page({
    path,
    title: s.seoTitle,
    description: s.metaDesc,
    ld: [bc.ld, faq.ld, {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      serviceType: s.title,
      description: s.metaDesc,
      url: abs(path),
      provider: { "@id": SITE.url + "/#organisatie" },
      areaServed: [{ "@type": "Country", name: "Nederland" }, { "@type": "Country", name: "België" }],
      hasOfferCatalog: { "@type": "OfferCatalog", name: s.title, itemListElement: s.items.map((i) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: noDot(i) } })) },
    }],
    body: `
<section class="page-hero"><div class="wrap">
  ${bc.html}
  <p class="eyebrow">${esc(s.title)}</p>
  <h1>${esc(s.h1)}</h1>
  <p class="lead">${esc(s.lead)}</p>
  <div class="btn-row">
    <a class="btn btn--primary" href="/contact/?dienst=${s.slug}">${CTA_PRIMARY}</a>
    <a class="btn btn--ghost" href="/tarieven/">Bekijk de tarieven</a>
  </div>
</div></section>

<section class="section" aria-labelledby="taken-title"><div class="wrap">
  <div class="section-head">
    <h2 id="taken-title">Waarmee ik je ondersteun</h2>
    <p class="lead">${esc(s.intro)}</p>
  </div>
  <ul class="task-grid">${s.items.map((i) => `<li>${icon("check")}<span>${esc(noDot(i))}</span></li>`).join("")}</ul>
</div></section>

<section class="section section--tint"><div class="wrap split split--wide">
  <div class="prose">${s.body.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join("")}</div>
  <aside class="panel" aria-labelledby="voorwie-title">
    <h2 id="voorwie-title" style="font-size:1.4rem">Voor wie?</h2>
    <ul class="check-list">${s.forWho.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
    <a class="btn btn--primary" href="/contact/?dienst=${s.slug}">Plan een kennismaking</a>
  </aside>
</div></section>

<section class="section" aria-labelledby="faq-title"><div class="wrap">${faq.html}</div></section>

<section class="section section--tint" aria-labelledby="andere-title"><div class="wrap">
  <h2 id="andere-title">Andere diensten</h2>
  <ul class="related">${others.map((o) => `<li><a href="/diensten/${o.slug}/">${esc(o.title)}<span>${esc(o.intro)}</span></a></li>`).join("")}</ul>
</div></section>
${ctaBand(`Hulp nodig bij ${esc(s.title.split(" & ")[0].toLowerCase())}?`, "Plan een vrijblijvend kennismakingsgesprek en ontdek wat ik voor jouw onderneming kan betekenen.", `/contact/?dienst=${s.slug}`)}`,
  });
}

// WERKWIJZE
{
  const bc = breadcrumbs([["Home", "/"], ["Werkwijze", "/werkwijze/"]]);
  const faq = faqBlock([
    ["Moet ik veel tijd steken in het inwerken?", "Nee. Na het kennismakingsgesprek leg ik de belangrijkste afspraken vast en vraag ik alleen de informatie en toegang die ik nodig heb. De meeste ondernemers zijn binnen een week ingewerkt."],
    ["Hoe communiceren we?", "Via de kanalen die voor jou werken: e-mail, Teams, Slack, WhatsApp of een vast belmoment. We spreken vooraf af wanneer ik bereikbaar ben en hoe snel je een reactie kunt verwachten."],
    ["Hoe houd ik zicht op de uren?", "Je ontvangt een overzichtelijke urenregistratie, zodat je altijd weet waaraan de tijd is besteed."],
  ]);
  page({
    path: "/werkwijze/",
    title: "Werkwijze | Zo werkt samenwerken met een virtuele assistent",
    description: "Hoe samenwerken met Lazuli Remote werkt: van een vrijblijvend kennismakingsgesprek en voorstel op maat tot een soepele start en vaste afstemming. Remote business support in NL en BE.",
    ld: [bc.ld, faq.ld],
    body: `
<section class="page-hero"><div class="wrap">
  ${bc.html}
  <p class="eyebrow">Werkwijze</p>
  <h1>Zo werken we samen</h1>
  <p class="lead">Een virtuele assistent inschakelen moet je tijd opleveren, geen extra werk. Daarom houd ik de start eenvoudig en de afspraken helder.</p>
</div></section>
<section class="section" aria-label="Stappen"><div class="wrap">
  <ol class="steps">${STEPS.map(([t, d]) => `<li><h2 style="font-size:1.2rem">${t}</h2><p>${d}</p></li>`).join("")}</ol>
</div></section>
<section class="section section--tint"><div class="wrap split">
  <div class="prose">
    <h2>Werken op afstand, dichtbij betrokken</h2>
    <p>Ik werk volledig op afstand voor ondernemers in Nederland en België. Dat betekent: geen extra werkplek, geen reistijd en flexibele inzet. Tegelijk ben ik nauw betrokken bij jouw onderneming en ken ik je voorkeuren, systemen en prioriteiten.</p>
    <h2>Veilig en vertrouwelijk</h2>
    <p>Ik werk met gedelegeerde toegang en beveiligde wachtwoordmanagers, zodat je nooit zomaar wachtwoorden hoeft te delen. Op verzoek sluiten we een verwerkersovereenkomst en geheimhoudingsverklaring af, conform de AVG/GDPR.</p>
  </div>
  <div class="panel">
    <h2 style="font-size:1.4rem">Wat je mag verwachten</h2>
    <ul class="check-list">
      <li>Eén vast aanspreekpunt</li>
      <li>Duidelijke afspraken over bereikbaarheid en reactietijd</li>
      <li>Transparante urenregistratie</li>
      <li>Werken in jouw systemen en tools</li>
      <li>Communicatie in het Nederlands en Engels</li>
    </ul>
  </div>
</div></section>
<section class="section" aria-labelledby="faq-title"><div class="wrap">${faq.html}</div></section>
${ctaBand()}`,
  });
}

// TARIEVEN
{
  const bc = breadcrumbs([["Home", "/"], ["Tarieven", "/tarieven/"]]);
  const faq = faqBlock([
    ["Hoe komt het tarief tot stand?", "Het tarief hangt af van het pakket, het aantal uren en de aard van de werkzaamheden. Na het kennismakingsgesprek ontvang je een helder voorstel zonder verrassingen."],
    ["Kan ik wisselen van pakket?", "Ja. Groeit je behoefte aan ondersteuning, of juist niet, dan passen we het pakket in overleg aan."],
    ["Welke diensten vallen onder de pakketten?", "Alle vijf de diensten: administratie & e-mailbeheer, executive assistant & managementondersteuning, planning & operationele coördinatie, reisorganisatie & reserveringen en hospitality & reserveringsbeheer."],
    ["Factureer je aan bedrijven in België?", "Ja, ik werk voor ondernemers in zowel Nederland als België en factureer overeenkomstig de geldende btw-regels."],
  ]);
  page({
    path: "/tarieven/",
    title: "Tarieven | Flexibel, Structureel of Executive",
    description: "Tarieven en pakketten van Lazuli Remote: Flexibel (ondersteuning wanneer nodig), Structureel (vaste ondersteuning per maand) en Executive (persoonlijke managementondersteuning).",
    ld: [bc.ld, faq.ld],
    body: `
<section class="page-hero"><div class="wrap">
  ${bc.html}
  <p class="eyebrow">Tarieven</p>
  <h1>Pakketten en tarieven</h1>
  <p class="lead">Drie heldere manieren om samen te werken. Elk pakket wordt afgestemd op jouw onderneming, zodat je alleen betaalt voor de ondersteuning die je echt nodig hebt.</p>
</div></section>
<section class="section" aria-label="Pakketten"><div class="wrap">
  <div class="plans">${PLANS.map((p) => planCard(p, "h2")).join("")}</div>
</div></section>
<section class="section section--tint" aria-labelledby="faq-title"><div class="wrap">${faq.html}</div></section>
${ctaBand("Benieuwd welk pakket bij je past?", "Plan een vrijblijvend kennismakingsgesprek en ontvang een voorstel op maat.")}`,
  });
}

// OVER MIJ
{
  const bc = breadcrumbs([["Home", "/"], ["Over mij", "/over-mij/"]]);
  page({
    path: "/over-mij/",
    title: "Over mij | Freelance virtual assistant",
    description: "Maak kennis met de freelance virtual assistant achter Lazuli Remote: professionele administratieve en organisatorische ondersteuning op afstand voor ondernemers in Nederland en België.",
    ld: [bc.ld],
    body: `
<section class="page-hero"><div class="wrap">
  ${bc.html}
  <p class="eyebrow">Over mij</p>
  <h1>De rechterhand achter Lazuli Remote</h1>
  <p class="lead">Ik help zelfstandigen, ondernemers en kleine bedrijven om overzicht en rust te creëren in hun werkdag, zodat zij zich kunnen richten op hun onderneming.</p>
</div></section>
<section class="section"><div class="wrap split split--wide">
  <div class="prose">
    <!-- TODO: vervang onderstaande tekst door je persoonlijke verhaal, achtergrond en ervaring. -->
    <h2>Waarom Lazuli Remote?</h2>
    <p>Lapis lazuli is een steen die al eeuwenlang staat voor helderheid, vertrouwen en wijsheid. Precies die waarden breng ik mee in elke samenwerking: helder communiceren, betrouwbaar opvolgen en vooruitdenken.</p>
    <h2>Mijn manier van werken</h2>
    <p>Ik werk gestructureerd, discreet en zelfstandig. Ik denk graag mee over hoe processen slimmer kunnen en neem verantwoordelijkheid voor de taken die je aan mij toevertrouwt. Of het nu gaat om een overvolle inbox, een complexe planning of een zakelijke reis: je kunt erop rekenen dat het goed geregeld wordt.</p>
    <h2>Ervaring</h2>
    <p>Met ervaring in administratieve ondersteuning, managementondersteuning, planning en de reis- en hospitalitysector weet ik wat ondernemers nodig hebben om hun werkdag soepel te laten verlopen.</p>
  </div>
  <aside class="panel" aria-labelledby="kern-title">
    <h2 id="kern-title" style="font-size:1.4rem">In het kort</h2>
    <ul class="check-list">
      <li>Freelance virtual assistant</li>
      <li>Ondersteuning in Nederland &amp; België</li>
      <li>Nederlands en Engels</li>
      <li>Discreet en AVG-bewust</li>
      <li>Gespecialiseerd in administratie, executive support, planning, reisorganisatie en hospitality</li>
    </ul>
    <a class="btn btn--primary" href="/contact/">Plan een kennismaking</a>
  </aside>
</div></section>
<section class="section section--tint" aria-labelledby="waarden-title"><div class="wrap">
  <h2 id="waarden-title">Waar ik voor sta</h2>
  <div class="benefits">
    <div class="benefit"><h3>${icon("shield")}Betrouwbaar</h3><p>Afspraak is afspraak. Je weet altijd waar je aan toe bent.</p></div>
    <div class="benefit"><h3>${icon("sliders")}Flexibel</h3><p>Ik pas me aan jouw onderneming, tools en werkritme aan.</p></div>
    <div class="benefit"><h3>${icon("user")}Persoonlijk</h3><p>Een vast aanspreekpunt dat jouw onderneming écht kent.</p></div>
  </div>
</div></section>
${ctaBand("Zullen we kennismaken?", "Vertel me over jouw onderneming en ontdek hoe ik je kan ondersteunen.")}`,
  });
}

// CONTACT
{
  const bc = breadcrumbs([["Home", "/"], ["Contact", "/contact/"]]);
  page({
    path: "/contact/",
    title: "Contact | Plan een vrijblijvend kennismakingsgesprek",
    description: "Neem contact op met Lazuli Remote en plan een vrijblijvend kennismakingsgesprek over virtual assistance en business support voor jouw onderneming in Nederland of België.",
    ld: [bc.ld, { "@context": "https://schema.org", "@type": "ContactPage", url: abs("/contact/"), about: { "@id": SITE.url + "/#organisatie" } }],
    body: `
<section class="page-hero"><div class="wrap">
  ${bc.html}
  <p class="eyebrow">Contact</p>
  <h1>Plan een vrijblijvend kennismakingsgesprek</h1>
  <p class="lead">Vertel kort waar je ondersteuning bij zoekt. Ik neem binnen één werkdag contact met je op om een moment voor een kennismaking in te plannen.</p>
</div></section>
<section class="section"><div class="wrap split split--wide">
  <div class="panel">
    <h2 style="font-size:1.6rem">Stuur een bericht</h2>
    <form id="contact-form" action="/contact.php" method="post">
      <div class="form-grid">
        <div class="field">
          <label for="naam">Naam</label>
          <input id="naam" name="naam" type="text" autocomplete="name" required data-required="Vul je naam in." aria-describedby="naam-error">
          <p class="error" id="naam-error" role="alert"></p>
        </div>
        <div class="field">
          <label for="bedrijf">Bedrijfsnaam <span class="hint">(optioneel)</span></label>
          <input id="bedrijf" name="bedrijf" type="text" autocomplete="organization">
        </div>
        <div class="field">
          <label for="email">E-mailadres</label>
          <input id="email" name="email" type="email" autocomplete="email" required data-required="Vul je e-mailadres in." aria-describedby="email-error">
          <p class="error" id="email-error" role="alert"></p>
        </div>
        <div class="field">
          <label for="telefoon">Telefoonnummer <span class="hint">(optioneel)</span></label>
          <input id="telefoon" name="telefoon" type="tel" autocomplete="tel">
        </div>
        <div class="field full">
          <label for="dienst">Waarvoor zoek je ondersteuning?</label>
          <select id="dienst" name="dienst" required data-required="Kies waarvoor je ondersteuning zoekt." aria-describedby="dienst-error">
            <option value="">Maak een keuze</option>
            ${FORM_OPTIONS.map((o) => `<option value="${esc(o.label)}" data-slug="${o.slug}">${esc(o.label)}</option>`).join("\n            ")}
          </select>
          <p class="error" id="dienst-error" role="alert"></p>
        </div>
        <div class="field full">
          <label for="bericht">Je bericht</label>
          <textarea id="bericht" name="bericht" required data-required="Schrijf kort waar je hulp bij zoekt." aria-describedby="bericht-error bericht-hint"></textarea>
          <p class="form-note" id="bericht-hint">Bijvoorbeeld: welke taken je wilt uitbesteden en hoeveel uur per maand je ongeveer verwacht.</p>
          <p class="error" id="bericht-error" role="alert"></p>
        </div>
        <div class="hp" aria-hidden="true">
          <label for="website">Laat dit veld leeg</label>
          <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>
        <div class="field full">
          <div class="check-field">
            <input id="privacy" name="privacy" type="checkbox" value="ja" required data-required="Geef toestemming om je gegevens te verwerken." aria-describedby="privacy-error">
            <label for="privacy" style="font-weight:400">Ik ga ermee akkoord dat mijn gegevens worden gebruikt om contact met mij op te nemen, zoals beschreven in de <a href="/privacy/">privacyverklaring</a>.</label>
          </div>
          <p class="error" id="privacy-error" role="alert"></p>
        </div>
        <div class="full"><button class="btn btn--primary" type="submit">Verstuur je aanvraag</button></div>
      </div>
    </form>
  </div>
  <aside>
    <div class="panel">
      <h2 style="font-size:1.4rem">Contactgegevens</h2>
      <ul class="contact-list">
        <li>${icon("mail")}<span><strong>E-mail</strong><a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
        ${SITE.phone ? `<li>${icon("phone")}<span><strong>Telefoon</strong><a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a></span></li>` : ""}
        <li>${icon("pin")}<span><strong>Werkgebied</strong>Op afstand, in heel Nederland en België</span></li>
        <li>${icon("clock")}<span><strong>Reactietijd</strong>Binnen één werkdag</span></li>
      </ul>
    </div>
    <div class="panel" style="margin-top:20px">
      <h2 style="font-size:1.2rem">Wat gebeurt er na je aanvraag?</h2>
      <ol style="padding-left:1.2em;margin:0;color:var(--muted)">
        <li>Ik neem contact op om een moment te plannen.</li>
        <li>We bespreken je situatie in een vrijblijvend gesprek.</li>
        <li>Je ontvangt een voorstel op maat.</li>
      </ol>
    </div>
  </aside>
</div></section>`,
  });
}

// BEDANKT
page({
  path: "/contact/bedankt/",
  title: "Bedankt voor je bericht",
  description: "Je bericht is verzonden. Lazuli Remote neemt binnen één werkdag contact met je op.",
  noindex: true,
  body: `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">Bericht verzonden</p>
  <h1>Bedankt voor je bericht!</h1>
  <p class="lead">Ik neem binnen één werkdag contact met je op om een kennismakingsgesprek in te plannen.</p>
  <div class="btn-row"><a class="btn btn--primary" href="/">Terug naar de homepage</a><a class="btn btn--ghost" href="/diensten/">${CTA_SECONDARY}</a></div>
</div></section>`,
});

// PRIVACY
page({
  path: "/privacy/",
  title: "Privacyverklaring",
  description: "Privacyverklaring van Lazuli Remote: hoe persoonsgegevens worden verwerkt en beschermd.",
  body: `
<section class="page-hero"><div class="wrap">
  ${breadcrumbs([["Home", "/"], ["Privacyverklaring", "/privacy/"]]).html}
  <h1>Privacyverklaring</h1>
  <p class="lead">Lazuli Remote gaat zorgvuldig om met persoonsgegevens, in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR).</p>
</div></section>
<section class="section"><div class="wrap prose" style="max-width:780px">
  <!-- TODO: laat deze privacyverklaring controleren en vul de bedrijfsgegevens aan. -->
  <h2>Welke gegevens verwerk ik?</h2>
  <p>Via het contactformulier verwerk ik je naam, bedrijfsnaam, e-mailadres, telefoonnummer en de inhoud van je bericht. Deze gegevens verstrek je zelf.</p>
  <h2>Waarvoor gebruik ik deze gegevens?</h2>
  <p>Uitsluitend om contact met je op te nemen naar aanleiding van je aanvraag en, als we gaan samenwerken, voor de uitvoering van de overeenkomst.</p>
  <h2>Hoe lang bewaar ik gegevens?</h2>
  <p>Niet langer dan noodzakelijk. Gegevens van aanvragen die niet tot een samenwerking leiden, verwijder ik uiterlijk twaalf maanden na het laatste contact.</p>
  <h2>Delen met derden</h2>
  <p>Ik verkoop je gegevens nooit en deel ze alleen met derden wanneer dat nodig is voor de uitvoering van mijn diensten of wettelijk verplicht is.</p>
  <h2>Je rechten</h2>
  <p>Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen. Neem hiervoor contact op via <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
</div></section>`,
});

// 404
page({
  path: "/404.html",
  file: "404.html",
  title: "Pagina niet gevonden",
  description: "Deze pagina bestaat niet (meer).",
  noindex: true,
  body: `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">404</p>
  <h1>Deze pagina bestaat niet (meer)</h1>
  <p class="lead">Mogelijk is de pagina verplaatst. Bekijk de diensten of ga terug naar de homepage.</p>
  <div class="btn-row"><a class="btn btn--primary" href="/">Naar de homepage</a><a class="btn btn--ghost" href="/diensten/">${CTA_SECONDARY}</a></div>
</div></section>`,
});

// ─── Schrijven ───────────────────────────────────────────────────────────────
// Oude/verwijderde routes die opgeruimd moeten worden als ze nog bestaan
const REMOVED = ["diensten/sales-crm-klantenservice"];
for (const r of REMOVED) {
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
const indexable = pages.filter((p) => !p.noindex);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);

console.log(`✓ ${pages.length} pagina's gegenereerd in ./public`);
