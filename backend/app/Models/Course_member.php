<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course_member extends Model
{
    protected $table = 'courses_members';
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
