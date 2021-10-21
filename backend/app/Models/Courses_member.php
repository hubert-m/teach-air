<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Courses_member extends Model
{
    protected $table = 'courses_members';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_id','user_id'
    ];
}
