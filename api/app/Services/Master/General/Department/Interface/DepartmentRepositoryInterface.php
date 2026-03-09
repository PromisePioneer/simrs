<?php

namespace App\Services\Master\General\Department\Interface;

interface DepartmentRepositoryInterface
{
    public function getDepartments(array $filters = [], ?int $perPage = null): object;


    public function findById(string $id): object;


    public function store(array $data): object;


    public function update(string $id, array $data): object;


    public function destroy(string $id): object;

}
