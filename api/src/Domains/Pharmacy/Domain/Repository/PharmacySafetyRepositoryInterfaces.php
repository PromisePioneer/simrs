<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface IBatchDistributionRepository
{
    public function create(array $data): object;
    public function findByBatch(string $tenantId, string $medicineId, string $batchNumber): iterable;
    public function getAffectedPatients(string $tenantId, string $medicineId, string $batchNumber): iterable;
    public function getByMedicine(string $tenantId, string $medicineId, ?string $from, ?string $to): array;
}

interface IRecallLogRepository
{
    public function create(array $data): object;
    public function findById(string $id): ?object;
    public function getActive(string $tenantId): iterable;
    public function update(string $id, array $data): bool;
    public function createImpact(array $data): object;
    public function findImpact(string $impactId): ?object;
    public function updateImpact(string $impactId, array $data): bool;
    public function getImpactsByRecall(string $recallId): iterable;
    public function countDistributionsByBatch(string $tenantId, string $medicineId, ?string $batchNumber): iterable;
}

interface IHighAlertRepository
{
    public function upsert(string $tenantId, string $medicineId, array $data): object;
    public function getActive(string $tenantId, ?string $level): iterable;
    public function getByMedicineIds(string $tenantId, array $medicineIds): iterable;
    public function deactivate(string $tenantId, string $medicineId, string $updatedBy): bool;
}

interface ILASARepository
{
    public function upsert(string $tenantId, string $medicineAId, string $medicineBId, array $data): object;
    public function getActive(string $tenantId): iterable;
    public function getByMedicineIds(string $tenantId, array $medicineIds): iterable;
}
