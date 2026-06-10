# Pharmacy Management System - Comprehensive Documentation

## Overview
Implementasi sistem manajemen farmasi yang kompleks untuk SIMRS dengan fitur-fitur production-ready mencakup pengadaan, penerimaan barang, telaah resep, dispensing, dan manajemen keamanan obat.

## Arsitektur Domain-Driven Design

### 1. Database Schema

#### Pengadaan & Penerimaan Barang
- `pharmacy_suppliers` - Data PBF/Supplier
- `pharmacy_purchase_orders` - Surat Pemesanan (PO)
- `pharmacy_purchase_order_items` - Detail PO
- `pharmacy_goods_receipt_notes` - Nota Penerimaan Barang (GRN)
- `pharmacy_goods_receipt_items` - Detail GRN dengan batch tracking
- `pharmacy_purchase_returns` - Retur ke Supplier

#### E-Resep & Dispensing
- `pharmacy_prescriptions` - E-Resep dari dokter
- `pharmacy_prescription_items` - Detail resep
- `pharmacy_prescription_reviews` - Telaah resep (administrative, pharmaceutical, clinical)
- `pharmacy_sales` - Penjualan/Dispensing
- `pharmacy_sales_items` - Detail penjualan dengan batch tracing
- `pharmacy_patient_returns` - Retur obat dari pasien

#### Keamanan & Safety
- `pharmacy_safety_alerts` - Alert untuk expired, stock low, LASA, high-alert medicines
- `pharmacy_compounded_medicines` - Obat racikan/puyer custom
- `pharmacy_compound_components` - Komponen obat racikan

### 2. Fitur-Fitur Utama

#### A. Pengadaan (Procurement)
**PharmacyProcurementService**
- `createPurchaseOrder()` - Buat PO baru dengan validasi harga referensi
- `addPOItem()` - Tambah item ke PO
- `submitPurchaseOrder()` - Submit untuk approval
- `approvePurchaseOrder()` - Approve PO (requires permission: pharmacy.po.approve)
- `registerGoodsReceipt()` - Buat GRN untuk penerimaan barang
- `addGRNItem()` - Tambah item GRN dengan batch number & expiry date
- `completeGoodsReceipt()` - Selesaikan GRN & update batch stock
- `createPurchaseReturn()` - Retur ke supplier dengan tracking alasan

**API Endpoints**
```
POST   /api/pharmacy/purchase-orders                 - Create PO
POST   /api/pharmacy/purchase-orders/{id}/items      - Add PO item
POST   /api/pharmacy/purchase-orders/{id}/submit     - Submit PO
POST   /api/pharmacy/purchase-orders/{id}/approve    - Approve PO
POST   /api/pharmacy/goods-receipt-notes             - Create GRN
POST   /api/pharmacy/goods-receipt-notes/{id}/items  - Add GRN item
POST   /api/pharmacy/goods-receipt-notes/{id}/complete - Complete GRN
POST   /api/pharmacy/purchase-returns                - Create return
GET    /api/pharmacy/safety-alerts                   - Get active alerts
POST   /api/pharmacy/safety-alerts/{id}/acknowledge  - Acknowledge alert
```

#### B. E-Resep & Telaah Resep (Prescriptions)
**PharmacyPrescriptionAndSalesService**
- `createPrescription()` - Buat e-resep dari dokter dengan auto-detection LASA/high-alert
- `reviewPrescription()` - Telaah resep 3 tahap:
  - **Administrative Review**: Kelengkapan data (nomor resep, dokter, pasien)
  - **Pharmaceutical Review**: Duplikasi terapi, interaksi obat, kontraindikasi
  - **Clinical Review**: Dosis, frekuensi, durasi
- `approvePrescriptionForDispensing()` - Approve untuk dispensing setelah telaah selesai
- `createSaleFromPrescription()` - Generate penjualan dari resep yang approved
- `completeSale()` - Selesaikan penjualan & buat billing entry

