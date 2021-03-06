<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string("email", 320)->unique();
            $table->string("password", 128);
            $table->string("name", 255);
            $table->string("second_name", 255)->nullable();
            $table->string("lastname", 255);
            $table->string("profile_image", 200)->nullable(); // path to image
            $table->string("phone", 20)->nullable();
            $table->string("facebook", 100)->nullable();
            $table->text("hobby")->nullable();
            $table->text("description")->nullable();
            $table->tinyInteger("status")->default(0); // 0 - niepotwierdzony email ; 1 - student ; 2 - wykladowca ; 3 - admin
            $table->timestamp("last_change_pass")->default(DB::raw('DATE_ADD(NOW(), INTERVAL 1 HOUR)')); // YYYY-MM-DD HH:mm:ss // dateTime i now() zwracało godzine wcześniejszy czas
            $table->boolean("show_email")->default(true);
            $table->bigInteger('sex_id')->unsigned()->index(); // id płci z tabeli 'sex'
            $table->string("activate_token", 100);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('users', function($table) {
            $table->foreign('sex_id')->references('id')->on('sex')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
