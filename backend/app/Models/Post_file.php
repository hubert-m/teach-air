<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post_file extends Model
{
    protected $table = 'posts_files';
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'post_id','file_id'
    ];
}
