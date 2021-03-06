# Instruction

Tutaj będzie moja instrukcja :)

Lista endpointów API `routes/web.php`

Zainstalowane poleceniem `composer create-project --prefer-dist laravel/lumen .`

Instalacja illuminate/mail `composer require illuminate/mail`

## Prod

`TODO - finalną wersję bazy wyeksportować do pliku database.sql | ewentualnie napisać skrypt install.php z formularzem, instalacją bazy danych i tworzeniem pliku .env`

1. Tworzymy klona repozytorium z GitHub
2. Wykonujemy polecenie `composer install` - katalog `vendor` jest niezbędny do poprawnego działania
3. Tworzymy kopie pliku `.env.example`, zmieniamy nazwę na `.env` i zmieniamy w nim:
    1. wartość dla `APP_URL` z `http://localhost` na docelowy adres API
    2. Dane do połączenia z bazą danych
4. Wykonujemy polecenie `php artisan migrate` w celu stworzenia tabel w bazie danych

LUB

Importujemy plik `database.sql` do naszej bazy danych (tej, której dane podaliśmy w pliku `.env`)
3. Wgrywamy wszystkie pliki do katalogu `public_html` na serwerze www
4. W katalogu `public_html` na serwerze tworzymy plik `.htaccess` o zawartości:

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

## Dev

Serwer lokalny `php -S localhost:8000 -t public`

Odświeżenie paczek w katalogu `vendor` - `composer install`

Tworzenie migracji tabel `php artisan make:migration create_users_table`

Tworzenie modelu `php artisan make:model User`

Tworzenie kontrolera `php artisan make:controller UserController`

Tworzenie wypełniacza do tabeli `php artisan make:factory UserFactory` - jeśli korzystamy z faker php lub `php artisan make:seeder UserSeeder` - jeśli używamy randomowych ciągów znaków. Dodać wpis do `DatabaseSeeder.php`

Wykonanie migracji `php artisan migrate`

Usunięcie wszystkich tabel i utworzenie od nowa `php artisan migrate:fresh`

To co powyżej, ale z wypałniaczami `php artisan migrate:fresh --seed`

Wypełnienie bazy danych bez restartowania tabel `php artisan db:seed`

### Hasło dla wszystkich kont z wypełniacza to `12345`
### Konto tworzone przy tworzeniu tabel - `admin@teach-air.pl` `12345`

# Lumen PHP Framework

[![Build Status](https://travis-ci.org/laravel/lumen-framework.svg)](https://travis-ci.org/laravel/lumen-framework)
[![Total Downloads](https://img.shields.io/packagist/dt/laravel/framework)](https://packagist.org/packages/laravel/lumen-framework)
[![Latest Stable Version](https://img.shields.io/packagist/v/laravel/framework)](https://packagist.org/packages/laravel/lumen-framework)
[![License](https://img.shields.io/packagist/l/laravel/framework)](https://packagist.org/packages/laravel/lumen-framework)

Laravel Lumen is a stunningly fast PHP micro-framework for building web applications with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Lumen attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as routing, database abstraction, queueing, and caching.

## Official Documentation

Documentation for the framework can be found on the [Lumen website](https://lumen.laravel.com/docs).

## Contributing

Thank you for considering contributing to Lumen! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Security Vulnerabilities

If you discover a security vulnerability within Lumen, please send an e-mail to Taylor Otwell at taylor@laravel.com. All security vulnerabilities will be promptly addressed.

## License

The Lumen framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
