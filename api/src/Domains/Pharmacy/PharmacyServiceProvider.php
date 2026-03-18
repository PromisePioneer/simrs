<?php

declare(strict_types=1);

namespace Domains\Pharmacy;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineCategory;
use App\Models\MedicineRack;
use App\Models\MedicineWarehouse;
use Domains\Pharmacy\Application\Services\MedicineBatchService;
use Domains\Pharmacy\Application\Services\MedicineCategoryService;
use Domains\Pharmacy\Application\Services\MedicineRackService;
use Domains\Pharmacy\Application\Services\MedicineService;
use Domains\Pharmacy\Application\Services\MedicineWarehouseService;
use Domains\Pharmacy\Domain\Repository\MedicineBatchRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\MedicineCategoryRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\MedicineRackRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\MedicineRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\MedicineWarehouseRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineCategoryModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineRackModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Domains\Pharmacy\Infrastructure\Persistence\Repositories\EloquentMedicineBatchRepository;
use Domains\Pharmacy\Infrastructure\Persistence\Repositories\EloquentMedicineCategoryRepository;
use Domains\Pharmacy\Infrastructure\Persistence\Repositories\EloquentMedicineRackRepository;
use Domains\Pharmacy\Infrastructure\Persistence\Repositories\EloquentMedicineRepository;
use Domains\Pharmacy\Infrastructure\Persistence\Repositories\EloquentMedicineWarehouseRepository;
use Domains\Pharmacy\Presentation\Controllers\MedicineBatchController;
use Domains\Pharmacy\Presentation\Controllers\MedicineCategoryController;
use Domains\Pharmacy\Presentation\Controllers\MedicineController;
use Domains\Pharmacy\Presentation\Controllers\MedicineRackController;
use Domains\Pharmacy\Presentation\Controllers\MedicineWarehouseController;
use Domains\Pharmacy\Presentation\Policies\MedicineBatchPolicy;
use Domains\Pharmacy\Presentation\Policies\MedicineCategoryPolicy;
use Domains\Pharmacy\Presentation\Policies\MedicinePolicy;
use Domains\Pharmacy\Presentation\Policies\MedicineRackPolicy;
use Domains\Pharmacy\Presentation\Policies\MedicineWarehousePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PharmacyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repositories
        $this->app->bind(MedicineRepositoryInterface::class,
            fn() => new EloquentMedicineRepository(new MedicineModel()));
        $this->app->bind(MedicineCategoryRepositoryInterface::class,
            fn() => new EloquentMedicineCategoryRepository(new MedicineCategoryModel()));
        $this->app->bind(MedicineWarehouseRepositoryInterface::class,
            fn() => new EloquentMedicineWarehouseRepository(new MedicineWarehouseModel()));
        $this->app->bind(MedicineRackRepositoryInterface::class,
            fn() => new EloquentMedicineRackRepository(new MedicineRackModel()));
        $this->app->bind(MedicineBatchRepositoryInterface::class,
            fn() => new EloquentMedicineBatchRepository(new MedicineBatchModel(), new MedicineBatchStockModel()));

        // Services
        $this->app->bind(MedicineService::class,
            fn($app) => new MedicineService($app->make(MedicineRepositoryInterface::class)));
        $this->app->bind(MedicineCategoryService::class,
            fn($app) => new MedicineCategoryService($app->make(MedicineCategoryRepositoryInterface::class)));
        $this->app->bind(MedicineWarehouseService::class,
            fn($app) => new MedicineWarehouseService($app->make(MedicineWarehouseRepositoryInterface::class)));
        $this->app->bind(MedicineRackService::class,
            fn($app) => new MedicineRackService($app->make(MedicineRackRepositoryInterface::class)));
        $this->app->bind(MedicineBatchService::class,
            fn($app) => new MedicineBatchService($app->make(MedicineBatchRepositoryInterface::class)));

        // Controllers
        $this->app->bind(MedicineController::class,
            fn($app) => new MedicineController($app->make(MedicineService::class)));
        $this->app->bind(MedicineCategoryController::class,
            fn($app) => new MedicineCategoryController($app->make(MedicineCategoryService::class)));
        $this->app->bind(MedicineWarehouseController::class,
            fn($app) => new MedicineWarehouseController($app->make(MedicineWarehouseService::class)));
        $this->app->bind(MedicineRackController::class,
            fn($app) => new MedicineRackController($app->make(MedicineRackService::class)));
        $this->app->bind(MedicineBatchController::class,
            fn($app) => new MedicineBatchController($app->make(MedicineBatchService::class)));
    }

    public function boot(): void
    {
        Gate::policy(Medicine::class, MedicinePolicy::class);
        Gate::policy(MedicineCategory::class, MedicineCategoryPolicy::class);
        Gate::policy(MedicineWarehouse::class, MedicineWarehousePolicy::class);
        Gate::policy(MedicineRack::class, MedicineRackPolicy::class);
        Gate::policy(MedicineBatch::class, MedicineBatchPolicy::class);
    }
}
