<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Providers;

use Domains\Pharmacy\Application\Services\PharmacyProcurementService;
use Domains\Pharmacy\Application\Services\PharmacyPrescriptionAndSalesService;
use Illuminate\Support\ServiceProvider;

class PharmacyServiceProvider extends ServiceProvider
{
    /**
     * Register services in the container.
     */
    public function register(): void
    {
        // Bind services
        $this->app->singleton(PharmacyProcurementService::class, function ($app) {
            return new PharmacyProcurementService();
        });

        $this->app->singleton(PharmacyPrescriptionAndSalesService::class, function ($app) {
            return new PharmacyPrescriptionAndSalesService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load migrations
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');

        // Publish migrations
        $this->publishes([
            __DIR__ . '/../../database/migrations' => database_path('migrations'),
        ], 'pharmacy-migrations');

        // Register routes
        $this->loadRoutesFrom(__DIR__ . '/../Routes/pharmacy.php');

        // Register views if any
        $this->loadViewsFrom(__DIR__ . '/../Views', 'pharmacy');

        // Register config
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/pharmacy.php',
            'pharmacy'
        );

        $this->publishes([
            __DIR__ . '/../../config/pharmacy.php' => config_path('pharmacy.php'),
        ], 'pharmacy-config');
    }
}