**Safety Features**
- LASA Detection: Automatic warning untuk look-alike sound-alike medicines
- High Alert Medicines: Tracking untuk obat narkosin, psikotropika, dll
- Stock Validation: Cek ketersediaan batch FIFO (by expiry date)
- Batch Tracing: Track setiap batch dari supplier hingga pasien

**API Endpoints**
```
POST   /api/pharmacy/prescriptions                   - Create prescription
POST   /api/pharmacy/prescriptions/{id}/review       - Review prescription
POST   /api/pharmacy/prescriptions/{id}/approve      - Approve for dispensing
POST   /api/pharmacy/prescriptions/{id}/sales        - Create sale from prescription
POST   /api/pharmacy/sales/{id}/complete             - Complete sale
POST   /api/pharmacy/patient-returns                 - Create patient return
GET    /api/pharmacy/prescriptions                   - List prescriptions (filtered)
GET    /api/pharmacy/sales                           - List sales (filtered)
GET    /api/pharmacy/sales/{id}                      - Get sale details
GET    /api/pharmacy/prescription-items/{id}/etiket  - Generate label/etiket
```

#### C. Keamanan & Safety Alerts
**Automatic Alert Generation**
- Expired Soon: 30 days sebelum expiry
- Expired: Batch yang sudah expired
- Stock Low: Below minimum threshold
- Stock Empty: Zero stock
- LASA Warning: Look-alike sound-alike medicines
- High Alert: Narcotics, psychotropics

**Alert Management**
- Status tracking: active → acknowledged → resolved
- Severity levels: info, warning, critical, danger
- Acknowledgment tracking dengan user & timestamp

#### D. Penerimaan & Stok Batch
**Batch Tracking**
- Batch Number + Expiry Date tracking
- FIFO depletion strategy
- Automatic stock depletion on sales
- Stock restoration on patient returns
- Batch status: active, depleted, expired

### 3. Service Layer Architecture

#### PharmacyProcurementService
```php
- Workflow: Draft → Submitted → Approved → Received → Completed
- Stock management via medicine_batch_stocks
- Supplier pricing & discount handling
- Purchase return workflow
```

#### PharmacyPrescriptionAndSalesService
```php
- Workflow: Prescription → Review → Dispensed → Sale → Completed
- Multi-stage review process
- LASA & high-alert detection
- Batch FIFO depletion
- Patient return handling
```

### 4. Controllers

#### PharmacyProcurementController
- Purchase order management
- Goods receipt handling
- Safety alert management

#### PharmacyPrescriptionAndSalesController
- Prescription creation & management
- Prescription review workflow
- Sales & dispensing
- Etiket (label) generation for printing

### 5. Models

#### Eloquent Models Created
- `PharmacySupplier` - Supplier/PBF data
- `PharmacyPurchaseOrder` - PO master
- `PharmacyPurchaseOrderItem` - PO details
- `PharmacyGoodsReceiptNote` - GRN master
- `PharmacyGoodsReceiptItem` - GRN details dengan batch
- `PharmacyPurchaseReturn` - Return to supplier
- `PharmacyPrescription` - E-Resep
- `PharmacyPrescriptionItem` - Detail resep
- `PharmacyPrescriptionReview` - Review hasil
- `PharmacySale` - Penjualan/Dispensing
- `PharmacySaleItem` - Detail penjualan
- `PharmacyPatientReturn` - Retur pasien
- `PharmacyCompoundedMedicine` - Obat racikan
- `PharmacyCompoundComponent` - Komponen racikan
- `PharmacySafetyAlert` - Safety alerts

### 6. Workflow Examples

#### Workflow Pengadaan
```
1. Buat PO (draft)
   → addPOItem() untuk setiap obat
   → submitPurchaseOrder() untuk approval

2. Approval
   → approvePurchaseOrder() (requires permission)

3. Penerimaan Barang
   → registerGoodsReceipt() buat GRN baru
   → addGRNItem() untuk setiap batch yang diterima (batch number + expiry)
   → completeGoodsReceipt() → update medicine_batch_stocks

4. Jika ada ketidaksesuaian
   → createPurchaseReturn() dengan alasan (expired, damaged, dll)
```

