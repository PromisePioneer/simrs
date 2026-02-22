<?php

namespace App\Services\OutpatientVisit\Repository;

use App\Models\OutpatientVisit;
use App\Models\PatientVitalSign;
use App\Models\Queue;
use App\Services\Master\General\Poli\Repository\PoliRepository;
use App\Services\OutpatientVisit\Interface\OutpatientVisitRepositoryInterface;
use App\Services\Queue\Service\QueueService;
use App\Services\Tenant\TenantContext;
use Illuminate\Support\Facades\DB;
use Throwable;

class OutpatientVisitRepository implements OutpatientVisitRepositoryInterface
{
    protected OutpatientVisit $model;
    protected PatientVitalSign $patientVitalSignModel;
    protected QueueService $queueService;
    protected PoliRepository $poliRepository;

    public function __construct()
    {
        $this->model = new OutpatientVisit();
        $this->patientVitalSignModel = new PatientVitalSign();
        $this->queueService = new QueueService();
        $this->poliRepository = new PoliRepository();
    }

    public function getOutpatient(array $filters = [], ?int $perPage = null, $status = 'waiting'): ?object
    {
        $query = $this->model->with(['patient', 'doctor', 'poli'])->where('status', $status);

        if (!empty($filters['search'])) {
            $query->whereHas('patient', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('doctor', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('poli', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }


    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    /**
     * @throws Throwable
     */
    public function store(array $data): ?object
    {
        return DB::transaction(function () use ($data) {
            $tenantId = TenantContext::getId();
            $outpatientVisit = $this->model->create($data);
            $outpatientVisit->vitalSign()->updateOrCreate([
                'outpatient_visit_id' => $outpatientVisit->id,
                'height' => $data['height'],
                'patient_id' => $data['patient_id'],
                'weight' => $data['weight'],
                'temperature' => $data['temperature'],
                'pulse_rate' => $data['pulse_rate'],
                'respiratory_frequency' => $data['respiratory_frequency'],
                'systolic' => $data['systolic'],
                'diastolic' => $data['diastolic'],
                'abdominal_circumference' => $data['abdominal_circumference'],
                'blood_sugar' => $data['blood_sugar'],
                'oxygen_saturation' => $data['oxygen_saturation'],
            ]);


            $poli = $this->poliRepository->findById($data['poli_id']);

            Queue::create([
                'tenant_id' => TenantContext::getId(),
                'outpatient_visit_id' => $outpatientVisit->id,
                'queue_number' => $this->queueService->generate($tenantId, $poli->name),
                'service_unit' => $poli->name,
                'queue_date' => now(),
                'status' => $outpatientVisit->status,
            ]);

        });
    }


    public function update(array $data, string $id)
    {
        return $this->findById($id)
            ->fill($data)
            ->save($data)
            ->fresh();
    }


    public function destroy(string $id): int
    {
        return $this->model->destroy($id);
    }
}
