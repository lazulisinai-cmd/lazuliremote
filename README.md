# lazuliremote
Official website of Lazuli Remote – Virtual Assistance & Business Support

## Over dit project

Statische website (Nederlands) met vijf diensten. Alle teksten staan in `build.mjs`.

- `node build.mjs` → genereert alle pagina's, `sitemap.xml` en `robots.txt` in `public/`
- `node serve.mjs` → lokale preview op http://localhost:4321
- Publiceren: upload de inhoud van `public/` naar de webroot (PHP-hosting nodig voor het contactformulier).

## Nog in te vullen
- `build.mjs` → `SITE`: definitief domein, e-mailadres, telefoon, KvK-/ondernemingsnummer
- `public/contact.php` → `RECIPIENT` (ontvangend e-mailadres)
- Over mij: persoonlijk verhaal en foto (zie TODO in `build.mjs`)
- Privacyverklaring laten controleren
- Tarieven: bedragen toevoegen indien gewenst (nu "Tarief per uur / Vast maandbedrag / Op maat")
