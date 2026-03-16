<?php

namespace Tests\Concerns;

use App\Models\Tenant;
use App\Models\User;

trait WithTenant
{
    public Tenant $tenant;
    public User $user;

    public function setUpWithTenant(): void
    {
        $this->tenant = Tenant::factory()->create([
            'code' => 'RSU',
            'name' => 'RS Test',
            'type' => 'rs',
        ]);

        $this->user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
    }
}
