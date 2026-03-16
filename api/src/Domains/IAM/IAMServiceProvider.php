<?php

declare(strict_types=1);

namespace Domains\IAM;

use Domains\IAM\Application\Services\DegreeService;
use Domains\IAM\Application\Services\DepartmentService;
use Domains\IAM\Application\Services\PoliService;
use Domains\IAM\Application\Services\RegistrationInstitutionService;
use Domains\IAM\Application\Services\RoomTypeService;
use Domains\IAM\Domain\Repository\DegreeRepositoryInterface;
use Domains\IAM\Domain\Repository\DepartmentRepositoryInterface;
use Domains\IAM\Domain\Repository\PoliRepositoryInterface;
use Domains\IAM\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\IAM\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\DegreeModel;
use Domains\IAM\Infrastructure\Persistence\Models\DepartmentModel;
use Domains\IAM\Infrastructure\Persistence\Models\PoliModel;
use Domains\IAM\Infrastructure\Persistence\Models\RegistrationInstitutionModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoomTypeModel;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentDegreeRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentDepartmentRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentPoliRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentRegistrationInstitutionRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentRoomTypeRepository;
use Domains\IAM\Presentation\Controllers\DegreeController;
use Domains\IAM\Presentation\Controllers\DepartmentController;
use Domains\IAM\Presentation\Controllers\PoliController;
use Domains\IAM\Presentation\Controllers\RegistrationInstitutionController;
use Domains\IAM\Presentation\Controllers\RoomTypeController;
use Domains\IAM\Presentation\Policies\DegreePolicy;
use Domains\IAM\Presentation\Policies\PoliPolicy;
use Domains\IAM\Presentation\Policies\RegistrationInstitutionPolicy;
use Domains\IAM\Presentation\Policies\RoomTypePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class IAMServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->bindDegree();
        $this->bindDepartment();
        $this->bindPoli();
        $this->bindRegistrationInstitution();
        $this->bindRoomType();

    }

    public function boot(): void
    {

        Gate::policy(DegreeModel::class, DegreePolicy::class);
        Gate::policy(DepartmentModel::class, DepartmentController::class);
        Gate::policy(PoliModel::class, PoliPolicy::class);
        Gate::policy(RegistrationInstitutionModel::class, RegistrationInstitutionPolicy::class);
        Gate::policy(RoomTypeModel::class, RoomTypePolicy::class);
    }

    private function bindDegree(): void
    {
        $this->app->bind(DegreeRepositoryInterface::class, EloquentDegreeRepository::class);

        $this->app->bind(
            DegreeService::class,
            fn($app) => new DegreeService($app->make(DegreeRepositoryInterface::class))
        );

        $this->app->bind(
            DegreeController::class,
            fn($app) => new DegreeController($app->make(DegreeService::class))
        );
    }

    private function bindDepartment(): void
    {
        $this->app->bind(DepartmentRepositoryInterface::class, EloquentDepartmentRepository::class);

        $this->app->bind(
            DepartmentService::class,
            fn($app) => new DepartmentService($app->make(DepartmentRepositoryInterface::class))
        );

        $this->app->bind(
            DepartmentController::class,
            fn($app) => new DepartmentController($app->make(DepartmentService::class))
        );
    }


    private function bindPoli(): void
    {
        $this->app->bind(PoliRepositoryInterface::class, EloquentPoliRepository::class);


        $this->app->bind(PoliService::class,
            fn($app) => new PoliService($app->make(PoliRepositoryInterface::class))
        );


        $this->app->bind(
            PoliController::class,
            fn($app) => new PoliController($app->make(PoliService::class))
        );
    }


    private function bindRegistrationInstitution(): void
    {
        $this->app->bind(RegistrationInstitutionRepositoryInterface::class, EloquentRegistrationInstitutionRepository::class);


        $this->app->bind(RegistrationInstitutionService::class,
            fn($app) => new RegistrationInstitutionService($app->make(RegistrationInstitutionRepositoryInterface::class))
        );


        $this->app->bind(
            RegistrationInstitutionController::class,
            fn($app) => new RegistrationInstitutionController($app->make(RegistrationInstitutionService::class))
        );
    }

    private function bindRoomType(): void
    {
        $this->app->bind(RoomTypeRepositoryInterface::class, EloquentRoomTypeRepository::class);


        $this->app->bind(RoomTypeService::class,
            fn($app) => new RoomTypeService($app->make(RoomTypeRepositoryInterface::class))
        );

        $this->app->bind(
            RoomTypeController::class,
            fn($app) => new RoomTypeController($app->make(RoomTypeService::class))
        );
    }
}
