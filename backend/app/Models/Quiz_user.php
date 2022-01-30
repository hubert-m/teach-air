<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz_user extends Model
{
    protected $table = 'quiz_user';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'quiz_id', 'correct_answers', 'wrong_answers', 'kind_of_finish'
    ];
}
