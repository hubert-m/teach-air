<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message_file extends Model
{
    protected $table = 'messages_files';
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'message_id','file_id'
    ];
}
