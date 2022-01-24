<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $table = 'quiz';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title','description','created_by'
    ];
}
