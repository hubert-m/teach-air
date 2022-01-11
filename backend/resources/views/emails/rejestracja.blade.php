<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8"/>
</head>
<body>
<h2>Witaj {{ $imie }} na platformie Teach-Air</h2>
<p>Rejestracja przebiegła pomyślnie</p>
<p>Twój kod aktywacyjny: <strong>{{ $token_aktywacji }}</strong></p>
<p>Przepisz go w odpowiednim miejscu w aplikacji aby aktywować konto</p>
<p>lub kliknij <a href="{{ $adres_aktywacji }}" target="_blank">Tutaj</a></p>
</body>
</html>
