<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface MedicineCategoryRepositoryInterface
{
    public function getCategories(array $filters = [], ?int $perPage = null): ?object;
    public function findById(string $id): ?object;
    public function store(array $data): ?object;
    public function update(string $id, array $data): ?object;
    public function destroy(string $id): ?object;
}
