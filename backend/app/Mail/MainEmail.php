<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MainEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        $address = 'no-reply@teach-air.pl';
        $name = 'Teach-Air';
        $typ_wiadomosci = $this->data['type'];
        $token_aktywacji = $this->data['activate_token'];
        $adres_aktywacji_front = env("FRONT_URL", "http://localhost:3000")."/".env("ACTIVATION_PAGE", "activation")."/".$token_aktywacji;

        $adres_reset_hasla_front = env("FRONT_URL", "http://localhost:3000")."/".env("RESET_PASSWORD_PAGE", "forget-password")."/".$token_aktywacji;

        if($typ_wiadomosci == "rejestracja") {
            $imie = $this->data['name'];
            return $this->view('emails.rejestracja')
                ->from($address, $name)
                ->subject("Witaj ".$imie." na Teach-Air")
                ->with([ 'imie' => $imie, 'token_aktywacji' => $token_aktywacji, 'adres_aktywacji' => $adres_aktywacji_front ]);
        }

        if($typ_wiadomosci == "resethasla") {
            $imie = $this->data['name'];
            return $this->view('emails.resethasla')
                ->from($address, $name)
                ->subject("Wniosek o reset hasła dla ".$imie." na Teach-Air")
                ->with([ 'imie' => $imie, 'token_aktywacji' => $token_aktywacji, 'adres_resetu' => $adres_reset_hasla_front ]);
        }


        return $this->view('emails.main')
            ->from($address, $name)
            ->cc($address, $name)
            //->bcc($address, $name)
            //->replyTo($address, $name)
            ->subject("Tytuł wiadomości")
            ->with([ 'test_message' => "Treść wiadomości podstawiona do szablonu" ]);
    }
}
