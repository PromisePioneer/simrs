<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Repositories;

use App\Services\Tenant\TenantContext;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Domains\Outpatient\Domain\Repository\OutpatientVisitRepositoryInterface;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Outpatient\Infrastructure\Persistence\Models\QueueModel;
use Illuminate\Support\Facades\DB;

readonly class EloquentOutpatientVisitRepository implements OutpatientVisitRepositoryInterface
{
    public function __construct(private readonly OutpatientVisitModel $model)
    {
    }

    public function findAll(array $filters = [], ?int $perPage = null, ?string $status = 'waiting'): object
    {
        $query = $this->model->newQuery()
            ->with([
                'patient' => fn($q) => $q->withoutGlobalScopes(),
                'doctor',
                'poli',
                'vitalSign',
            ])
            ->where('status', $status ?? 'waiting')
            ->orderByDesc('date');

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('patient', fn($p) => $p->where('name', 'like', '%' . $filters['search'] . '%'))
                    ->orWhereHas('doctor', fn($d) => $d->where('name', 'like', '%' . $filters['search'] . '%'));
            });
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->newQuery()
            ->with([
                'patient' => fn($q) => $q->withoutGlobalScopes(),
                'doctor',
                'poli',
                'vitalSign',
                'companion',
                'allergy',
                'medicalHistory',
                'familyMedicalHistory',
                'psychosocial',
                'medicationHistory',
                'diagnoses',
                'procedures',
                'prescriptions.medicine',
            ])
            ->findOrFail($id);
    }

    public function store(array $data): object
    {
        return DB::transaction(function () use ($data) {
            $data['tenant_id'] = TenantContext::getId();

            // Only pass outpatient_visits table columns to create
            $visitData = array_intersect_key($data, array_flip([
                'tenant_id', 'type', 'referred_hospital', 'referred_doctor',
                'patient_id', 'doctor_id', 'poli_id', 'date', 'complain', 'status',
            ]));
            $visit = $this->model->newQuery()->create($visitData);

            $visit->vitalSign()->updateOrCreate(
                ['outpatient_visit_id' => $visit->id],
                array_merge(['patient_id' => $data['patient_id']], array_intersect_key($data, array_flip([
                    'height', 'weight', 'temperature', 'pulse_rate', 'respiratory_frequency',
                    'systolic', 'diastolic', 'abdominal_circumference', 'blood_sugar', 'oxygen_saturation',
                ])))
            );

            $companionData = array_filter([
                'full_name' => $data['companion_name'] ?? null,
                'phone'     => $data['companion_phone'] ?? null,
                'address'   => $data['companion_address'] ?? null,
            ]);

            if (!empty($companionData)) {
                $visit->companion()->updateOrCreate(
                    ['outpatient_visit_id' => $visit->id],
                    $companionData
                );
            }

            // Anamnesis: allergies, medical history, family history, psychosocial
            if (!empty($data['patient_allergy'])) {
                $visit->allergy()->updateOrCreate(
                    ['outpatient_visit_id' => $visit->id],
                    ['patient_allergy' => $data['patient_allergy']]
                );
            }

            if (!empty($data['patient_medical_history'])) {
                $visit->medicalHistory()->updateOrCreate(
                    ['outpatient_visit_id' => $visit->id],
                    ['medical_history' => $data['patient_medical_history']]
                );
            }

            if (!empty($data['patient_family_medical_history'])) {
                $visit->familyMedicalHistory()->updateOrCreate(
                    ['outpatient_visit_id' => $visit->id],
                    ['family_medical_history' => $data['patient_family_medical_history']]
                );
            }

            $visit->psychosocial()->updateOrCreate(
                ['outpatient_visit_id' => $visit->id],
                array_filter([
                    'psychology_condition' => $data['psychology_condition'] ?? null,
                    'marital_status'       => $data['marital_status'] ?? null,
                    'live_with'            => $data['live_with'] ?? null,
                    'job'                  => $data['job'] ?? null,
                ])
            );

            if (!empty($data['patient_medication_history'])) {
                $visit->medicationHistory()->updateOrCreate(
                    ['outpatient_visit_id' => $visit->id],
                    ['medication_history' => $data['patient_medication_history']]
                );
            }

            // Generate queue
            $poli = PoliModel::find($data['poli_id']);
            $tenantId = TenantContext::getId();

            $lastQueue = QueueModel::where('tenant_id', $tenantId)
                ->where('service_unit', $poli?->name)
                ->whereDate('queue_date', now()->toDateString())
                ->orderByDesc('queue_number')
                ->lockForUpdate()
                ->first();

            $nextNumber = $lastQueue ? ((int)substr($lastQueue->queue_number, -3)) + 1 : 1;
            $queueNumber = strtoupper($poli?->name ?? 'GEN') . '-' . str_pad((string)$nextNumber, 3, '0', STR_PAD_LEFT);

            QueueModel::create([
                'tenant_id' => $tenantId,
                'outpatient_visit_id' => $visit->id,
                'queue_number' => $queueNumber,
                'service_unit' => $poli?->name,
                'queue_date' => now(),
                'status' => 'waiting',
            ]);

            return $visit;
        });
    }

    public function update(array $data, string $id): object
    {
        return DB::transaction(function () use ($data, $id) {
            $record = $this->findById($id);

            $visitData = array_intersect_key($data, array_flip([
                'type', 'referred_hospital', 'referred_doctor',
                'patient_id', 'doctor_id', 'poli_id', 'date', 'complain', 'status',
            ]));
            $record->fill($visitData)->save();

            $record->vitalSign()->updateOrCreate(
                ['outpatient_visit_id' => $record->id],
                array_merge(['patient_id' => $data['patient_id'] ?? $record->patient_id], array_intersect_key($data, array_flip([
                    'height', 'weight', 'temperature', 'pulse_rate', 'respiratory_frequency',
                    'systolic', 'diastolic', 'abdominal_circumference', 'blood_sugar', 'oxygen_saturation',
                ])))
            );

            $companionData = array_filter([
                'full_name' => $data['companion_name'] ?? null,
                'phone'     => $data['companion_phone'] ?? null,
                'address'   => $data['companion_address'] ?? null,
            ]);

            if (!empty($companionData)) {
                $record->companion()->updateOrCreate(
                    ['outpatient_visit_id' => $record->id],
                    $companionData
                );
            }

            // Anamnesis: allergies, medical history, family history, psychosocial
            if (!empty($data['patient_allergy'])) {
                $record->allergy()->updateOrCreate(
                    ['outpatient_visit_id' => $record->id],
                    ['patient_allergy' => $data['patient_allergy']]
                );
            }

            if (!empty($data['patient_medical_history'])) {
                $record->medicalHistory()->updateOrCreate(
                    ['outpatient_visit_id' => $record->id],
                    ['medical_history' => $data['patient_medical_history']]
                );
            }

            if (!empty($data['patient_family_medical_history'])) {
                $record->familyMedicalHistory()->updateOrCreate(
                    ['outpatient_visit_id' => $record->id],
                    ['family_medical_history' => $data['patient_family_medical_history']]
                );
            }

            $record->psychosocial()->updateOrCreate(
                ['outpatient_visit_id' => $record->id],
                array_filter([
                    'psychology_condition' => $data['psychology_condition'] ?? null,
                    'marital_status'       => $data['marital_status'] ?? null,
                    'live_with'            => $data['live_with'] ?? null,
                    'job'                  => $data['job'] ?? null,
                ])
            );

            if (!empty($data['patient_medication_history'])) {
                $record->medicationHistory()->updateOrCreate(
                    ['outpatient_visit_id' => $record->id],
                    ['medication_history' => $data['patient_medication_history']]
                );
            }

            return $record->fresh();
        });
    }

    public function delete(string $id): bool
    {
        return (bool)$this->model->newQuery()->findOrFail($id)->delete();
    }

    public function changeStatus(string $id, string $status): void
    {
        $this->model->newQuery()->where('id', $id)->update(['status' => $status]);
    }

    public function appendDiagnoses(string $id, array $diagnoses): void
    {
        $this->findById($id)->diagnoses()->createMany($diagnoses);
    }

    public function appendProcedures(string $id, array $procedures): void
    {
        $this->findById($id)->procedures()->createMany($procedures);
    }

    public function countPatientVisit(string $today, string $yesterday): array
    {
        $todayCount = $this->model->whereDate('date', $today)->count();
        $yesterdayCount = $this->model->whereDate('date', $yesterday)->count();
        return ['total_today' => $todayCount, 'difference' => $todayCount - $yesterdayCount];
    }

    public function getPatientBasedOnStatusCount(string $today): array
    {
        $base = $this->model->whereDate('date', $today);
        return [
            'waiting' => (clone $base)->where('status', 'waiting')->count(),
            'in_progress' => (clone $base)->where('status', 'in-progress')->count(),
            'completed' => (clone $base)->where('status', 'completed')->count(),
        ];
    }

    // BaseRepositoryInterface stubs
    public function findAll_(array $filters = [], ?int $perPage = null): object
    {
        return $this->findAll($filters, $perPage);
    }
}
