<?php

namespace App\Services\Master\General\Patient;

use App\Actions\Patient\CreatePatient;
use App\Actions\Patient\CreatePatientAddress;
use App\Actions\Patient\CreatePatientPaymentMethods;
use App\Actions\Patient\UpdatePatient;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Throwable;

class PatientService
{
    private static int $perPage = 20;

    public function getPatients(Request $request, bool $queryOnly = false): Builder|LengthAwarePaginator
    {

        $search = $request->input('search');
        $query = patient::query();


        if ($queryOnly) {
            return $query;
        }

        if (!empty($search)) {
            $query = $query
                ->where('full_name', 'like', '%' . $search . '%')
                ->orWhere('phone', 'like', '%' . $search . '%')
                ->orWhere('email', 'like', '%' . $search . '%');
        }

        return $query->orderBy('full_name', 'DESC')->paginate(self::$perPage);
    }


    /**
     * @throws Throwable
     */
    public function store(PatientRequest $request): Patient
    {
        return DB::transaction(function () use ($request) {
            $patient = (new CreatePatient())->execute($request);
            (new CreatePatientPaymentMethods())->execute($patient);
            (new CreatePatientAddress())->execute($patient);
            return $patient;
        });
    }


    /**
     * @throws Throwable
     */
    public function update(PatientRequest $request, Patient $patient): Patient
    {
        return DB::transaction(function () use ($request, $patient) {
            return (new UpdatePatient())->execute($request, $patient);
        });
    }


}
