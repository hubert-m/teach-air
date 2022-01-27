<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateQuizTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz', function (Blueprint $table) {
            $table->id();
            $table->string("title", 255);
            $table->text("description")->nullable();
            $table->bigInteger('seconds_for_answer')->nullable()->default(0); // domyslnie bez limitu czasu
            $table->bigInteger('course_id')->unsigned()->index()->nullable(); // może być przypisany do jakiegos kursu, ale nie musi
            $table->bigInteger('created_by')->unsigned()->index();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('quiz', function($table) {
            // jeśli skasowany zostanie kurs - to wszystkie wątki zawarte w nim również
            //$table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz');
    }
}
