<?php

declare(strict_types=1);

namespace Domains\Tenant;

use Domains\Tenant\Application\Services\TenantService;
use Domains\Tenant\Domain\Repository\TenantRepositoryInterface;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Domains\Tenant\Infrastructure\Persistence\Repositories\EloquentTenantRepository;
use Domains\Tenant\Presentation\Controllers\TenantController;
use Domains\Tenant\Presentation\Policies\TenantPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class TenantServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ── Repository ────────────────────────────────────────────────────────
        $this->app->bind(
            TenantRepositoryInterface::class,
            fn() => new EloquentTenantRepository(new TenantModel())
        );

        // ── Service ───────────────────────────────────────────────────────────
        $this->app->bind(
            TenantService::class,
            fn($app) => new TenantService(
                tenantRepository: $app->make(TenantRepositoryInterface::class),
            )
        );

        // ── Controller ────────────────────────────────────────────────────────
        $this->app->bind(
            TenantController::class,
            fn($app) => new TenantController(
                tenantService: $app->make(TenantService::class),
            )
        );
    }

    public function boot(): void
    {
        // ── Policy ────────────────────────────────────────────────────────────
        Gate::policy(TenantModel::class, TenantPolicy::class);
    }
}
