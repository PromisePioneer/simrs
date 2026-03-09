<?php

use App\Actions\Tenant\GenerateTenantRoles;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantDefaultRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('can generate tenant roles after tenant created', function () {
    $defaultRoles = [
        'Owner',
        'Dokter',
        'Perawat',
        'Admin',
        'Kasir',
    ];

    foreach ($defaultRoles as $roleName) {
        TenantDefaultRole::factory()->create(['name' => $roleName, 'guard_name' => 'web']);
    }

    $tenant = Tenant::factory()->create();
    (new GenerateTenantRoles())->execute($tenant->id);
    $roles = Role::where('tenant_id', $tenant->id)->get();

    expect($roles)->toHaveCount(5)
        ->and($roles->pluck('name')->sort()->values())
        ->toEqual(collect($defaultRoles)->sort()->values())
        ->and($roles->pluck('guard_name')->unique()->values())->toEqual(collect(['web']));
});
