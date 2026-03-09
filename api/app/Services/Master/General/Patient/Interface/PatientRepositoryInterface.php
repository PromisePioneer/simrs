<?php

namespace App\Services\Master\General\Patient\Interface;

interface PatientRepositoryInterface
{
    public function baseQuery(array $filters = []): ?object;

    public function getAll(array $filters = [], ?int $perPage = null): ?object;

    public function findById(string $id): object;

    public function store($data): object;

    public function update(string $id, array $data);

    public function getPatientWithEMR(array $filters = [], ?int $perPage = null): ?object;
}
