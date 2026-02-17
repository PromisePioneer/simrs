<?php

namespace App\Services\Master\General\UserManagement\User\Interface;

interface UserRepositoryInterface
{
    public function getAll(array $filters = [], ?int $perPage = null, ?string $role = null);

    public function findById(string $id);

    public static function store(array $data = []): object;

    public function update(string $id, array $data = []): object;

    public function destroy(string $id): object;
}
