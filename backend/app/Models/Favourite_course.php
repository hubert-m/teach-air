<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favourite_course extends Model
{
    protected $table = 'favourite_courses';
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_id','user_id'
    ];
}
