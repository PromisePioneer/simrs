<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\PharmacySupplierRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\PharmacyPurchaseOrderRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\PharmacyGoodsReceiptRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\PharmacyPurchaseReturnRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\PharmacySafetyAlertRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySupplier;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseOrder;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyGoodsReceiptNote;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseReturn;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySafetyAlert;

class EloquentPharmacySupplierRepository implements PharmacySupplierRepositoryInterface
{
    public function create(array $data): mixed
    {
        return PharmacySupplier::create($data);
    }

    public function findById(int $id): ?object
    {
        return PharmacySupplier::find($id);
    }

    public function findByCode(string $code): ?object
    {
        return PharmacySupplier::where('code', $code)->first();
    }

    public function all()
    {
        return PharmacySupplier::all();
    }

    public function update(int $id, array $data): bool
    {
        return PharmacySupplier::find($id)?->update($data) ?? false;
    }

    public function delete(int $id): bool
    {
        return PharmacySupplier::destroy($id) > 0;
    }

    public function active()
    {
        return PharmacySupplier::where('status', 'active')->get();
    }

    public function getByTenant(int $tenantId)
    {
        return PharmacySupplier::where('tenant_id', $tenantId)->get();
    }
}

class EloquentPharmacyPurchaseOrderRepository implements PharmacyPurchaseOrderRepositoryInterface
{
    public function create(array $data): mixed
    {
        return PharmacyPurchaseOrder::create($data);
    }

    public function findById(int $id): ?object
    {
        return PharmacyPurchaseOrder::with(['items', 'supplier', 'warehouse'])->find($id);
    }

    public function findByNumber(string $poNumber): ?object
    {
        return PharmacyPurchaseOrder::where('po_number', $poNumber)->first();
    }

    public function all()
    {
        return PharmacyPurchaseOrder::with(['supplier', 'warehouse'])->get();
    }

    public function update(int $id, array $data): bool
    {
        return PharmacyPurchaseOrder::find($id)?->update($data) ?? false;
    }

    public function delete(int $id): bool
    {
        return PharmacyPurchaseOrder::destroy($id) > 0;
    }

    public function getByStatus(string $status)
    {
        return PharmacyPurchaseOrder::where('status', $status)->with(['supplier', 'warehouse'])->get();
    }

    public function getBySupplier(int $supplierId)
    {
        return PharmacyPurchaseOrder::where('supplier_id', $supplierId)->with(['items'])->get();
    }

    public function getByWarehouse(int $warehouseId)
    {
        return PharmacyPurchaseOrder::where('warehouse_id', $warehouseId)->get();
    }

    public function getByTenant(int $tenantId)
    {
        return PharmacyPurchaseOrder::where('tenant_id', $tenantId)->with(['supplier', 'warehouse'])->get();
    }

    public function getPending()
    {
        return PharmacyPurchaseOrder::whereIn('status', ['draft', 'submitted'])->get();
    }

    public function getApproved()
    {
        return PharmacyPurchaseOrder::where('status', 'approved')->get();
    }
}

class EloquentPharmacyGoodsReceiptRepository implements PharmacyGoodsReceiptRepositoryInterface
{
    public function create(array $data): mixed
    {
        return PharmacyGoodsReceiptNote::create($data);
    }

    public function findById(int $id): ?object
    {
        return PharmacyGoodsReceiptNote::with(['items', 'purchaseOrder'])->find($id);
    }

    public function findByNumber(string $grnNumber): ?object
    {
        return PharmacyGoodsReceiptNote::where('grn_number', $grnNumber)->first();
    }

    public function all()
    {
        return PharmacyGoodsReceiptNote::with(['purchaseOrder', 'items'])->get();
    }

    public function update(int $id, array $data): bool
    {
        return PharmacyGoodsReceiptNote::find($id)?->update($data) ?? false;
    }

