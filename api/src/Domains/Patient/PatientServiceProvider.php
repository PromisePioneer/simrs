<?php

declare(strict_types=1);

namespace Domains\Patient;

use Domains\Patient\Application\Handlers\DeletePatientHandler;
use Domains\Patient\Application\Handlers\RegisterPatientHandler;
use Domains\Patient\Application\Handlers\UpdatePatientHandler;
use Domains\Patient\Application\QueryHandlers\GetPatientEMRQueryHandler;
use Domains\Patient\Application\QueryHandlers\GetPatientsQueryHandler;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Domains\Patient\Infrastructure\Persistence\Repositories\EloquentPatientRepository;
use Domains\Patient\Infrastructure\Services\PatientFileUploadService;
use Domains\Patient\Presentation\Controllers\PatientController;
use Domains\Patient\Presentation\Policies\PatientPolicy;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PatientServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ── Repository binding ─────────────────────────────────────────────
        $this->app->bind(
            PatientRepositoryInterface::class,
            fn($app) => new EloquentPatientRepository(new PatientModel())
        );

        // ── Command Handlers ───────────────────────────────────────────────
        $this->app->bind(
            RegisterPatientHandler::class,
            fn($app) => new RegisterPatientHandler(
                repository: $app->make(PatientRepositoryInterface::class),
                dispatcher: $app->make(Dispatcher::class),
            )
        );

        $this->app->bind(
            UpdatePatientHandler::class,
            fn($app) => new UpdatePatientHandler(
                repository: $app->make(PatientRepositoryInterface::class),
                dispatcher: $app->make(Dispatcher::class),
            )
        );

        $this->app->bind(
            DeletePatientHandler::class,
            fn($app) => new DeletePatientHandler(
                repository: $app->make(PatientRepositoryInterface::class),
            )
        );

        // ── Query Handlers ─────────────────────────────────────────────────
        $this->app->bind(
            GetPatientsQueryHandler::class,
            fn($app) => new GetPatientsQueryHandler(
                repository: $app->make(PatientRepositoryInterface::class),
            )
        );

        $this->app->bind(
            GetPatientEMRQueryHandler::class,
            fn($app) => new GetPatientEMRQueryHandler(
                repository: $app->make(PatientRepositoryInterface::class),
            )
        );

        // ── Controller ─────────────────────────────────────────────────────
        $this->app->bind(
            PatientController::class,
            fn($app) => new PatientController(
                registerHandler:    $app->make(RegisterPatientHandler::class),
                updateHandler:      $app->make(UpdatePatientHandler::class),
                deleteHandler:      $app->make(DeletePatientHandler::class),
                getPatientsHandler: $app->make(GetPatientsQueryHandler::class),
                getEMRHandler:      $app->make(GetPatientEMRQueryHandler::class),
                fileUpload:         $app->make(PatientFileUploadService::class),
            )
        );
    }

    public function boot(): void
    {
        Gate::policy(PatientModel::class, PatientPolicy::class);
    }
}
