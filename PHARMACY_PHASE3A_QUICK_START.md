# PHARMACY PHASE 3A - QUICK START GUIDE

**Date:** 2026-06-10  
**Duration:** 30 minutes setup + testing  
**Difficulty:** Medium

---

## ⚡ 5-MINUTE SETUP

### 1. Copy Files to Project
```bash
# Service
cp PharmacyProcurementEnhancedService.php \
  api/src/Domains/Pharmacy/Application/Services/

# Models
cp PharmacyProcurementEnhancedModels.php \
  api/src/Domains/Pharmacy/Infrastructure/Persistence/Models/

# Controller
cp PharmacyProcurementEnhancedController.php \
  api/src/Domains/Pharmacy/Presentation/Controllers/

# Migration
cp 2026_06_10_create_pharmacy_procurement_enhanced_tables.php \
  api/database/migrations/

# Routes
cp pharmacy-procurement-phase3a.php \
  api/routes/
```

### 2. Update routes/api.php
```php
// Add this line in your main route file:
require base_path('routes/pharmacy-procurement-phase3a.php');
```

### 3. Update PharmacyServiceProvider
```php
public function register()
{
    $this->app->bind(
        \Domains\Pharmacy\Application\Services\PharmacyProcurementEnhancedService::class,
        function ($app) {
            return new \Domains\Pharmacy\Application\Services\PharmacyProcurementEnhancedService();
        }
    );
}
```

### 4. Run Migration
```bash
cd api
php artisan migrate
```

Expected output:
```
Migration 2026_06_10_create_pharmacy_procurement_enhanced_tables....... DONE
```

### 5. Create Permissions
```bash
php artisan tinker
```

```php
// Create roles if needed
$role = \Spatie\Permission\Models\Role::create(['name' => 'pharmacy-procurement-manager']);

// Create permissions
$permissions = [
    'pharmacy.procurement.po.create',
    'pharmacy.procurement.po.view',
    'pharmacy.procurement.po.submit',
    'pharmacy.procurement.po.approve',
    'pharmacy.procurement.po.reject',
    'pharmacy.procurement.po.confirm',
    'pharmacy.procurement.po.cancel',
    'pharmacy.procurement.po.update',
    'pharmacy.procurement.grn.create',
    'pharmacy.procurement.grn.view',
    'pharmacy.procurement.grn.edit',
    'pharmacy.procurement.grn.finalize',
    'pharmacy.procurement.view',
];

foreach ($permissions as $permission) {
    \Spatie\Permission\Models\Permission::create(['name' => $permission]);
    $role->givePermissionTo($permission);
}

exit
```

---

## 🧪 TESTING WORKFLOW

### Test 1: Create Purchase Order

```bash
curl -X POST http://localhost/api/v1/pharmacy/procurement/purchase-orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "supplier_id": "550e8400-e29b-41d4-a716-446655440000",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440001",
    "expected_delivery_date": "2026-06-20",
    "items": [
      {
        "medicine_id": "550e8400-e29b-41d4-a716-446655440002",
        "quantity_ordered": 100,
        "unit_price": 50000,
        "notes": "For apotek rawat jalan"
      },
      {
        "medicine_id": "550e8400-e29b-41d4-a716-446655440003",
        "quantity_ordered": 50,
        "unit_price": 75000,
        "notes": "For apotek rawat inap"
      }
    ],
    "payment_terms": "net30",
    "delivery_address": "Apotek Utama - Lantai 2",
    "notes": "Urgent - monthly stock replenishment"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Purchase order created successfully",
  "data": {
    "po_id": "550e8400-e29b-41d4-a716-446655440100",
    "po_number": "PO-202606-0001"
  }
}
```

### Test 2: List Purchase Orders

```bash
curl -X GET "http://localhost/api/v1/pharmacy/procurement/purchase-orders?status=draft" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-ID: YOUR_TENANT_ID"
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440100",
        "po_number": "PO-202606-0001",
        "status": "draft",
        "total_amount": 8500000,
        "grand_total": 8500000,
        ...
      }
    ],
    "pagination": {...}
  }
}
```

