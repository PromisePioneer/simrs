<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ModuleModel extends Model
{
    use HasUuids, HasFactory;

    protected $table    = 'modules';
    protected $fillable = ['name', 'parent_id', 'route', 'icon', 'order'];

    public function permissions(): HasMany
    {
        return $this->hasMany(PermissionModel::class, 'module_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('order');
    }

    public function childrenRecursive(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')
            ->with(['permissions', 'childrenRecursive'])
            ->orderBy('order');
    }

    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(
            \App\Models\Plan::class,
            'plan_module'
        )->withPivot('is_accessible', 'limit', 'allowed_permissions');
    }

    public function isAccessibleByPlan(object $plan): bool
    {
        return $this->plans()
            ->where('plans.id', $plan->id)
            ->where('plan_module.is_accessible', true)
            ->exists();
    }
}
