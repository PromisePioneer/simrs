<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    /** @use HasFactory<\Database\Factories\DegreeFactory> */
    use HasFactory, HasUuids;


    protected $table = 'degrees';
    protected $fillable = [
        'type',
        'name'
    ];

}
