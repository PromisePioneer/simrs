<?php

declare(strict_types=1);

namespace Domains\Shared\Domain\Repository;

/**
 * Base Repository Interface.
 *
 * Semua repository interface extend ini.
 * Method tambahan yang spesifik domain ditambahkan di masing-masing interface.
 */
interface BaseRepositoryInterface
{
    public function findById(string $id): object;

    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function store(array $data): object;

    public function update(array $data, string $id): object;

    public function delete(string $id): void;
}
