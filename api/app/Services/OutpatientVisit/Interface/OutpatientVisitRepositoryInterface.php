<?php

namespace App\Services\OutpatientVisit\Interface;

interface OutpatientVisitRepositoryInterface
{
    public function getOutpatient(array $filters = [], ?int $perPage = null);

    public function store(array $data);

    public function update(array $data, string $id);

    public function destroy(string $id);
}
