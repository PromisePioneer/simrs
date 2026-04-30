<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Repositories;

use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;
use Domains\Outpatient\Infrastructure\Persistence\Models\AppointmentModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;

class EloquentAppointmentRepository extends BaseEloquentRepository implements AppointmentRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new AppointmentModel());
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->with([
                'patient' => fn($q) => $q->withoutGlobalScope(TenantScope::class),
                'outpatientVisit', 'inpatientAdmission'])
            ->orderByDesc('date');

        $query = $this->applyFilters($query, $filters);

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findByVisitNumber(string $visitNumber): ?object
    {
        return $this->model->newQuery()
            ->with(['patient', 'outpatientVisit', 'inpatientAdmission'])
            ->where('visit_number', $visitNumber)
            ->first();
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->whereHas(
                'patient',
                fn($q) => $q->where('full_name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('kis_number', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('medical_record_number', 'like', '%' . $filters['search'] . '%')
            );
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['advanced_status'])) {
            $query->where('advanced_status', $filters['advanced_status']);
        }

        if (!empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('date', '<=', $filters['date_to']);
        }

        return $query;
    }
}
