<?php

namespace App\Services\Master\General\MedicalWork\Interface;

interface SpecializationRepositoryInterface
{

    public function getSpecializations(array $filters = [], ?int $perPage = null): ?object;

    public function findById(string $id): ?object;


    public function store(array $data = []): ?object;

    public function update(string $id, array $data = []): ?object;

    public function destroy(string $id): bool;

}
