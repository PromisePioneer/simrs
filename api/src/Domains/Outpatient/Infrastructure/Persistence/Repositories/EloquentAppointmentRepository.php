<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Repositories;

use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;
use Domains\Outpatient\Infrastructure\Persistence\Models\AppointmentModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentAppointmentRepository extends BaseEloquentRepository implements AppointmentRepositoryInterface
{
    public function __construct() { parent::__construct(new AppointmentModel()); }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->whereHas('patient', fn($q) => $q->where('name', 'like', '%' . $filters['search'] . '%'));
        }
        if (!empty($filters['doctor_id'])) {
            $query->where('doctor_id', $filters['doctor_id']);
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()->with(['patient', 'doctor'])->orderByDesc('date');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
