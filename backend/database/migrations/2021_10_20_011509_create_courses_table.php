<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string("name", 255);
            $table->text("description")->nullable();
            $table->string("icon", 200)->nullable(); // path to image or font awesome code
            $table->string("slug", 200); // use in uri address www.test.pl/course/slug-slug lub www.test.pl/slug-slug
            $table->bigInteger('parent_id')->unsigned()->index()->nullable(); // jesli NULL to kurs glowny, nadrzedny
            $table->bigInteger('created_by')->unsigned()->index();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('courses', function($table) {
            // jesli kasujemy kurs nadrzedny,
            // to kasowane są też wszystkie podrzedne
            $table->foreign('parent_id')->references('id')->on('courses')->onDelete('cascade');
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
        Schema::dropIfExists('courses');
    }
}
