<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages_files', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('message_id')->unsigned()->index();
            $table->bigInteger('file_id')->unsigned()->index();
        });

        Schema::table('message_files', function($table) {
            $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages_files');
    }
}
