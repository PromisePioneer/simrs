<?php

declare(strict_types=1);

namespace Domains\IAM;

use App\Models\User as EloquentUser;
use Domains\IAM\Application\Handlers\CreateUserHandler;
use Domains\IAM\Application\Handlers\DeleteUserHandler;
use Domains\IAM\Application\Handlers\UpdateUserHandler;
use Domains\IAM\Application\QueryHandlers\GetUsersQueryHandler;
use Domains\IAM\Application\Services\DegreeService;
use Domains\IAM\Application\Services\DepartmentService;
use Domains\IAM\Application\Services\ModuleService;
use Domains\IAM\Application\Services\PaymentMethodTypeService;
use Domains\IAM\Application\Services\PermissionService;
use Domains\IAM\Application\Services\PoliService;
use Domains\IAM\Application\Services\RegistrationInstitutionService;
use Domains\IAM\Application\Services\RoleService;
use Domains\IAM\Application\Services\RoomTypeService;
use Domains\IAM\Domain\Repository\DegreeRepositoryInterface;
use Domains\IAM\Domain\Repository\DepartmentRepositoryInterface;
use Domains\IAM\Domain\Repository\ModuleRepositoryInterface;
use Domains\IAM\Domain\Repository\PaymentMethodTypeRepositoryInterface;
use Domains\IAM\Domain\Repository\PermissionRepositoryInterface;
use Domains\IAM\Domain\Repository\PoliRepositoryInterface;
use Domains\IAM\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\IAM\Domain\Repository\RoleRepositoryInterface;
use Domains\IAM\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\DegreeModel;
use Domains\IAM\Infrastructure\Persistence\Models\DepartmentModel;
use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\IAM\Infrastructure\Persistence\Models\PaymentMethodTypeModel;
use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use Domains\IAM\Infrastructure\Persistence\Models\PoliModel;
use Domains\IAM\Infrastructure\Persistence\Models\RegistrationInstitutionModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoomTypeModel;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentDegreeRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentDepartmentRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentModuleRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentPaymentMethodTypeRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentPermissionRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentPoliRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentRegistrationInstitutionRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentRoleRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentRoomTypeRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentUserRepository;
use Domains\IAM\Infrastructure\Services\PlanLimitService;
use Domains\IAM\Infrastructure\Services\UserFileUploadService;
use Domains\IAM\Presentation\Controllers\DegreeController;
use Domains\IAM\Presentation\Controllers\DepartmentController;
use Domains\IAM\Presentation\Controllers\ModuleController;
use Domains\IAM\Presentation\Controllers\PaymentMethodTypeController;
use Domains\IAM\Presentation\Controllers\PermissionController;
use Domains\IAM\Presentation\Controllers\PoliController;
use Domains\IAM\Presentation\Controllers\RegistrationInstitutionController;
use Domains\IAM\Presentation\Controllers\RoomTypeController;
use Domains\IAM\Presentation\Controllers\UserController;
use Domains\IAM\Presentation\Policies\DegreePolicy;
use Domains\IAM\Presentation\Policies\DepartmentPolicy;
use Domains\IAM\Presentation\Policies\PaymentMethodTypePolicy;
use Domains\IAM\Presentation\Policies\PermissionPolicy;
use Domains\IAM\Presentation\Policies\PoliPolicy;
use Domains\IAM\Presentation\Policies\RegistrationInstitutionPolicy;
use Domains\IAM\Presentation\Policies\RolePolicy;
use Domains\IAM\Presentation\Policies\RoomTypePolicy;
use Domains\IAM\Presentation\Policies\UserPolicy;
use Illuminate\Contracts\Events\Dispatcher;
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
        $this->bindUser();
        $this->bindRole();
        $this->bindPaymentMethodType();
        $this->bindPermission();
        $this->bindModule();
    }

    public function boot(): void
    {
        Gate::policy(DegreeModel::class, DegreePolicy::class);
        Gate::policy(DepartmentModel::class, DepartmentPolicy::class);
        Gate::policy(PoliModel::class, PoliPolicy::class);
        Gate::policy(RegistrationInstitutionModel::class, RegistrationInstitutionPolicy::class);
        Gate::policy(RoomTypeModel::class, RoomTypePolicy::class);
        Gate::policy(EloquentUser::class, UserPolicy::class);
        Gate::policy(RoleModel::class, RolePolicy::class);
        Gate::policy(PaymentMethodTypeModel::class, PaymentMethodTypePolicy::class);
        Gate::policy(PermissionModel::class, PermissionPolicy::class);
        Gate::policy(ModuleModel::class, \Domains\IAM\Presentation\Policies\ModulePolicy::class);
    }

    // ── User (Full DDD) ───────────────────────────────────────────────────────

    private function bindUser(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);

        $this->app->bind(
            CreateUserHandler::class,
            fn($app) => new CreateUserHandler(
                repository: $app->make(UserRepositoryInterface::class),
                planLimitService: $app->make(PlanLimitService::class),
                dispatcher: $app->make(Dispatcher::class),
            )
        );

        $this->app->bind(
            UpdateUserHandler::class,
            fn($app) => new UpdateUserHandler(
                repository: $app->make(UserRepositoryInterface::class),
                dispatcher: $app->make(Dispatcher::class),
            )
        );

        $this->app->bind(
            DeleteUserHandler::class,
            fn($app) => new DeleteUserHandler(
                repository: $app->make(UserRepositoryInterface::class),
            )
        );

        $this->app->bind(
            GetUsersQueryHandler::class,
            fn($app) => new GetUsersQueryHandler(
                repository: $app->make(UserRepositoryInterface::class),
            )
        );

        $this->app->bind(
            UserController::class,
            fn($app) => new UserController(
                createHandler:   $app->make(CreateUserHandler::class),
                updateHandler:   $app->make(UpdateUserHandler::class),
                deleteHandler:   $app->make(DeleteUserHandler::class),
                getUsersHandler: $app->make(GetUsersQueryHandler::class),
                fileUpload:      $app->make(UserFileUploadService::class),
            )
        );
    }

    // ── CRUD simple (Lightweight) ─────────────────────────────────────────────

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

    private function bindRole(): void
    {
        $this->app->bind(RoleRepositoryInterface::class, EloquentRoleRepository::class);
        $this->app->bind(RoleService::class, fn($app) => new RoleService($app->make(RoleRepositoryInterface::class)));
    }

    private function bindPaymentMethodType(): void
    {
        $this->app->bind(PaymentMethodTypeRepositoryInterface::class, EloquentPaymentMethodTypeRepository::class);
        $this->app->bind(PaymentMethodTypeService::class, fn($app) => new PaymentMethodTypeService($app->make(PaymentMethodTypeRepositoryInterface::class)));
        $this->app->bind(PaymentMethodTypeController::class, fn($app) => new PaymentMethodTypeController($app->make(PaymentMethodTypeService::class)));
    }

    private function bindPermission(): void
    {
        $this->app->bind(PermissionRepositoryInterface::class, EloquentPermissionRepository::class);
        $this->app->bind(PermissionService::class, fn($app) => new PermissionService($app->make(PermissionRepositoryInterface::class)));
        $this->app->bind(PermissionController::class, fn($app) => new PermissionController($app->make(PermissionService::class)));
    }

    private function bindModule(): void
    {
        $this->app->bind(ModuleRepositoryInterface::class,
            fn() => new EloquentModuleRepository(new ModuleModel()));
        $this->app->bind(ModuleService::class,
            fn($app) => new ModuleService(
                moduleRepository:     $app->make(ModuleRepositoryInterface::class),
                permissionRepository: $app->make(PermissionRepositoryInterface::class),
            ));
        $this->app->bind(ModuleController::class,
            fn($app) => new ModuleController($app->make(ModuleService::class)));
    }
}
