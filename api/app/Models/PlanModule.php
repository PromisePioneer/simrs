<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanModule extends Model
{
    use HasUuids;

    protected $table = 'plan_module';
    protected $fillable = [
        'plan_id',
        'module_id',
        'is_accessible',
        'limit',
    ];


    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }


    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