    public function getByPurchaseOrder(int $poId)
    {
        return PharmacyGoodsReceiptNote::where('purchase_order_id', $poId)->with(['items'])->get();
    }

    public function getByStatus(string $status)
    {
        return PharmacyGoodsReceiptNote::where('status', $status)->get();
    }

    public function getByTenant(int $tenantId)
    {
        return PharmacyGoodsReceiptNote::where('tenant_id', $tenantId)->with(['purchaseOrder'])->get();
    }
}

class EloquentPharmacyPurchaseReturnRepository implements PharmacyPurchaseReturnRepositoryInterface
{
    public function create(array $data): mixed
    {
        return PharmacyPurchaseReturn::create($data);
    }

    public function findById(int $id): ?object
    {
        return PharmacyPurchaseReturn::with(['items', 'supplier', 'purchaseOrder'])->find($id);
    }

    public function findByNumber(string $returnNumber): ?object
    {
        return PharmacyPurchaseReturn::where('return_number', $returnNumber)->first();
    }

    public function all()
    {
        return PharmacyPurchaseReturn::with(['items', 'supplier'])->get();
    }

    public function update(int $id, array $data): bool
    {
        return PharmacyPurchaseReturn::find($id)?->update($data) ?? false;
    }

    public function getByStatus(string $status)
    {
        return PharmacyPurchaseReturn::where('status', $status)->with(['items'])->get();
    }

    public function getBySupplier(int $supplierId)
    {
        return PharmacyPurchaseReturn::where('supplier_id', $supplierId)->get();
    }

    public function getByReason(string $reason)
    {
        return PharmacyPurchaseReturn::where('reason', $reason)->get();
    }

    public function getByTenant(int $tenantId)
    {
        return PharmacyPurchaseReturn::where('tenant_id', $tenantId)->with(['supplier'])->get();
    }
}

class EloquentPharmacySafetyAlertRepository implements PharmacySafetyAlertRepositoryInterface
{
    public function create(array $data): mixed
    {
        return PharmacySafetyAlert::create($data);
    }

    public function findById(int $id): ?object
    {
        return PharmacySafetyAlert::with(['medicineBatch'])->find($id);
    }

    public function all()
    {
        return PharmacySafetyAlert::with(['medicineBatch'])->get();
    }

    public function update(int $id, array $data): bool
    {
        return PharmacySafetyAlert::find($id)?->update($data) ?? false;
    }

    public function delete(int $id): bool
    {
        return PharmacySafetyAlert::destroy($id) > 0;
    }

    public function getActiveAlerts(int $tenantId)
    {
        return PharmacySafetyAlert::where('tenant_id', $tenantId)
            ->whereIn('status', ['active', 'acknowledged'])
            ->orderBy('severity', 'desc')
            ->with(['medicineBatch'])
            ->get();
    }

    public function getByType(string $alertType)
    {
        return PharmacySafetyAlert::where('alert_type', $alertType)
            ->where('status', 'active')
            ->get();
    }

    public function getBySeverity(string $severity)
    {
        return PharmacySafetyAlert::where('severity', $severity)
            ->where('status', 'active')
            ->get();
    }

    public function getExpiredSoon(int $tenantId, int $days = 30)
    {
        return PharmacySafetyAlert::where('tenant_id', $tenantId)
            ->where('alert_type', 'expired_soon')
            ->where('status', 'active')
            ->with(['medicineBatch'])
            ->get();
    }

    public function getLowStock(int $tenantId)
    {
        return PharmacySafetyAlert::where('tenant_id', $tenantId)
            ->whereIn('alert_type', ['stock_low', 'stock_empty'])
            ->where('status', 'active')
            ->get();
    }

    public function getUnacknowledged(int $tenantId)
    {
        return PharmacySafetyAlert::where('tenant_id', $tenantId)
            ->where('status', 'active')
            ->whereNull('acknowledged_at')
            ->orderBy('alert_triggered_at', 'desc')
            ->get();
    }
}
