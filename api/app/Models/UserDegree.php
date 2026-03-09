<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDegree extends Model
{
    protected $table = 'user_degrees';
    protected $fillable = [
        'user_id',
        'degree_id',
        'order'
    ];


    public function degree(): BelongsTo
    {
        return $this->belongsTo(Degree::class, 'degree_id');
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
