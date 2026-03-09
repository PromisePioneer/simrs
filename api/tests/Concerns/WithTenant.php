<?php
// tests/Concerns/WithTenant.php

namespace Tests\Concerns;

use App\Models\Tenant;
use App\Models\User;

trait WithTenant
{
    protected Tenant $tenant;
    protected User $user;
    protected bool $shouldActAsUser = true;

    public function setUpWithTenant(): void
    {
        $this->tenant = Tenant::factory()->create();
        $this->user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);

        $this->user->assignRole();

        if ($this->shouldActAsUser) {
            $this->actingAs($this->user);
        }
    }

    public function asGuest(): void
    {
        $this->shouldActAsUser = false;

        // ⭐ Logout jika sudah authenticated
        if (auth()->check()) {
            auth()->logout();
        }
    }
}
