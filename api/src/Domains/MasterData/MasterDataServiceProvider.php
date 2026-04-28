<?php

namespace Domains\MasterData;

use Carbon\Laravel\ServiceProvider;
use Domains\MasterData\Application\Services\DegreeService;
use Domains\MasterData\Application\Services\DepartmentService;
use Domains\MasterData\Application\Services\DiseaseService;
use Domains\MasterData\Application\Services\PaymentMethodService;
use Domains\MasterData\Application\Services\PaymentMethodTypeService;
use Domains\MasterData\Application\Services\PoliService;
use Domains\MasterData\Application\Services\RegistrationInstitutionService;
use Domains\MasterData\Application\Services\RoomTypeService;
use Domains\MasterData\Domain\Repository\DegreeRepositoryInterface;
use Domains\MasterData\Domain\Repository\DepartmentRepositoryInterface;
use Domains\MasterData\Domain\Repository\DiseaseRepositoryInterface;
use Domains\MasterData\Domain\Repository\PaymentMethodRepositoryInterface;
use Domains\MasterData\Domain\Repository\PaymentMethodTypeRepositoryInterface;
use Domains\MasterData\Domain\Repository\PoliRepositoryInterface;
use Domains\MasterData\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\MasterData\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\DegreeModel;
use Domains\MasterData\Infrastructure\Persistent\Models\DepartmentModel;
use Domains\MasterData\Infrastructure\Persistent\Models\DiseaseModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PaymentMethodTypeModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RegistrationInstitutionModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentDegreeRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentDepartmentRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentDiseaseRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentPaymentMethodRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentPaymentMethodTypeRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentPoliRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentRegistrationInstitutionRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentRoomTypeRepository;
use Domains\MasterData\Persentation\Controllers\DegreeController;
use Domains\MasterData\Persentation\Controllers\DepartmentController;
use Domains\MasterData\Persentation\Controllers\DiseaseController;
use Domains\MasterData\Persentation\Controllers\PaymentMethodController;
use Domains\MasterData\Persentation\Controllers\PaymentMethodTypeController;
use Domains\MasterData\Persentation\Controllers\PoliController;
use Domains\MasterData\Persentation\Controllers\RegistrationInstitutionController;
use Domains\MasterData\Persentation\Controllers\RoomTypeController;
use Domains\MasterData\Persentation\Policies\DegreePolicy;
use Domains\MasterData\Persentation\Policies\DepartmentPolicy;
use Domains\MasterData\Persentation\Policies\DiseasePolicy;
use Domains\MasterData\Persentation\Policies\PaymentMethodTypePolicy;
use Domains\MasterData\Persentation\Policies\PoliPolicy;
use Domains\MasterData\Persentation\Policies\RegistrationInstitutionPolicy;
use Domains\MasterData\Persentation\Policies\RoomTypePolicy;
use Illuminate\Support\Facades\Gate;

class MasterDataServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->bindDegree();
        $this->bindDepartment();
        $this->bindPoli();
        $this->bindRegistrationInstitution();
        $this->bindRoomType();
        $this->bindPaymentMethodType();
        $this->bindPaymentMethod();
        $this->bindDisease();
    }


    public function boot(): void
    {
        Gate::policy(DegreeModel::class, DegreePolicy::class);
        Gate::policy(DepartmentModel::class, DepartmentPolicy::class);
        Gate::policy(PoliModel::class, PoliPolicy::class);
        Gate::policy(RegistrationInstitutionModel::class, RegistrationInstitutionPolicy::class);
        Gate::policy(RoomTypeModel::class, RoomTypePolicy::class);
        Gate::policy(PaymentMethodTypeModel::class, PaymentMethodTypePolicy::class);
        Gate::policy(DiseaseModel::class, DiseasePolicy::class);

    }


    private function bindPaymentMethod(): void
    {
        $this->app->bind(PaymentMethodRepositoryInterface::class, EloquentPaymentMethodRepository::class);
        $this->app->bind(PaymentMethodService::class, fn($app) => new PaymentMethodService($app->make(PaymentMethodRepositoryInterface::class)));
        $this->app->bind(PaymentMethodController::class, fn($app) => new PaymentMethodController($app->make(PaymentMethodService::class)));
    }


    private function bindPaymentMethodType(): void
    {
        $this->app->bind(PaymentMethodTypeRepositoryInterface::class, EloquentPaymentMethodTypeRepository::class);
        $this->app->bind(PaymentMethodTypeService::class, fn($app) => new PaymentMethodTypeService($app->make(PaymentMethodTypeRepositoryInterface::class)));
        $this->app->bind(PaymentMethodTypeController::class, fn($app) => new PaymentMethodTypeController($app->make(PaymentMethodTypeService::class)));
    }


    private function bindDegree(): void
    {
        $this->app->bind(DegreeRepositoryInterface::class, EloquentDegreeRepository::class);
        $this->app->bind(DegreeService::class, fn($app) => new DegreeService($app->make(DegreeRepositoryInterface::class)));
        $this->app->bind(DegreeController::class, fn($app) => new DegreeController($app->make(DegreeService::class)));
    }

    private function bindDepartment(): void
    {
        $this->app->bind(DepartmentRepositoryInterface::class, EloquentDepartmentRepository::class);
        $this->app->bind(DepartmentService::class, fn($app) => new DepartmentService($app->make(DepartmentRepositoryInterface::class)));
        $this->app->bind(DepartmentController::class, fn($app) => new DepartmentController($app->make(DepartmentService::class)));
    }

    private function bindPoli(): void
    {
        $this->app->bind(PoliRepositoryInterface::class, EloquentPoliRepository::class);
        $this->app->bind(PoliService::class, fn($app) => new PoliService($app->make(PoliRepositoryInterface::class)));
        $this->app->bind(PoliController::class, fn($app) => new PoliController($app->make(PoliService::class)));
    }

    private function bindRegistrationInstitution(): void
    {
        $this->app->bind(RegistrationInstitutionRepositoryInterface::class, EloquentRegistrationInstitutionRepository::class);
        $this->app->bind(RegistrationInstitutionService::class, fn($app) => new RegistrationInstitutionService($app->make(RegistrationInstitutionRepositoryInterface::class)));
        $this->app->bind(RegistrationInstitutionController::class, fn($app) => new RegistrationInstitutionController($app->make(RegistrationInstitutionService::class)));
    }

    private function bindRoomType(): void
    {
        $this->app->bind(RoomTypeRepositoryInterface::class, EloquentRoomTypeRepository::class);
        $this->app->bind(RoomTypeService::class, fn($app) => new RoomTypeService($app->make(RoomTypeRepositoryInterface::class)));
        $this->app->bind(RoomTypeController::class, fn($app) => new RoomTypeController($app->make(RoomTypeService::class)));
    }

    private function bindDisease(): void
    {
        $this->app->bind(DiseaseRepositoryInterface::class, EloquentDiseaseRepository::class);
        $this->app->bind(DiseaseService::class, fn($app) => new DiseaseService($app->make(DiseaseRepositoryInterface::class)));
        $this->app->bind(DiseaseController::class, fn($app) => new DiseaseController($app->make(DiseaseService::class)));
    }
}
