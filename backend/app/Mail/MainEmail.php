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
        $odbiorca = $this->data['recipient'];

        if($typ_wiadomosci == "rejestracja") {
            $imie = $this->data['name'];
            return $this->view('emails.rejestracja')
                ->from($address, $name)
                ->cc($odbiorca, $imie)
                ->subject("Witaj ".$imie." na Teach-Air")
                ->with([ 'imie' => $imie ]);
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
