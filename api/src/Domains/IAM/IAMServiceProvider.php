<?php

declare(strict_types=1);

namespace Domains\IAM;

use App\Models\User as EloquentUser;
use Domains\IAM\Application\Handlers\CreateUserHandler;
use Domains\IAM\Application\Handlers\DeleteUserHandler;
use Domains\IAM\Application\Handlers\UpdateUserHandler;
use Domains\IAM\Application\QueryHandlers\GetUsersQueryHandler;
use Domains\IAM\Application\Services\ModuleService;
use Domains\IAM\Application\Services\RoleService;
use Domains\IAM\Domain\Repository\ModuleRepositoryInterface;
use Domains\IAM\Domain\Repository\PermissionRepositoryInterface;
use Domains\IAM\Domain\Repository\RoleRepositoryInterface;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentModuleRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentPermissionRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentRoleRepository;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentUserRepository;
use Domains\IAM\Infrastructure\Services\PlanLimitService;
use Domains\IAM\Infrastructure\Services\UserFileUploadService;
use Domains\IAM\Presentation\Controllers\ModuleController;
use Domains\IAM\Presentation\Controllers\PermissionController;
use Domains\IAM\Presentation\Controllers\UserController;
use Domains\IAM\Presentation\Policies\ModulePolicy;
use Domains\IAM\Presentation\Policies\PermissionPolicy;
use Domains\IAM\Presentation\Policies\RolePolicy;
use Domains\MasterData\Application\Services\DegreeService;
use Domains\MasterData\Application\Services\DepartmentService;
use Domains\MasterData\Application\Services\PaymentMethodTypeService;
use Domains\MasterData\Application\Services\PermissionService;
use Domains\MasterData\Application\Services\PoliService;
use Domains\MasterData\Application\Services\RegistrationInstitutionService;
use Domains\MasterData\Application\Services\RoomTypeService;
use Domains\MasterData\Domain\Repository\DegreeRepositoryInterface;
use Domains\MasterData\Domain\Repository\DepartmentRepositoryInterface;
use Domains\MasterData\Domain\Repository\PaymentMethodTypeRepositoryInterface;
use Domains\MasterData\Domain\Repository\PoliRepositoryInterface;
use Domains\MasterData\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\MasterData\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\DegreeModel;
use Domains\MasterData\Infrastructure\Persistent\Models\DepartmentModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PaymentMethodTypeModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RegistrationInstitutionModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentDegreeRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentDepartmentRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentPaymentMethodTypeRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentPoliRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentRegistrationInstitutionRepository;
use Domains\MasterData\Infrastructure\Persistent\Repositories\EloquentRoomTypeRepository;
use Domains\MasterData\Persentation\Controllers\DegreeController;
use Domains\MasterData\Persentation\Controllers\DepartmentController;
use Domains\MasterData\Persentation\Controllers\PaymentMethodTypeController;
use Domains\MasterData\Persentation\Controllers\PoliController;
use Domains\MasterData\Persentation\Controllers\RegistrationInstitutionController;
use Domains\MasterData\Persentation\Controllers\RoomTypeController;
use Domains\MasterData\Persentation\Policies\DegreePolicy;
use Domains\MasterData\Persentation\Policies\DepartmentPolicy;
use Domains\MasterData\Persentation\Policies\PaymentMethodTypePolicy;
use Domains\MasterData\Persentation\Policies\PoliPolicy;
use Domains\MasterData\Persentation\Policies\RegistrationInstitutionPolicy;
use Domains\MasterData\Persentation\Policies\RoomTypePolicy;
use Domains\MasterData\Persentation\Policies\UserPolicy;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class IAMServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->bindUser();
        $this->bindRole();
        $this->bindPermission();
        $this->bindModule();
    }

    public function boot(): void
    {
        Gate::policy(EloquentUser::class, UserPolicy::class);
        Gate::policy(RoleModel::class, RolePolicy::class);
        Gate::policy(PermissionModel::class, PermissionPolicy::class);
        Gate::policy(ModuleModel::class, ModulePolicy::class);
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
                createHandler: $app->make(CreateUserHandler::class),
                updateHandler: $app->make(UpdateUserHandler::class),
                deleteHandler: $app->make(DeleteUserHandler::class),
                getUsersHandler: $app->make(GetUsersQueryHandler::class),
                fileUpload: $app->make(UserFileUploadService::class),
            )
        );
    }

    // ── CRUD simple (Lightweight) ─────────────────────────────────────────────
    private function bindModule(): void
    {
        $this->app->bind(ModuleRepositoryInterface::class,
            fn() => new EloquentModuleRepository(new ModuleModel()));
        $this->app->bind(ModuleService::class,
            fn($app) => new ModuleService(
                moduleRepository: $app->make(ModuleRepositoryInterface::class),
                permissionRepository: $app->make(PermissionRepositoryInterface::class),
            ));
        $this->app->bind(ModuleController::class,
            fn($app) => new ModuleController($app->make(ModuleService::class)));
    }

    private function bindRole(): void
    {
        $this->app->bind(RoleRepositoryInterface::class, EloquentRoleRepository::class);
        $this->app->bind(RoleService::class, fn($app) => new RoleService($app->make(RoleRepositoryInterface::class)));
    }


    private function bindPermission(): void
    {
        $this->app->bind(PermissionRepositoryInterface::class, EloquentPermissionRepository::class);
        $this->app->bind(PermissionService::class, fn($app) => new PermissionService($app->make(PermissionRepositoryInterface::class)));
        $this->app->bind(PermissionController::class, fn($app) => new PermissionController($app->make(PermissionService::class)));
    }


}
