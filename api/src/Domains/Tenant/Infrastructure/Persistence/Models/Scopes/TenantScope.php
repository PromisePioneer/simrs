<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Persistence\Models\Scopes;

use App\Models\User;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineCategoryModel;
use Domains\Tenant\Infrastructure\Services\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = TenantContext::getId();

        setPermissionsTeamId($tenantId);

        if (!$tenantId) {
            return;
        }

        $allowGlobalModels = [
            RoleModel::class,
            MedicineCategoryModel::class,
            PoliModel::class,
            RoomTypeModel::class,
        ];

        if ($model instanceof User) {
            $tenantId = $this->getTenantIdForUserModel();
            if ($tenantId) {
                $builder->where($model->getTable() . '.tenant_id', $tenantId);
            }
            return;
        }

        if (in_array(get_class($model), $allowGlobalModels)) {
            $this->applyGlobalOrTenantScope($builder, $model, $tenantId);
            return;
        }

        $builder->where($model->getTable() . '.tenant_id', $tenantId);
    }

    protected function applyGlobalOrTenantScope(
        Builder $builder,
        Model   $model,
        string  $tenantId
    ): void {
        $table = $model->getTable();
        $builder->where(function ($query) use ($table, $tenantId) {
            $query->whereNull("$table.tenant_id")
                ->orWhere("$table.tenant_id", $tenantId);
        });
    }

    /**
     * Get tenant ID untuk User model tanpa trigger recursion.
     */
    protected function getTenantIdForUserModel(): ?string
    {
        $userId = auth()->id();
        if (!$userId) {
            return null;
        }

        return \DB::table('users')
            ->where('id', $userId)
            ->value('tenant_id');
    }
}
