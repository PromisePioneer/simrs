<?php

use App\Models\Patient;
use App\Models\Role;
use App\Models\User;

it('can get all patients', function () {
    Patient::factory()->create([
        'full_name' => 'John Doe',
    ]);

    $superAdmin = User::factory()->create([
        'name' => 'Owner',
        'tenant_id' => null,
    ]);
    $superAdminRole = Role::factory()->create([
        'name' => 'Super Admin',
        'tenant_id' => null,
    ]);

    $superAdmin->assignRole($superAdminRole->name);
    $this->actingAs($superAdmin);

    $response = $this->getJson('/api/v1/combo-sources/patients');
    $response->assertStatus(200)->assertJsonStructure([
        '*' => [
            'id',
            'full_name',
        ]
    ]);
});
