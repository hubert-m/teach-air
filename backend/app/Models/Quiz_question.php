<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz_question extends Model
{
    protected $table = 'quiz_questions';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'question','description','answer_a','answer_b','answer_c','answer_d','quiz_id'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'correct_answer',
    ];
}
