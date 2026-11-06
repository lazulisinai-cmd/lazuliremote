<?php
// Lazuli Remote — verwerking kennismakingsformulier (PHP-hosting, bv. Hostinger)
// TODO: vul hier het geverifieerde zakelijke e-mailadres in waarop aanvragen binnenkomen.
const RECIPIENT = 'info@lazuliremote.com';
const BACK = '/diensten-tarieven/';

function back(string $query): void {
    header('Location: ' . BACK . '?' . $query . '#kennismaken', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . BACK . '#kennismaken', true, 303);
    exit;
}

// Honeypot: bots vullen dit veld in
if (!empty($_POST['website'])) {
    back('verzonden=1');
}

$clean = fn($v) => trim(str_replace(["\r", "\n"], ' ', (string)($v ?? '')));
$naam    = mb_substr($clean($_POST['naam'] ?? ''), 0, 120);
$email   = mb_substr($clean($_POST['email'] ?? ''), 0, 200);
$bedrijf = mb_substr($clean($_POST['bedrijf'] ?? ''), 0, 160);
$bericht = mb_substr(trim((string)($_POST['bericht'] ?? '')), 0, 5000);
$privacy = ($_POST['privacy'] ?? '') === 'ja';

if ($naam === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $bericht === '' || !$privacy) {
    back('fout=1');
}

$body = "Nieuwe kennismakingsaanvraag via lazuliremote.com\n\n"
      . "Naam: $naam\nE-mail: $email\nBedrijf: " . ($bedrijf !== '' ? $bedrijf : '-') . "\n\n"
      . "Waarmee kan ik je helpen?\n$bericht\n";

$headers = [
    'From: Lazuli Remote website <' . RECIPIENT . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail(RECIPIENT, '=?UTF-8?B?' . base64_encode("Kennismakingsaanvraag van $naam") . '?=', $body, implode("\r\n", $headers));

back($sent ? 'verzonden=1' : 'fout=1');
