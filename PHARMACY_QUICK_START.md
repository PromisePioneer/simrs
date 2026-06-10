# Pharmacy System - Quick Start Guide

## 🚀 Getting Started

### 1. Register the Service Provider

Add to `config/app.php` providers array:

```php
'providers' => [
    // ... other providers
    Domains\Pharmacy\Infrastructure\Providers\PharmacyServiceProvider::class,
],
```

### 2. Publish Configuration (Optional)

```bash
php artisan vendor:publish --tag=pharmacy-config
```

This creates `config/pharmacy.php` in your project root.

### 3. Run Migrations

```bash
php artisan migrate
```

Both pharmacy migrations will run automatically.

### 4. Seed Initial Data (Optional)

You can create suppliers, medicines, and warehouses:

```bash
php artisan tinker
```

```php
// Create a supplier
$supplier = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySupplier::create([
    'tenant_id' => auth()->user()->current_tenant_id,
    'name' => 'PT Pharmaceutical Supplier',
    'code' => 'SUP-001',
    'contact_person' => 'John Doe',
    'phone' => '08123456789',
    'email' => 'contact@supplier.com',
    'address' => 'Jl. Pharmacy Street No. 1',
    'discount_percentage' => 5,
    'tax_percentage' => 10,
]);
```

## 📝 API Usage Examples

### Example 1: Create a Purchase Order

```bash
curl -X POST http://localhost/api/pharmacy/purchase-orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "warehouse_id": "uuid-here",
    "expected_delivery_date": "2026-06-15",
    "notes": "Urgent restock",
    "items": [
      {
        "medicine_id": "uuid-medicine-1",
        "unit_id": 1,
        "quantity": 100,
        "unit_price": 5000
      },
      {
        "medicine_id": "uuid-medicine-2",
        "unit_id": 1,
        "quantity": 50,
        "unit_price": 10000
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase Order dibuat berhasil",
  "data": {
    "id": "uuid",
    "po_number": "PO-2026-06-0001",
    "status": "draft",
    "items": [...]
  }
}
```

### Example 2: Submit PO for Approval

```bash
curl -X POST http://localhost/api/pharmacy/purchase-orders/{poId}/submit \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 3: Approve Purchase Order

```bash
curl -X POST http://localhost/api/pharmacy/purchase-orders/{poId}/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Note**: Requires permission `pharmacy.po.approve`

### Example 4: Create Goods Receipt Note

```bash
curl -X POST http://localhost/api/pharmacy/goods-receipt-notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "purchase_order_id": "uuid-po",
    "warehouse_id": "uuid-warehouse",
    "notes": "All items received in good condition"
  }'
```

### Example 5: Add GRN Item with Batch

```bash
curl -X POST http://localhost/api/pharmacy/goods-receipt-notes/{grnId}/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "purchase_order_item_id": 123,
    "quantity_received": 100,
    "batch_number": "BTC-20260605-001",
    "expiry_date": "2027-06-05",
    "manufacture_date": "2025-06-05",
    "unit_price": 5000
  }'
```

### Example 6: Complete Goods Receipt

```bash
curl -X POST http://localhost/api/pharmacy/goods-receipt-notes/{grnId}/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This automatically updates `medicine_batch_stocks` table.

### Example 7: Create E-Prescription

```bash
curl -X POST http://localhost/api/pharmacy/prescriptions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "uuid-patient",
    "poli_id": "uuid-poli",
    "clinic_visit_id": "uuid-visit",
    "prescription_type": "outpatient",
    "clinical_notes": "Fever, headache",
    "items": [
      {
        "medicine_id": "uuid-medicine-1",
        "unit_id": 1,
        "quantity": 1,
        "dosage": "500mg",
        "frequency": "3x sehari",
        "route": "oral",
        "usage_instruction": "Setelah makan",
        "meal_relation": "after_meal",
        "duration_days": 5
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "E-Resep berhasil dibuat",
  "data": {
    "id": "uuid",
    "prescription_number": "RX-2026-06-0001",
    "status": "pending",
    "items": [
      {
        "is_lasa": false,
        "is_high_alert": false,
        "dispensing_status": "pending"
      }
    ]
  }
}
```

### Example 8: Review Prescription

```bash
curl -X POST http://localhost/api/pharmacy/prescriptions/{prescriptionId}/review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "review_type": "administrative",
    "review_notes": "Semua data lengkap",
    "recommendations": "OK untuk dispensing"
  }'
