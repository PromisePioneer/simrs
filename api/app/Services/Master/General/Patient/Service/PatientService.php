<?php

namespace App\Services\Master\General\Patient\Service;

use App\Actions\Patient\UpdatePatient;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Models\PatientPaymentMethod;
use App\Services\Global\FileUploadService;
use App\Services\Master\General\Patient\Repository\PatientRepository;
use App\Traits\Patient\PatientManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Throwable;

class PatientService
{

    use PatientManager;


    protected PatientRepository $patientRepository;
    protected FileUploadService $fileUploadService;

    public function __construct()
    {
        $this->patientRepository = new PatientRepository();
        $this->fileUploadService = new FileUploadService();
    }

    public function getPatients(Request $request): ?object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->patientRepository->getAll($filters, $perPage);
    }


    /**
     * @throws Throwable
     */
    public function store(PatientRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $data['tenant_id'] = $request->user()->tenant_id ?? $request->tenant_id;
            $data['medical_record_number'] = $this->generateMedicalRecordNumber();
            $data['date_of_consultation'] = $request->date_of_consultation ?? now()->format('Y-m-d');
            $data['profile_picture'] = $this->fileUploadService->handle(
                'profile_picture',
                'patients/profile_picture',
                $request
            );

            $patient = $this->patientRepository->store($data);
            $patient->addresses()->createMany($data['addresses']);
            $patient->paymentMethods()->createMany($data['payment_methods']);
        });
    }


    /**
     * @throws Throwable
     */
    public function update(PatientRequest $request, Patient $patient)
    {
        return DB::transaction(function () use ($request, $patient) {
            $data = $request->validated();
            $data['tenant_id'] = $request->user()->tenant_id ?? $request->tenant_id;
            $data['date_of_consultation'] = $request->date_of_consultation ?? now()->format('Y-m-d');
            $data['profile_picture'] = $this->fileUploadService->handle(
                'profile_picture',
                'patients/profile_picture',
                $request
            );
            $patient = $this->patientRepository->update($patient->id, $data);

            $patient->addresses()->delete();
            $patient->addresses()->createMany($data['addresses']);

            // 3. Refresh Payment Methods
            $patient->paymentMethods()->delete();
            $patient->paymentMethods()->createMany($data['payment_methods']);
        });
    }


}
