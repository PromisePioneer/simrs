<?php

namespace App\Services\OutpatientVisit\Interface;

interface OutpatientVisitRepositoryInterface
{
    public function getOutpatient(array $filters = [], ?int $perPage = null);

    public function store(array $data);

    public function update(array $data, string $id);

    public function destroy(string $id);

    public function appendProcedures(string $id, array $procedures): void;
    public function appendPrescriptions(string $id, array $prescriptions): void;
    public function appendDiagnoses(string $id, array $diagnoses): void;
    public function countPatientVisit($today, $yesterday);
}
