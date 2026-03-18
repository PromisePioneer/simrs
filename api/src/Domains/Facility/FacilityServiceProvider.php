<?php

declare(strict_types=1);

namespace Domains\Facility;

use App\Models\Building;
use App\Models\Room;
use App\Models\Ward;
use Domains\Facility\Application\Services\BedService;
use Domains\Facility\Application\Services\BuildingService;
use Domains\Facility\Application\Services\RoomService;
use Domains\Facility\Application\Services\WardService;
use Domains\Facility\Domain\Repository\BedRepositoryInterface;
use Domains\Facility\Domain\Repository\BuildingRepositoryInterface;
use Domains\Facility\Domain\Repository\RoomRepositoryInterface;
use Domains\Facility\Domain\Repository\WardRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\BedModel;
use Domains\Facility\Infrastructure\Persistence\Models\BuildingModel;
use Domains\Facility\Infrastructure\Persistence\Models\RoomModel;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;
use Domains\Facility\Infrastructure\Persistence\Repositories\EloquentBedRepository;
use Domains\Facility\Infrastructure\Persistence\Repositories\EloquentBuildingRepository;
use Domains\Facility\Infrastructure\Persistence\Repositories\EloquentRoomRepository;
use Domains\Facility\Infrastructure\Persistence\Repositories\EloquentWardRepository;
use Domains\Facility\Presentation\Controllers\BedController;
use Domains\Facility\Presentation\Controllers\BuildingController;
use Domains\Facility\Presentation\Controllers\RoomController;
use Domains\Facility\Presentation\Controllers\WardController;
use Domains\Facility\Presentation\Policies\BedPolicy;
use Domains\Facility\Presentation\Policies\BuildingPolicy;
use Domains\Facility\Presentation\Policies\RoomPolicy;
use Domains\Facility\Presentation\Policies\WardPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class FacilityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repositories
        $this->app->bind(BuildingRepositoryInterface::class,
            fn() => new EloquentBuildingRepository(new BuildingModel()));
        $this->app->bind(WardRepositoryInterface::class,
            fn() => new EloquentWardRepository(new WardModel()));
        $this->app->bind(RoomRepositoryInterface::class,
            fn() => new EloquentRoomRepository(new RoomModel()));
        $this->app->bind(BedRepositoryInterface::class,
            fn() => new EloquentBedRepository(new BedModel()));

        // Services
        $this->app->bind(BuildingService::class,
            fn($app) => new BuildingService($app->make(BuildingRepositoryInterface::class)));
        $this->app->bind(WardService::class,
            fn($app) => new WardService($app->make(WardRepositoryInterface::class)));
        $this->app->bind(BedService::class,
            fn($app) => new BedService(
                $app->make(BedRepositoryInterface::class),
                $app->make(RoomRepositoryInterface::class),
            ));
        $this->app->bind(RoomService::class,
            fn($app) => new RoomService(
                $app->make(RoomRepositoryInterface::class),
                $app->make(BedRepositoryInterface::class),
                $app->make(BedService::class),
            ));

        // Controllers
        $this->app->bind(BuildingController::class,
            fn($app) => new BuildingController($app->make(BuildingService::class)));
        $this->app->bind(WardController::class,
            fn($app) => new WardController($app->make(WardService::class)));
        $this->app->bind(RoomController::class,
            fn($app) => new RoomController($app->make(RoomService::class)));
        $this->app->bind(BedController::class,
            fn($app) => new BedController($app->make(BedService::class)));
    }

    public function boot(): void
    {
        Gate::policy(Building::class, BuildingPolicy::class);
        Gate::policy(Ward::class, WardPolicy::class);
        Gate::policy(Room::class, RoomPolicy::class);
        Gate::policy(BedModel::class, BedPolicy::class);
    }
}
