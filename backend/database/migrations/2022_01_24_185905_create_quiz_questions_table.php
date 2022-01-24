<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateQuizQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->string("question", 500);
            $table->text("description")->nullable();
            $table->string("answer_a", 200);
            $table->string("answer_b", 200);
            $table->string("answer_c", 200);
            $table->string("answer_d", 200);
            $table->bigInteger('quiz_id')->unsigned()->index();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('quiz_questions', function($table) {
            // jeśli skasowany zostanie kurs - to wszystkie wątki zawarte w nim również
            //$table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('quiz_id')->references('id')->on('quiz')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz_questions');
    }
}