```

### Example 9: Approve Prescription for Dispensing

```bash
curl -X POST http://localhost/api/pharmacy/prescriptions/{prescriptionId}/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 10: Create Sale from Prescription

```bash
curl -X POST http://localhost/api/pharmacy/prescriptions/{prescriptionId}/sales \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse_id": "uuid-warehouse",
    "payment_status": "paid"
  }'
```

This automatically:
- Validates stock using FIFO strategy
- Deducts batch stock
- Creates sales items with batch tracing

### Example 11: Complete Sale

```bash
curl -X POST http://localhost/api/pharmacy/sales/{saleId}/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This creates a billing entry automatically.

### Example 12: Create Patient Return

```bash
curl -X POST http://localhost/api/pharmacy/patient-returns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sales_id": "uuid-sale",
    "patient_id": "uuid-patient",
    "reason": "side_effect",
    "reason_description": "Pasien alergi",
    "items": [
      {
        "medicine_batch_id": "uuid-batch",
        "quantity": 1
      }
    ]
  }'
```

This automatically restores batch stock.

### Example 13: Get Safety Alerts

```bash
curl -X GET http://localhost/api/pharmacy/safety-alerts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "expired_soon": [
      {
        "id": "uuid",
        "title": "Paracetamol batch expiring soon",
        "severity": "warning"
      }
    ],
    "stock_low": [
      {
        "id": "uuid",
        "title": "Ibuprofen stock below threshold",
        "severity": "warning"
      }
    ]
  }
}
```

### Example 14: Acknowledge Alert

```bash
curl -X POST http://localhost/api/pharmacy/safety-alerts/{alertId}/acknowledge \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 15: Get Prescriptions

```bash
curl -X GET "http://localhost/api/pharmacy/prescriptions?status=pending&per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Query parameters:
- `status`: pending, dispensed, partially_dispensed, cancelled, expired
- `patient_id`: Filter by patient
- `type`: outpatient, inpatient, emergency
- `date_from`: Start date
- `date_to`: End date
- `per_page`: Items per page (default 15)

### Example 16: Get Sales

```bash
curl -X GET "http://localhost/api/pharmacy/sales?status=completed&sales_type=outpatient" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Query parameters:
- `status`: draft, completed, cancelled, returned
- `type`: inpatient, outpatient, emergency, otc
- `payment_status`: pending, paid, partial, credit
- `date_from`, `date_to`: Date range
- `per_page`: Items per page

### Example 17: Get Sale Details

```bash
curl -X GET http://localhost/api/pharmacy/sales/{saleId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 18: Print Etiket (Label)

```bash
curl -X GET http://localhost/api/pharmacy/prescription-items/{itemId}/etiket \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Returns label data for printing with medicine name, dosage, frequency, patient name, doctor name, warnings (LASA, high-alert).

## 🔐 Permissions Required

User roles need these permissions to perform actions:

```php
// In your role/permission seeder
$permissions = [
    'pharmacy.po.create',
    'pharmacy.po.approve',
    'pharmacy.po.view',
    'pharmacy.grn.create',
    'pharmacy.grn.complete',
    'pharmacy.prescription.create',
    'pharmacy.prescription.review',
    'pharmacy.prescription.dispense',
    'pharmacy.prescription.approve',
    'pharmacy.sales.create',
    'pharmacy.sales.complete',
    'pharmacy.safety_alert.acknowledge',
];
```

Typical role assignments:

```php
// Pharmacist role
$pharmacist->givePermissionTo([
    'pharmacy.prescription.review',
    'pharmacy.prescription.approve',
    'pharmacy.sales.create',
    'pharmacy.sales.complete',
]);

// Pharmacy Manager role
$manager->givePermissionTo([
    'pharmacy.po.create',
    'pharmacy.po.approve',
    'pharmacy.grn.create',
    'pharmacy.grn.complete',
    'pharmacy.safety_alert.acknowledge',
]);
```

## 🧪 Testing

