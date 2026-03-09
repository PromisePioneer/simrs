<?php

namespace App\Models;

use Database\Factories\DoctorProfileFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorProfile extends Model
{
    /** @use HasFactory<DoctorProfileFactory> */
    use HasUuids, HasFactory;

    protected $table = 'doctor_profiles';
    protected $fillable = [
        'poli_id',
        'user_id',
        'sip',
        'specialization',
        'estimated_consultation_time'
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class, 'poli_id');
    }
}
