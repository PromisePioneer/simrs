<?php

namespace Tests\Unit\Action\Tenant;

use App\Actions\Tenant\SyncTenantPermissions;
use App\Models\Tenant;
use App\Models\TenantDefaultPermission;
use App\Models\TenantDefaultRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SyncTenantPermissionsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_syncs_permissions_for_all_tenant_roles()
    {
        $role = TenantDefaultRole::factory()->create();
        TenantDefaultPermission::create([
            'name' => 'view_patient',
            'guard_name' => 'web',
            'tenant_default_role_id' => $role->id,
        ]);

        $tenant = Tenant::factory()->create();
        $action = new SyncTenantPermissions();
        $action->execute($tenant->id);
        $this->assertDatabaseHas('tenant_default_permissions', [
            'name' => 'view_patient',
            'guard_name' => 'web',
            'tenant_default_role_id' => $role->id,
        ]);
    }
}
