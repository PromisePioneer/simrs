<?php

declare(strict_types=1);

namespace Domains\Clinical;

use App\Models\Prescription;
use Domains\Clinical\Application\Services\DiagnoseService;
use Domains\Clinical\Application\Services\PrescriptionService;
use Domains\Clinical\Domain\Repository\DiagnoseRepositoryInterface;
use Domains\Clinical\Domain\Repository\PrescriptionRepositoryInterface;
use Domains\Clinical\Infrastructure\Persistence\Models\DiagnoseModel;
use Domains\Clinical\Infrastructure\Persistence\Repositories\EloquentDiagnoseRepository;
use Domains\Clinical\Infrastructure\Persistence\Repositories\EloquentPrescriptionRepository;
use Domains\Clinical\Presentation\Controllers\DiagnoseController;
use Domains\Clinical\Presentation\Controllers\PrescriptionController;
use Domains\Clinical\Presentation\Policies\PrescriptionPolicy;
use Domains\Outpatient\Domain\Repository\OutpatientVisitRepositoryInterface;
use Domains\Outpatient\Domain\Repository\QueueRepositoryInterface;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class ClinicalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DiagnoseRepositoryInterface::class,
            fn() => new EloquentDiagnoseRepository(new DiagnoseModel()));
        $this->app->bind(PrescriptionRepositoryInterface::class, EloquentPrescriptionRepository::class);

        $this->app->bind(DiagnoseService::class, fn($app) => new DiagnoseService(
            visitRepo:        $app->make(OutpatientVisitRepositoryInterface::class),
            queueRepo:        $app->make(QueueRepositoryInterface::class),
            prescriptionRepo: $app->make(PrescriptionRepositoryInterface::class),
        ));

        $this->app->bind(PrescriptionService::class,
            fn($app) => new PrescriptionService($app->make(PrescriptionRepositoryInterface::class)));

        $this->app->bind(DiagnoseController::class,
            fn($app) => new DiagnoseController($app->make(DiagnoseService::class)));
        $this->app->bind(PrescriptionController::class,
            fn($app) => new PrescriptionController($app->make(PrescriptionService::class)));
    }

    public function boot(): void
    {
        Gate::policy(Prescription::class, PrescriptionPolicy::class);
    }
}