### Unit Test Example

```php
<?php

namespace Tests\Unit\Pharmacy;

use Tests\TestCase;
use Domains\Pharmacy\Application\Services\PharmacyProcurementService;

class PharmacyProcurementServiceTest extends TestCase
{
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(PharmacyProcurementService::class);
    }

    public function test_can_create_purchase_order()
    {
        $data = [
            'supplier_id' => 1,
            'warehouse_id' => 'uuid',
            'items' => [
                [
                    'medicine_id' => 'med-uuid',
                    'quantity' => 100,
                    'unit_price' => 5000,
                ]
            ]
        ];

        $po = $this->service->createPurchaseOrder(1, $data);

        $this->assertNotNull($po->id);
        $this->assertEquals('draft', $po->status);
        $this->assertCount(1, $po->items);
    }

    public function test_po_number_is_generated_uniquely()
    {
        // Test PO numbering logic
    }
}
```

## 📊 Environment Variables

Add to `.env`:

```env
# Pharmacy Settings
PHARMACY_STOCK_LOW_THRESHOLD=10
PHARMACY_STOCK_CRITICAL_THRESHOLD=5
PHARMACY_EXPIRED_SOON_THRESHOLD=30
PHARMACY_DEFAULT_DISCOUNT=0
PHARMACY_DEFAULT_TAX=10

# Prescription Settings
PHARMACY_PRESCRIPTION_VALIDITY_DAYS=30
PHARMACY_ENABLE_LASA_CHECKING=true
PHARMACY_ENABLE_INTERACTION_CHECKING=true
PHARMACY_REQUIRE_THREE_STAGE_REVIEW=true

# Sales Settings
PHARMACY_DEFAULT_ITEM_DISCOUNT=10
PHARMACY_SALES_TAX_PERCENTAGE=10
PHARMACY_ALLOW_OTC_SALES=true
PHARMACY_BATCH_DEPLETION_STRATEGY=fifo

# Warehouse Codes
PHARMACY_MAIN_WAREHOUSE=GDG-UTAMA
PHARMACY_OUTPATIENT_WAREHOUSE=APT-RAWAT-JALAN
PHARMACY_INPATIENT_WAREHOUSE=APT-RAWAT-INAP
PHARMACY_EMERGENCY_WAREHOUSE=DEPO-IGD

# Numbering Prefixes
PHARMACY_PO_PREFIX=PO
PHARMACY_GRN_PREFIX=GRN
PHARMACY_RETURN_PREFIX=RET
PHARMACY_PRESCRIPTION_PREFIX=RX
PHARMACY_SALES_PREFIX=SAL
PHARMACY_PATIENT_RETURN_PREFIX=PRR
```

## 🐛 Troubleshooting

### Issue: "Class not found" errors

**Solution**: Make sure PharmacyServiceProvider is registered in `config/app.php`

### Issue: Migrations fail with UUID errors

**Solution**: Ensure PostgreSQL is being used (not MySQL). UUID columns require PostgreSQL.

### Issue: Stock not deducted after sale

**Solution**: Check that `completeGoodsReceipt()` was called before creating sale. Stock only exists after GRN is completed.

### Issue: FIFO not working correctly

**Solution**: Verify batch `expiry_date` is set correctly when adding GRN items.

## 📚 Related Documentation

- See `PHARMACY_SYSTEM_DOCUMENTATION.md` for full feature documentation
- See `PHARMACY_IMPLEMENTATION_SUMMARY.md` for implementation details
- Check `config/pharmacy.php` for all configurable options

## 🎯 Common Workflows

### Workflow: Complete Procurement Cycle
1. Create PO → Add items → Submit → Approve
2. Create GRN → Add items with batch → Complete (updates stock)
3. Receive invoice and record payment

### Workflow: Complete Prescription Cycle
1. Doctor creates e-prescription
2. Pharmacist reviews (3 stages)
3. Approve for dispensing
4. Create sale (auto-validates stock, deducts FIFO)
5. Complete sale (creates billing)
6. Generate etiket for printing
7. If patient returns, create return (restores stock)

---

**Last Updated**: 2026-06-05
**Framework**: Laravel 11
**Database**: PostgreSQL
