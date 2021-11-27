<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call('UsersTableSeeder');

        /*
        $this->call([
            UserSeeder::class
        ]);
        */

        DB::table('sex')->insert(array('value' => 'Mężczyzna'));
        DB::table('sex')->insert(array('value' => 'Kobieta'));

        DB::table('users')->insert(
            array(
                'email' => 'admin@teach-air.pl',
                'password' => Hash::make('12345'),
                'name' => 'Hubert',
                'lastname' => 'Machała',
                'status' => 3,
                'sex_id' => 1,
                'activate_token' => uniqid()
            )
        );

        User::factory()
            ->count(14)
            ->create();

        DB::table('courses')->insert(
            array(
                'name' => 'VII Semestr',
                'description' => 'Grupa 4 rok, 7 semestr',
                'slug' => 'vii-semestr',
                'created_by' => 1
            )
        );

        DB::table('courses')->insert(
            array(
                'name' => 'Programowanie i bazy danych',
                'description' => 'Grupa 4 rok, 7 semestr - specjalizacja',
                'slug' => 'vii-semestr-programowanie-i-bazy-danych',
                'parent_id' => 1,
                'created_by' => 1
            )
        );

        DB::table('courses')->insert(
            array(
                'name' => 'Sieci komputerowe',
                'description' => 'Grupa 4 rok, 7 semestr - specjalizacja',
                'slug' => 'vii-semestr-sieci-komputerowe',
                'parent_id' => 1,
                'created_by' => 1
            )
        );
    }
}
