<?php

declare(strict_types=1);

namespace Domains\Outpatient;

use App\Models\OutpatientVisit;
use Domains\Outpatient\Application\Services\AppointmentService;
use Domains\Outpatient\Application\Services\OutpatientVisitService;
use Domains\Outpatient\Application\Services\QueueService;
use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;
use Domains\Outpatient\Domain\Repository\OutpatientVisitRepositoryInterface;
use Domains\Outpatient\Domain\Repository\QueueRepositoryInterface;
use Domains\Outpatient\Infrastructure\Persistence\Models\AppointmentModel;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Outpatient\Infrastructure\Persistence\Models\QueueModel;
use Domains\Outpatient\Infrastructure\Persistence\Repositories\EloquentAppointmentRepository;
use Domains\Outpatient\Infrastructure\Persistence\Repositories\EloquentOutpatientVisitRepository;
use Domains\Outpatient\Infrastructure\Persistence\Repositories\EloquentQueueRepository;
use Domains\Outpatient\Presentation\Controllers\AppointmentController;
use Domains\Outpatient\Presentation\Controllers\OutpatientDashboardController;
use Domains\Outpatient\Presentation\Controllers\OutpatientVisitController;
use Domains\Outpatient\Presentation\Controllers\QueueController;
use Domains\Outpatient\Presentation\Policies\OutpatientVisitPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class OutpatientServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(OutpatientVisitRepositoryInterface::class,
            fn() => new EloquentOutpatientVisitRepository(new OutpatientVisitModel()));
        $this->app->bind(QueueRepositoryInterface::class, EloquentQueueRepository::class);
        $this->app->bind(AppointmentRepositoryInterface::class, EloquentAppointmentRepository::class);

        $this->app->bind(OutpatientVisitService::class,
            fn($app) => new OutpatientVisitService($app->make(OutpatientVisitRepositoryInterface::class)));
        $this->app->bind(QueueService::class,
            fn($app) => new QueueService($app->make(QueueRepositoryInterface::class)));
        $this->app->bind(AppointmentService::class,
            fn($app) => new AppointmentService($app->make(AppointmentRepositoryInterface::class)));

        $this->app->bind(OutpatientVisitController::class,
            fn($app) => new OutpatientVisitController($app->make(OutpatientVisitService::class)));
        $this->app->bind(QueueController::class,
            fn($app) => new QueueController($app->make(QueueService::class)));
        $this->app->bind(AppointmentController::class,
            fn($app) => new AppointmentController($app->make(AppointmentService::class)));
        $this->app->bind(OutpatientDashboardController::class,
            fn($app) => new OutpatientDashboardController($app->make(OutpatientVisitService::class)));
    }

    public function boot(): void
    {
        Gate::policy(OutpatientVisit::class, OutpatientVisitPolicy::class);
    }
}
