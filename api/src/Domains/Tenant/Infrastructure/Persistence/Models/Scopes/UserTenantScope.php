<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Persistence\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class UserTenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (!Auth::check()) {
            return;
        }

        $user = Auth::user();

        if ($user->hasTenant()) {
            $builder->where($model->getTable() . '.tenant_id', $user->tenant_id);
        }
    }
}
