<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_id';
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';

        Schema::create($tableNames['permissions'], function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->foreignUuid('module_id')->nullable()->index()->constrained('modules')->cascadeOnDelete();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
            $table->unique(['name', 'guard_name'], 'permissions_unique');
        });

        Schema::create($tableNames['roles'], function (Blueprint $table) {
            $table->uuid('uuid')->primary();  // UUID PK
            $table->foreignUuid('tenant_id')->nullable()->index()->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();

            $table->unique(['tenant_id', 'name', 'guard_name'], 'roles_unique');
        });

        Schema::create($tableNames['model_has_permissions'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission) {
            $table->uuid($pivotPermission); // FK ke permissions.id
            $table->string('model_type');
            $table->uuid($columnNames['model_morph_key']); // biasanya user.id
            $table->foreignUuid('tenant_id')->nullable()->index()->constrained('tenants')->cascadeOnDelete();
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

            $table->foreign($pivotPermission)
                ->references('uuid')
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            $table->primary(
                [$pivotPermission, $columnNames['model_morph_key'], 'model_type', 'tenant_id'],
                'model_has_permissions_permission_model_type_tenant_primary'
            );
        });

        Schema::create($tableNames['model_has_roles'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole) {
            $table->uuid($pivotRole); // FK ke roles.id
            $table->string('model_type');
            $table->uuid($columnNames['model_morph_key']); // biasanya user.id
            $table->foreignUuid('tenant_id')->nullable()->index()->constrained('tenants')->cascadeOnDelete();

            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

            $table->foreign($pivotRole)
                ->references('uuid')
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            $table->primary(
                [$pivotRole, $columnNames['model_morph_key'], 'model_type'],
                'model_has_roles_role_model_type_tenant_primary'
            );
        });

        Schema::create($tableNames['role_has_permissions'], function (Blueprint $table) use ($pivotRole, $pivotPermission) {
            $table->uuid($pivotPermission);
            $table->uuid($pivotRole);
            $table->foreign($pivotPermission)
                ->references('uuid')
                ->on('permissions')
                ->onDelete('cascade');

            $table->foreign($pivotRole)
                ->references('uuid')
                ->on('roles')
                ->onDelete('cascade');

            $table->primary(
                [$pivotPermission, $pivotRole]
            );
        });

        app('cache')
            ->store(config('permission.cache.store') != 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));
    }

    public function down(): void
    {
        $tableNames = config('permission.table_names');

        Schema::dropIfExists($tableNames['role_has_permissions']);
        Schema::dropIfExists($tableNames['model_has_roles']);
        Schema::dropIfExists($tableNames['model_has_permissions']);
        Schema::dropIfExists($tableNames['roles']);
        Schema::dropIfExists($tableNames['permissions']);
    }
};
