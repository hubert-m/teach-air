<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* TEN PLIK NIE JEST UŻYWANY - ZAMIAST NIEGO UserFactory.php */

        DB::table('users')->insert([
            'email' => Str::random(10).'@gmail.com',
            'password' => Hash::make('password'),
            'name' => Str::random(10),
            'lastname' => Str::random(10),
            'sex_id' => 1,
            'activate_token' => uniqid()
        ]);
    }
}
