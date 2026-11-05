<?php
// Lazuli Remote — verwerking contactformulier (PHP-hosting, bv. Hostinger)
// TODO: stel het ontvangende adres in.
const RECIPIENT = 'info@lazuliremote.com';
const ALLOWED_SERVICES = [
    'Administratie & e-mailbeheer',
    'Executive Assistant & managementondersteuning',
    'Planning & operationele coördinatie',
    'Reisorganisatie & reserveringen',
    'Hospitality & reserveringsbeheer',
    'Andere ondersteuning',
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact/', true, 303);
    exit;
}

// Honeypot: bots vullen dit veld in
if (!empty($_POST['website'])) {
    header('Location: /contact/bedankt/', true, 303);
    exit;
}

$clean = fn($v) => trim(str_replace(["\r", "\n"], ' ', (string)($v ?? '')));
$naam     = $clean($_POST['naam'] ?? '');
$bedrijf  = $clean($_POST['bedrijf'] ?? '');
$email    = $clean($_POST['email'] ?? '');
$telefoon = $clean($_POST['telefoon'] ?? '');
$dienst   = $clean($_POST['dienst'] ?? '');
$bericht  = trim((string)($_POST['bericht'] ?? ''));
$privacy  = ($_POST['privacy'] ?? '') === 'ja';

if ($naam === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($dienst, ALLOWED_SERVICES, true) || $bericht === '' || !$privacy) {
    header('Location: /contact/?fout=1', true, 303);
    exit;
}

$body = "Nieuwe aanvraag via lazuliremote.com\n\n"
      . "Naam: $naam\nBedrijf: $bedrijf\nE-mail: $email\nTelefoon: $telefoon\n"
      . "Ondersteuning: $dienst\n\nBericht:\n$bericht\n";

$headers = [
    'From: Lazuli Remote website <' . RECIPIENT . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

@mail(RECIPIENT, '=?UTF-8?B?' . base64_encode("Kennismakingsaanvraag: $dienst") . '?=', $body, implode("\r\n", $headers));

header('Location: /contact/bedankt/', true, 303);
exit;