#### Workflow E-Resep & Dispensing
```
1. Dokter
   → createPrescription() dengan items & instruction
   → System auto-detect LASA & high-alert

2. Farmasis (Telaah Resep)
   → reviewPrescription() - check administrative, pharmaceutical, clinical
   → Jika ada issue → needs_clarification
   → Jika OK → approved

3. Dispensing
   → approvePrescriptionForDispensing() after review approved
   → createSaleFromPrescription() → generate sales + deduct batch stock (FIFO)
   → completeSale() → update billing

4. Jika pasien bawa kembali
   → createPatientReturn() dengan alasan
   → System restore batch stock
```

### 7. Safety Features

#### LASA (Look Alike Sound Alike)
- Otomatis detect dari database flag
- Generate warning di prescription item
- Harus ackowledge sebelum dispensing

#### High Alert Medicines
- Narcotics, Psychotropics, Dangerous drugs
- Extra tracking & monitoring
- Audit trail untuk setiap transaksi

#### Expired Date Management
- Auto-generate alert 30 hari sebelum expired
- FIFO strategy untuk depletion
- Prevent sale dari batch expired

#### Stock Management
- Real-time stock tracking per batch
- Minimum stock alerts
- Stock empty alerts

### 8. Permissions Required

```php
pharmacy.po.create
pharmacy.po.approve
pharmacy.po.view
pharmacy.grn.create
pharmacy.grn.complete
pharmacy.prescription.create
pharmacy.prescription.review
pharmacy.prescription.dispense
pharmacy.prescription.approve
pharmacy.sales.create
pharmacy.sales.complete
pharmacy.safety_alert.acknowledge
```

### 9. Integration Points

#### Dengan Outpatient Domain
- Link prescription ke clinic visit
- Auto-populate patient dari visit

#### Dengan Inpatient Domain
- Link prescription ke inpatient admission
- Multiple prescriptions per stay

#### Dengan Billing Domain
- Auto-create billing entry dari sales
- Track pembayaran per penjualan

#### Dengan IAM Domain
- User roles & permissions untuk approval workflow
- Audit trail untuk user actions

### 10. Future Enhancements

1. **Drug Interaction Database**
   - Extensive drug-drug interaction checking
   - Contraindication matrix

2. **Clinical Decision Support**
   - Dose calculator based on patient weight/age
   - Renal/hepatic adjustment suggestions

3. **Electronic Signature**
   - Digital signature untuk resep & approval
   - Compliance dengan regulasi

4. **Batch Number Barcode**
   - Scan barcode untuk penerimaan
   - Reduce manual entry errors

5. **Patient Medication History**
   - Cumulative medication profile
   - Allergy tracking & alerts

6. **Pharmacy Analytics**
   - Medicine usage reports
   - Stock turnover analysis
   - Cost analysis per medicine

7. **Multi-Warehouse Support**
   - Transfer obat antar gudang
   - Warehouse-level stock management

8. **Formularium Integration**
   - Link ke hospital formularium
   - Substitute medicine suggestions

## Testing Checklist

- [ ] PO workflow: create → approve → GRN → complete
- [ ] Batch tracking: expiry date FIFO depletion
- [ ] Prescription review: all 3 stages (admin, pharma, clinical)
- [ ] LASA detection & warnings
- [ ] High alert medicine tracking
- [ ] Stock validation & depletion
- [ ] Patient return workflow
- [ ] Safety alert generation & acknowledgment
- [ ] Permission-based access control
- [ ] Multi-tenant isolation

## Deployment Notes

- All tables use UUID primary keys for tenant isolation
- Foreign key constraints on cascade delete
- Indexes on commonly filtered columns (status, dates, tenant_id)
- Soft deletes not implemented (use status enum instead)
- Audit logging via user_id tracking on create/update

## API Response Format

All endpoints return consistent JSON:
```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": { /* response payload */ }
}
```

Errors return 4xx/5xx with error message in message field.

---

**Generated:** 2026-06-05
**DDD Layer:** Domain → Application → Infrastructure → Presentation
**Status:** Ready for integration testing
