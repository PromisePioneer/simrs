<?php

declare(strict_types=1);

namespace Domains\Inpatient;

use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineStockMovementModel;
use Domains\Pharmacy\Infrastructure\Persistence\Repositories\EloquentMedicineStockMovementRepository;
use Domains\Facility\Domain\Repository\BedRepositoryInterface;
use Domains\Inpatient\Application\Services\BedAssignmentService;
use Domains\Inpatient\Application\Services\InpatientAdmissionService;
use Domains\Inpatient\Application\Services\InpatientDailyCareService;
use Domains\Inpatient\Application\Services\InpatientDailyMedicationService;
use Domains\Inpatient\Domain\Repository\BedAssignmentRepositoryInterface;
use Domains\Inpatient\Domain\Repository\InpatientAdmissionRepositoryInterface;
use Domains\Inpatient\Domain\Repository\InpatientDailyCareRepositoryInterface;
use Domains\Inpatient\Domain\Repository\InpatientDailyMedicationRepositoryInterface;
use Domains\Inpatient\Domain\Repository\InpatientVitalSignRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\BedAssignmentModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyCareModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyMedicationModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientVitalSignModel;
use Domains\Inpatient\Infrastructure\Persistence\Repositories\EloquentBedAssignmentRepository;
use Domains\Inpatient\Infrastructure\Persistence\Repositories\EloquentInpatientAdmissionRepository;
use Domains\Inpatient\Infrastructure\Persistence\Repositories\EloquentInpatientDailyCareRepository;
use Domains\Inpatient\Infrastructure\Persistence\Repositories\EloquentInpatientDailyMedicationRepository;
use Domains\Inpatient\Infrastructure\Persistence\Repositories\EloquentInpatientVitalSignRepository;
use Domains\Inpatient\Presentation\Controllers\BedAssignmentController;
use Domains\Inpatient\Presentation\Controllers\InpatientAdmissionController;
use Domains\Inpatient\Presentation\Controllers\InpatientDailyCareController;
use Domains\Inpatient\Presentation\Controllers\InpatientDailyMedicationController;
use Domains\Inpatient\Presentation\Policies\InpatientAdmissionPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class InpatientServiceProvider extends ServiceProvider
{
    public function register(): void
    {

        $this->app->bind(InpatientDailyMedicationRepositoryInterface::class,
            fn() => new EloquentInpatientDailyMedicationRepository(
                new InpatientDailyMedicationModel(),
                new EloquentMedicineStockMovementRepository(new MedicineStockMovementModel()),
            )
        );

        $this->app->bind(InpatientDailyMedicationService::class,
            fn($app) => new InpatientDailyMedicationService(
                $app->make(InpatientDailyMedicationRepositoryInterface::class),
            )
        );

        $this->app->bind(InpatientDailyMedicationController::class,
            fn($app) => new InpatientDailyMedicationController(
                $app->make(InpatientDailyMedicationService::class),
            )
        );


        $this->app->bind(InpatientDailyCareRepositoryInterface::class,
            fn() => new EloquentInpatientDailyCareRepository(new InpatientDailyCareModel())
        );

        $this->app->bind(InpatientDailyCareService::class,
            fn($app) => new InpatientDailyCareService(
                $app->make(InpatientDailyCareRepositoryInterface::class),
            )
        );

        $this->app->bind(InpatientDailyCareController::class,
            fn($app) => new InpatientDailyCareController(
                $app->make(InpatientDailyCareService::class),
            )
        );

        // Repositories
        $this->app->bind(InpatientAdmissionRepositoryInterface::class,
            fn() => new EloquentInpatientAdmissionRepository(new InpatientAdmissionModel()));
        $this->app->bind(BedAssignmentRepositoryInterface::class,
            fn() => new EloquentBedAssignmentRepository(new BedAssignmentModel()));
        $this->app->bind(InpatientVitalSignRepositoryInterface::class,
            fn() => new EloquentInpatientVitalSignRepository(new InpatientVitalSignModel()));

        // Services
        $this->app->bind(InpatientAdmissionService::class,
            fn($app) => new InpatientAdmissionService(
                admissionRepository: $app->make(InpatientAdmissionRepositoryInterface::class),
                bedRepository: $app->make(BedRepositoryInterface::class),
                bedAssignmentRepository: $app->make(BedAssignmentRepositoryInterface::class),
                vitalSignRepository: $app->make(InpatientVitalSignRepositoryInterface::class),
            ));
        $this->app->bind(BedAssignmentService::class,
            fn($app) => new BedAssignmentService($app->make(BedAssignmentRepositoryInterface::class)));

        // Controllers
        $this->app->bind(InpatientAdmissionController::class,
            fn($app) => new InpatientAdmissionController($app->make(InpatientAdmissionService::class)));
        $this->app->bind(BedAssignmentController::class,
            fn($app) => new BedAssignmentController($app->make(BedAssignmentService::class)));
    }

    public function boot(): void
    {
        Gate::policy(InpatientAdmissionModel::class, InpatientAdmissionPolicy::class);
    }
}
