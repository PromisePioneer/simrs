<?php

namespace App\Services\Inpatient\Admission\Interface;

interface InpatientAdmissionRepositoryInterface
{

    public function getInpatientAdmissions(array $filters = [], ?int $perPage = null): object;


    public function findById(string $id): object;

    public function store(array $data): object;


    public function update(array $data, string $id): object;


    public function destroy(string $id): object;
}
