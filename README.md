# lazuliremote
Official website of Lazuli Remote – Virtual Assistance & Business Support

## Over dit project

Statische website (Nederlands) met drie pagina's: Home, Diensten & tarieven en Over mij, plus een privacyverklaring. Alle teksten, diensten en prijzen staan in `build.mjs`.

- `node build.mjs` → genereert de pagina's, `sitemap.xml` en `robots.txt` in `public/`
- `node serve.mjs` → lokale preview op http://localhost:4321
- Publiceren: push naar `main`. Een GitHub Action zet `public/` op de branch `deploy`, en Hostinger publiceert die automatisch op lazuliremote.com.

## Nog in te vullen
- `build.mjs` → `SITE.email` / `SITE.phone`: alleen geverifieerde contactgegevens (worden pas getoond als ze ingevuld zijn)
- `public/contact.php` → `RECIPIENT`: het e-mailadres waarop kennismakingsaanvragen binnenkomen
- Eventueel een boekingstool (Calendly, Cal.com, Microsoft Bookings) voor het kennismakingsgesprek van 20 minuten
- Privacyverklaring laten controleren
