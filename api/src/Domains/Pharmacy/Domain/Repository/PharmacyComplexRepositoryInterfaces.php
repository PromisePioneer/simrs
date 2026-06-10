<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface PharmacySupplierRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByCode(string $code): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function active();
    public function getByTenant(int $tenantId);
}

interface PharmacyPurchaseOrderRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByNumber(string $poNumber): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getByStatus(string $status);
    public function getBySupplier(int $supplierId);
    public function getByWarehouse(int $warehouseId);
    public function getByTenant(int $tenantId);
    public function getPending();
    public function getApproved();
}

interface PharmacyGoodsReceiptRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByNumber(string $grnNumber): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function getByPurchaseOrder(int $poId);
    public function getByStatus(string $status);
    public function getByTenant(int $tenantId);
}

interface PharmacyPurchaseReturnRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByNumber(string $returnNumber): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function getByStatus(string $status);
    public function getBySupplier(int $supplierId);
    public function getByReason(string $reason);
    public function getByTenant(int $tenantId);
}

interface PharmacySafetyAlertRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getActiveAlerts(int $tenantId);
    public function getByType(string $alertType);
    public function getBySeverity(string $severity);
    public function getExpiredSoon(int $tenantId, int $days = 30);
    public function getLowStock(int $tenantId);
    public function getUnacknowledged(int $tenantId);
}

interface PharmacyPrescriptionRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByNumber(string $prescriptionNumber): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getByPatient(int $patientId);
    public function getByDoctor(int $doctorId);
    public function getByStatus(string $status);
    public function getPending(int $tenantId);
    public function getByType(string $prescriptionType);
    public function getByTenant(int $tenantId);
}

interface PharmacyPrescriptionReviewRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function getByPrescription(int $prescriptionId);
    public function getByStatus(string $status);
    public function getByPharmacist(int $pharmacistId);
    public function getPending();
    public function getNeedsAction();
}

interface PharmacySaleRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByNumber(string $salesNumber): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getByPatient(int $patientId);
    public function getByPharmacist(int $pharmacistId);
    public function getByStatus(string $status);
    public function getByWarehouse(int $warehouseId);
    public function getByType(string $salesType);
    public function getByDateRange(\DateTime $startDate, \DateTime $endDate);
    public function getByTenant(int $tenantId);
}

interface PharmacyPatientReturnRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByNumber(string $returnNumber): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function getByPatient(int $patientId);
    public function getByStatus(string $status);
    public function getByReason(string $reason);
    public function getPending();
    public function getUnrefunded();
    public function getByTenant(int $tenantId);
}

interface PharmacyCompoundedMedicineRepositoryInterface
{
    public function create(array $data): mixed;
    public function findById(int $id): ?object;
    public function findByCode(string $code): ?object;
    public function all();
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function active();
    public function getByForm(string $form);
    public function getByTenant(int $tenantId);
}
