<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateThreadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('threads', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('course_id')->unsigned()->index();
            $table->string("title", 255);
            $table->text("description")->nullable();
            $table->string("icon", 200)->nullable();
            $table->string("slug", 200); // use in uri address : www.test.pl/thread/slug-slug lub www.test.pl/course-slug/thread-slug
            $table->bigInteger('created_by')->unsigned()->index();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('threads', function($table) {
            // jeśli skasowany zostanie kurs - to wszystkie wątki zawarte w nim również
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
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
        Schema::dropIfExists('threads');
    }
}
