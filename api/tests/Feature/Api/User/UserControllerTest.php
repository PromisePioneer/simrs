<?php


use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Spatie\Permission\PermissionRegistrar;


it('return paginated users', function () {

    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $superAdmin = User::factory()->create([
        'name' => 'Super Admin',
        'tenant_id' => null
    ]);

    $superAdminRole = Role::factory()->create([
        'name' => 'Super Admin',
        'guard_name' => 'web',
        'tenant_id' => null
    ]);

    $superAdmin->assignRole($superAdminRole->name);
    $this->actingAs($superAdmin);
    User::factory()->count(10)->create();
    $response = $this->getJson('/api/v1/users');
    $response->assertOk()->assertJsonStructure([
        'current_page',
        'data',
        'first_page_url',
        'from',
        'last_page',
        'links',
        'next_page_url',
        'path',
        'per_page',
        'prev_page_url',
        'to',
        'total',
    ]);
});

//
//it('can create user based on tenant', function () {
//    $tenant = Tenant::factory()->create();
//
//    setPermissionsTeamId($tenant->id);
//
//    $owner = UserManagement::factory()->create([
//        'name' => 'Owner',
//        'tenant_id' => $tenant->id
//    ]);
//
//    role::factory()->create([
//        'name' => 'Owner',
//        'guard_name' => 'web',
//    ]);
//
//
//    $owner->assignRole('Owner');
//    $this->actingAs($owner);
//
//    $request = Mockery::mock(UserRequest::class);
//    $request->shouldReceive('validated')->andReturn([
//        'name' => 'Dokter',
//        'tenant_id' => $tenant->id,
//        'phone' => '081273631',
//        'address' => "jl kartini",
//        'roles' => [
//            'Dokter'
//        ]
//    ]);
//
//    expect($tenant)->toBeInstanceOf(Tenant::class)
//        ->and($tenant->name)->toBe('Dokter')
//        ->and($tenant->code)->not->toBeNull();
//});