### Test 3: Submit PO for Approval

```bash
curl -X POST http://localhost/api/v1/pharmacy/procurement/purchase-orders/550e8400-e29b-41d4-a716-446655440100/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "notes": "Please review and approve this monthly replenishment"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "PO submitted for approval",
  "po_status": "submitted"
}
```

### Test 4: Approve PO

```bash
curl -X POST http://localhost/api/v1/pharmacy/procurement/purchase-orders/550e8400-e29b-41d4-a716-446655440100/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "approval_notes": "Approved - within budget limit",
    "approval_limit": 10000000
  }'
```

### Test 5: Confirm PO (Send to Supplier)

```bash
curl -X POST http://localhost/api/v1/pharmacy/procurement/purchase-orders/550e8400-e29b-41d4-a716-446655440100/confirm \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "supplier_po_number": "SP-2026-0512",
    "supplier_contact": "sales@pbf.com"
  }'
```

### Test 6: Update Delivery Status

```bash
curl -X PATCH http://localhost/api/v1/pharmacy/procurement/purchase-orders/550e8400-e29b-41d4-a716-446655440100/delivery-status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "delivery_status": "in_transit",
    "tracking_number": "TAWON123456789",
    "actual_delivery_date": "2026-06-18",
    "delivery_notes": "Estimated arrival 2026-06-18 morning"
  }'
```

### Test 7: Create Goods Receipt (GRN)

```bash
curl -X POST http://localhost/api/v1/pharmacy/procurement/goods-receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "po_id": "550e8400-e29b-41d4-a716-446655440100",
    "receipt_date": "2026-06-18",
    "notes": "Goods received in good condition"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Goods receipt created successfully",
  "data": {
    "grn_id": "550e8400-e29b-41d4-a716-446655440200",
    "grn_number": "GRN-202606-0001"
  }
}
```

### Test 8: Register Received Items

```bash
# Item 1
curl -X POST http://localhost/api/v1/pharmacy/procurement/goods-receipts/550e8400-e29b-41d4-a716-446655440200/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "po_item_id": "550e8400-e29b-41d4-a716-446655440110",
    "medicine_id": "550e8400-e29b-41d4-a716-446655440002",
    "batch_number": "B20260601",
    "expiry_date": "2027-06-01",
    "quantity_ordered": 100,
    "quantity_received": 100,
    "unit_price": 50000,
    "condition_status": "good",
    "notes": "All items received in good condition"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Item registered successfully",
  "data": {
    "receipt_item_id": "550e8400-e29b-41d4-a716-446655440210"
  }
}
```

### Test 9: Finalize GRN

```bash
curl -X POST http://localhost/api/v1/pharmacy/procurement/goods-receipts/550e8400-e29b-41d4-a716-446655440200/finalize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: YOUR_TENANT_ID" \
  -d '{
    "quality_notes": {
      "inspection_type": "full_inspection",
      "findings": "All items passed quality check",
      "temperature_check": "OK - 20-25°C",
      "expiry_verification": "OK"
    }
  }'
```

### Test 10: Get Variance Report

```bash
curl -X GET http://localhost/api/v1/pharmacy/procurement/goods-receipts/550e8400-e29b-41d4-a716-446655440200/variances \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-ID: YOUR_TENANT_ID"
```

**Expected Response (no variances):**
```json
{
  "status": "success",
  "data": {
    "total_variances": 0,
    "variances": []
  }
}
```

### Test 11: Dashboard

```bash
curl -X GET http://localhost/api/v1/pharmacy/procurement/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-ID: YOUR_TENANT_ID"
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "po_stats": {
      "draft_count": 2,
      "pending_approval": 1,
      "overdue_count": 0,
      "confirmed_count": 5
    },
    "grn_stats": {
      "in_progress": 1,
      "finalized": 3,
      "with_variances": 0
    },
    "recent_pos": [...],
    "pending_grns": [...]
  }
}
```

---

## 🧩 INTEGRATION WITH EXISTING SYSTEM

