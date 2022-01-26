<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8"/>
</head>
<body>
<h2>Wniosek o reset hasła dla {{ $imie }} na platformie Teach-Air</h2>
<p>Zapomniałeś hasła? Aby je zresetować będziesz potrzebował poniższego kodu do resetu hasła</p>
<p>Musisz go wykorzystać w odpowiednim formularzu do resetu hasła na stronie</p>
<p>Twój kod aktywacyjny: <strong>{{ $token_aktywacji }}</strong></p>
<p>lub kliknij <a href="{{ $adres_resetu }}" target="_blank">Tutaj</a> aby przejść do formularza resetu hasła</p>
</body>
</html>
