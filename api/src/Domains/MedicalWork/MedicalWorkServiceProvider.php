<?php

declare(strict_types=1);

namespace Domains\MedicalWork;

use App\Models\Profession;
use App\Models\Specialization;
use App\Models\SubSpecialization;
use Domains\MedicalWork\Application\Services\DoctorScheduleService;
use Domains\MedicalWork\Application\Services\ProfessionService;
use Domains\MedicalWork\Application\Services\SpecializationService;
use Domains\MedicalWork\Application\Services\SubSpecializationService;
use Domains\MedicalWork\Domain\Repository\DoctorScheduleRepositoryInterface;
use Domains\MedicalWork\Domain\Repository\ProfessionRepositoryInterface;
use Domains\MedicalWork\Domain\Repository\SpecializationRepositoryInterface;
use Domains\MedicalWork\Domain\Repository\SubSpecializationRepositoryInterface;
use Domains\MedicalWork\Infrastructure\Persistence\Repositories\EloquentDoctorScheduleRepository;
use Domains\MedicalWork\Infrastructure\Persistence\Repositories\EloquentProfessionRepository;
use Domains\MedicalWork\Infrastructure\Persistence\Repositories\EloquentSpecializationRepository;
use Domains\MedicalWork\Infrastructure\Persistence\Repositories\EloquentSubSpecializationRepository;
use Domains\MedicalWork\Presentation\Controllers\DoctorScheduleController;
use Domains\MedicalWork\Presentation\Controllers\ProfessionController;
use Domains\MedicalWork\Presentation\Controllers\SpecializationController;
use Domains\MedicalWork\Presentation\Controllers\SubSpecializationController;
use Domains\MedicalWork\Presentation\Policies\ProfessionPolicy;
use Domains\MedicalWork\Presentation\Policies\SpecializationPolicy;
use Domains\MedicalWork\Presentation\Policies\SubSpecializationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class MedicalWorkServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProfessionRepositoryInterface::class, EloquentProfessionRepository::class);
        $this->app->bind(SpecializationRepositoryInterface::class, EloquentSpecializationRepository::class);
        $this->app->bind(SubSpecializationRepositoryInterface::class, EloquentSubSpecializationRepository::class);
        $this->app->bind(DoctorScheduleRepositoryInterface::class, EloquentDoctorScheduleRepository::class);

        $this->app->bind(ProfessionService::class,
            fn($app) => new ProfessionService($app->make(ProfessionRepositoryInterface::class)));
        $this->app->bind(SpecializationService::class,
            fn($app) => new SpecializationService($app->make(SpecializationRepositoryInterface::class)));
        $this->app->bind(SubSpecializationService::class,
            fn($app) => new SubSpecializationService($app->make(SubSpecializationRepositoryInterface::class)));
        $this->app->bind(DoctorScheduleService::class,
            fn($app) => new DoctorScheduleService($app->make(EloquentDoctorScheduleRepository::class)));

        $this->app->bind(ProfessionController::class,
            fn($app) => new ProfessionController($app->make(ProfessionService::class)));
        $this->app->bind(SpecializationController::class,
            fn($app) => new SpecializationController($app->make(SpecializationService::class)));
        $this->app->bind(SubSpecializationController::class,
            fn($app) => new SubSpecializationController($app->make(SubSpecializationService::class)));
        $this->app->bind(DoctorScheduleController::class,
            fn($app) => new DoctorScheduleController($app->make(DoctorScheduleService::class)));
    }

    public function boot(): void
    {
        Gate::policy(Profession::class,        ProfessionPolicy::class);
        Gate::policy(Specialization::class,    SpecializationPolicy::class);
        Gate::policy(SubSpecialization::class, SubSpecializationPolicy::class);
    }
}