### Link to Suppliers Table
```php
// In migration: pharmacy_purchase_orders table
$table->foreign('supplier_id')
    ->references('id')
    ->on('pharmacy_suppliers')
    ->onDelete('restrict');
```

### Link to Warehouse Table
```php
// Link to existing medicine_warehouses
$table->foreign('warehouse_id')
    ->references('id')
    ->on('medicine_warehouses')
    ->onDelete('restrict');
```

### Link to Medicine Table
```php
// In PharmacyPurchaseOrderItem and PharmacyReceiptItem
$table->foreign('medicine_id')
    ->references('id')
    ->on('medicines')
    ->onDelete('restrict');
```

### Create Medicine Batch on Receipt
```php
// Automatically creates MedicineBatchModel when item registered
// If batch doesn't exist, creates new record with:
// - medicine_id
// - batch_number
// - expiry_date
// - quantity (received)
// - warehouse_id
```

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Foreign key constraint fails"
**Cause:** Supplier/Warehouse/Medicine doesn't exist

**Solution:**
```bash
# Verify supplier exists
php artisan tinker
>>> \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySupplier::first()

# Create test supplier if needed
>>> PharmacySupplier::create([
  'id' => Str::uuid(),
  'tenant_id' => 'your-tenant-id',
  'supplier_name' => 'Test PBF',
  'contact_person' => 'John Doe',
  'phone' => '081234567890',
  'email' => 'contact@pbf.com',
  'address' => 'Jakarta',
  'city' => 'Jakarta',
  'country' => 'Indonesia'
])
```

### Issue 2: "PO must have at least 1 item"
**Cause:** Trying to submit empty PO

**Solution:** Add items before submitting
```bash
# Verify items are added
curl -X GET http://localhost/api/v1/pharmacy/procurement/purchase-orders/{po_id} \
  -H "Authorization: Bearer TOKEN" | jq '.data.items'
```

### Issue 3: "Only draft PO can be submitted"
**Cause:** PO already in different status

**Solution:** Check current status
```bash
# Verify PO status
curl -X GET http://localhost/api/v1/pharmacy/procurement/purchase-orders/{po_id} \
  -H "Authorization: Bearer TOKEN" | jq '.data.status'
```

### Issue 4: "PO amount exceeds your approval limit"
**Cause:** User approval limit too low

**Solution:** Use higher limit or escalate to higher authority
```bash
# Submit with higher approval_limit
-d '{"approval_limit": 50000000}'
```

---

## 📊 DATABASE VERIFICATION

### Check Tables Created
```bash
php artisan tinker
>>> \Illuminate\Support\Facades\Schema::getTables()
```

Should include:
- pharmacy_purchase_orders
- pharmacy_purchase_order_items
- pharmacy_goods_receipts
- pharmacy_receipt_items
- pharmacy_quality_inspections
- pharmacy_receipt_variances
- pharmacy_supplier_performance

### Check Sample Data
```bash
php artisan tinker

# Check POs
>>> PharmacyPurchaseOrder::count()

# Check GRNs
>>> PharmacyGoodsReceipt::count()

# Check recent PO
>>> PharmacyPurchaseOrder::latest()->first()
```

---

## ✅ VERIFICATION CHECKLIST

Before going to production:

- [ ] All migrations ran successfully
- [ ] All tables created with correct structure
- [ ] Permissions created and assigned to roles
- [ ] Service registered in PharmacyServiceProvider
- [ ] Routes registered in api.php
- [ ] Test workflow from Create PO to Finalize GRN
- [ ] Verify audit trails (created_by, updated_by)
- [ ] Verify multi-tenant isolation (tenant_id)
- [ ] Test permission checks
- [ ] Test with real suppliers/medicines/warehouses

---

## 📞 SUPPORT

For issues:
1. Check logs: `storage/logs/laravel.log`
2. Run: `php artisan tinker` to inspect data
3. Test API endpoints with Postman
4. Verify database relationships

---

**Phase 3A Implementation Complete!**

Next: Phase 3B (Safety & Compliance)
