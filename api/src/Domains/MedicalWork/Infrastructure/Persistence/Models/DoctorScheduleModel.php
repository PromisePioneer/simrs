<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorScheduleModel extends BaseModel
{
    protected $table    = 'doctor_schedules';
    protected $fillable = ['id', 'user_id', 'day_of_week', 'start_time', 'end_time'];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
