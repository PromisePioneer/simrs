# PHARMACY SYSTEM ENHANCEMENT - COMPLETE IMPLEMENTATION ROADMAP
# Status: Kompleks & Komprehensif untuk SIMRS Khanza

## 📋 DAFTAR FITUR LENGKAP (6 Kategori Utama)

### 1. PENGADAAN & MANAJEMEN STOK (INVENTORY) ✅ EXTENDED
- [x] Master Data Obat & Alkes (Kategori, Jenis, Satuan Berjenjang, Produsen, Distributor)
- [x] Manajemen Multi Gudang/Depo (Gudang Utama, Apotek Rawat Jalan, Apotek Rawat Inap, Depo IGD)
- [x] Surat Pemesanan (SP) & Pengadaan Obat ke PBF/Supplier
- [x] Registrasi Penerimaan Obat (Pencatatan Nomor Batch & Tanggal Kedaluwarsa)
- [x] Retur Obat ke Supplier/PBF
- [ ] Mutasi & Transfer Stok Antar Unit/Depo Farmasi (NEW)
- [ ] Stok Opname Elektronik (NEW)

### 2. KEAMANAN & PERINGATAN OTOMATIS (SAFETY ALERTS) ✅ EXTENDED
- [x] Reminder Expired Date (Otomatis untuk obat ≤30 hari)
- [x] Sistem Stok Minimal / Buffer Stock (Notifikasi otomatis)
- [x] Tracing Obat / Batch Tracking (Pelacakan batch untuk recall BPOM)
- [ ] Alert History & Audit Trail (NEW)

### 3. PELAYANAN RESEP & PENJUALAN ✅ EXTENDED
- [x] E-Resep / Electronic Prescribing
- [x] Telaah Resep Elektronik (3-stage: admin, pharma, klinis)
- [x] Penjualan Obat Rawat Jalan & Rawat Inap (dengan stock deduction)
- [ ] Fitur Obat Racikan (Perhitungan komponen, biaya racik, embalase) (NEW)
- [x] Penjualan Bebas / OTC
- [x] Retur Obat Pasien (dengan stock restoration)

### 4. MANAJEMEN ATURAN PAKAI & CETAK e-ETIKET ✅ EXTENDED
- [ ] Master Aturan Pakai Dinamis (Template sistem) (NEW)
- [ ] Cetak Etiket Otomatis (ke thermal printer) (NEW)
- [x] Sistem Penandaan High Alert & LASA

### 5. PELAPORAN & ANALISIS DATA (REPORTING) ✅ EXTENDED
- [ ] Laporan Penggunaan Obat (Fast Moving & Slow Moving) (NEW)
- [ ] Laporan Narkotika, Psikotropika, Prekursor (Format Dinkes/BPOM) (NEW)
- [ ] Laporan Keuntungan, Omset, Penjualan (Harian/Mingguan/Bulanan) (NEW)
- [ ] Laporan Defecta (Otomatis untuk pemesanan ulang) (NEW)
- [ ] Laporan Buku Besar Stok per Obat (NEW)

### 6. REGULASI & INTEGRASI PEMERINTAH ✅ EXTENDED
- [ ] Mapping KFA SatuSehat (Integrasi Kemenkes) (NEW)
- [ ] Bridging SIMRS Khanza ke Sistem Eksternal (NEW)

---

## 🏗️ IMPLEMENTASI TEKNIS - FASE 2 (KOMPLEKS)

### PHASE 2A: INVENTORY ADVANCED
**File yang akan dibuat:**

1. **Transfer Stok Antar Depo**
   - Table: `pharmacy_stock_transfers`
   - Model: `PharmacyStockTransfer`, `PharmacyStockTransferItem`
   - Service: `PharmacyStockTransferService`
   - Controller: `PharmacyStockTransferController`
   - Endpoints:
     - POST `/api/pharmacy/stock-transfers` - Create transfer request
     - POST `/api/pharmacy/stock-transfers/{id}/approve` - Approve transfer
     - POST `/api/pharmacy/stock-transfers/{id}/receive` - Receive at destination
     - GET `/api/pharmacy/stock-transfers` - List transfers

2. **Stok Opname Elektronik**
   - Table: `pharmacy_stock_opnames`, `pharmacy_stock_opname_items`
   - Model: `PharmacyStockOpname`, `PharmacyStockOpnameItem`
   - Service: `PharmacyStockOpnameService`
   - Controller: `PharmacyStockOpnameController`
   - Endpoints:
     - POST `/api/pharmacy/stock-opnames` - Create opname session
     - POST `/api/pharmacy/stock-opnames/{id}/items` - Add opname item
     - POST `/api/pharmacy/stock-opnames/{id}/finalize` - Finalize & reconcile
     - GET `/api/pharmacy/stock-opnames/{id}/variance` - Get variances

### PHASE 2B: SAFETY & ALERTS ADVANCED
**File yang akan dibuat:**

1. **Alert History & Audit**
   - Table: `pharmacy_alert_histories`, `pharmacy_alert_escalations`
   - Model: `PharmacyAlertHistory`, `PharmacyAlertEscalation`
   - Service: `PharmacyAlertHistoryService`
   - Add to Controller: Alert history endpoints

### PHASE 2C: PRESCRIPTION & COMPOUNDED MEDICINES
**File yang akan dibuat:**

1. **Master Aturan Pakai Dinamis**
   - Table: `pharmacy_instruction_templates`, `pharmacy_instruction_rules`
   - Model: `PharmacyInstructionTemplate`, `PharmacyInstructionRule`
   - Service: `PharmacyInstructionService`
   - Endpoints:
     - GET `/api/pharmacy/instruction-templates` - List templates
     - POST `/api/pharmacy/instruction-templates` - Create template

2. **Obat Racikan (Compounded Medicines Advanced)**
   - Extend existing model dengan:
     - Perhitungan biaya komponen otomatis
     - Biaya racik/tuslah
     - Biaya embalase
   - Service: `PharmacyCompoundingService`
   - Endpoints:
     - POST `/api/pharmacy/compounded-medicines/{id}/calculate-cost` - Hitung biaya
     - GET `/api/pharmacy/compounded-medicines/{id}/bom` - Bill of Materials

3. **Cetak Etiket & Label Thermal**
   - Service: `PharmacyEtiketService`
   - Endpoints:
     - GET `/api/pharmacy/prescriptions/{id}/etiket/preview` - Preview
     - POST `/api/pharmacy/prescriptions/{id}/etiket/print` - Print to thermal

### PHASE 2D: REPORTING (COMPLEX)
**File yang akan dibuat:**

1. **Analisis Penggunaan Obat**
   - Service: `PharmacyUsageAnalysisService`
   - Endpoints:
     - GET `/api/pharmacy/reports/usage-analysis?period=monthly`
     - GET `/api/pharmacy/reports/fast-moving`
     - GET `/api/pharmacy/reports/slow-moving`

2. **Laporan Narkotika & Psikotropika**
   - Service: `PharmacyRegulationReportService`
   - Endpoints:
     - GET `/api/pharmacy/reports/narcotics?format=pdf`
     - GET `/api/pharmacy/reports/psychotropics?format=excel`

3. **Laporan Keuangan Farmasi**
   - Service: `PharmacyFinancialReportService`
   - Endpoints:
     - GET `/api/pharmacy/reports/revenue?period=daily`
     - GET `/api/pharmacy/reports/margin-analysis`
     - GET `/api/pharmacy/reports/cost-analysis`

4. **Laporan Defecta**
   - Service: `PharmacyDefectaService`
   - Auto-generate berdasarkan:
     - Stock < minimum_stock_amount
     - Stock expiring soon
     - High-alert medicines
   - Endpoint: GET `/api/pharmacy/reports/defecta`

5. **Laporan Buku Besar Stok**
   - Service: `PharmacyGeneralLedgerService`
   - Endpoint: GET `/api/pharmacy/reports/general-ledger?medicine_id=uuid`

### PHASE 2E: GOVERNMENT INTEGRATION
**File yang akan dibuat:**

1. **KFA SatuSehat Mapping**
   - Table: `pharmacy_kfa_mapping`
   - Model: `PharmacyKFAMapping`
   - Service: `SatuSehatPharmacyIntegrationService`
   - Methods:
     - mapMedicineToKFA()
     - syncWithSatuSehat()
     - validateKFACompliance()

2. **External System Bridge**
   - Service: `PharmacyExternalBridgeService`
   - Support untuk:
     - BPOM integration
     - Health Ministry reporting
     - Regional Health Authority APIs

---

## 📊 DATABASE SCHEMA ADDITIONS

### Transfer Stok
```sql
CREATE TABLE pharmacy_stock_transfers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    transfer_number VARCHAR(50) UNIQUE,
    source_warehouse_id UUID NOT NULL,
    destination_warehouse_id UUID NOT NULL,
    transfer_date TIMESTAMP,
    received_date TIMESTAMP,
    status ENUM('draft','approved','sent','received','cancelled'),
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    received_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE pharmacy_stock_transfer_items (
    id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL REFERENCES pharmacy_stock_transfers(id),
    medicine_batch_id UUID NOT NULL,
    quantity_requested INT,
    quantity_sent INT,
    quantity_received INT,
    notes TEXT
);
```

### Stok Opname
```sql
CREATE TABLE pharmacy_stock_opnames (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    opname_number VARCHAR(50) UNIQUE,
    warehouse_id UUID NOT NULL,
    opname_date DATE,
    status ENUM('draft','in_progress','finalized','reconciled'),
    started_by UUID,
    finalized_by UUID,
    started_at TIMESTAMP,
    finalized_at TIMESTAMP,
    total_variance_amount DECIMAL(15,2),
    notes TEXT
);

CREATE TABLE pharmacy_stock_opname_items (
    id UUID PRIMARY KEY,
    opname_id UUID NOT NULL REFERENCES pharmacy_stock_opnames(id),
    medicine_batch_id UUID NOT NULL,
    system_quantity INT,
    physical_quantity INT,
    variance INT,
    variance_amount DECIMAL(15,2),
    variance_reason VARCHAR(100),
    notes TEXT
);
```

### Aturan Pakai Template
```sql
CREATE TABLE pharmacy_instruction_templates (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(100),
    description TEXT,
    template_format TEXT, -- Template untuk aturan pakai
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE pharmacy_instruction_rules (
    id UUID PRIMARY KEY,
    template_id UUID NOT NULL REFERENCES pharmacy_instruction_templates(id),
    medicine_id UUID,
    age_min INT,
    age_max INT,
    frequency VARCHAR(50),
    dosage VARCHAR(100),
    duration INT,
    is_default BOOLEAN
);
```

### Obat Racikan Advanced
```sql
ALTER TABLE pharmacy_compounded_medicines ADD COLUMN (
    labor_cost DECIMAL(10,2),
    packaging_cost DECIMAL(10,2),
    materials_cost DECIMAL(10,2),
    profit_margin_percentage DECIMAL(5,2),
    total_cost DECIMAL(15,2)
);

ALTER TABLE pharmacy_compound_components ADD COLUMN (
    component_cost DECIMAL(10,2),
    waste_percentage DECIMAL(5,2)
);
```

### Alert History
```sql
CREATE TABLE pharmacy_alert_histories (
    id UUID PRIMARY KEY,
    alert_id UUID NOT NULL REFERENCES pharmacy_safety_alerts(id),
    action VARCHAR(50),
    action_notes TEXT,
    action_by UUID NOT NULL,
    action_at TIMESTAMP,
    status_before VARCHAR(50),
    status_after VARCHAR(50)
);
```

### KFA Mapping
```sql
CREATE TABLE pharmacy_kfa_mapping (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    medicine_id UUID NOT NULL,
    kfa_code VARCHAR(50),
    kfa_name VARCHAR(200),
    kfa_unit VARCHAR(20),
    last_sync_date TIMESTAMP,
    is_valid BOOLEAN DEFAULT true
);
```

---

## 🔧 SERVICE LAYER ARCHITECTURE

### Core Services (akan dibuat):
1. `PharmacyStockTransferService` - 8 methods
2. `PharmacyStockOpnameService` - 6 methods
3. `PharmacyInstructionService` - 5 methods
4. `PharmacyCompoundingService` - 7 methods
5. `PharmacyEtiketService` - 4 methods
6. `PharmacyUsageAnalysisService` - 5 methods
7. `PharmacyRegulationReportService` - 6 methods
8. `PharmacyFinancialReportService` - 8 methods
9. `PharmacyDefectaService` - 3 methods
10. `PharmacyGeneralLedgerService` - 4 methods
11. `SatuSehatPharmacyIntegrationService` - 5 methods
12. `PharmacyExternalBridgeService` - 4 methods

**Total: 12 Services, 65+ Methods**

---

## 📈 EXPECTED IMPROVEMENTS

### Current Status (Phase 1)
- ✅ 18 Database Tables
- ✅ 14 Models
- ✅ 2 Services
- ✅ 2 Controllers
- ✅ 22 API Endpoints

### After Phase 2 (Complete)
- 📈 30+ Database Tables
- 📈 30+ Models
- 📈 14 Services (12 new + 2 existing)
- 📈 8 Controllers (6 new + 2 existing)
- 📈 80+ API Endpoints

---

## 🎯 IMPLEMENTATION PRIORITY

**Priority 1 (URGENT - Operational):**
1. Mutasi & Transfer Stok
2. Stok Opname Elektronik
3. Laporan Defecta
4. Obat Racikan Cost Calculation

**Priority 2 (HIGH - Business Intelligence):**
5. Laporan Analisis Penggunaan (Fast/Slow Moving)
6. Laporan Keuangan Farmasi
7. Alert History & Audit
8. Etiket & Label Thermal

**Priority 3 (MEDIUM - Compliance):**
9. Laporan Narkotika/Psikotropika
10. KFA SatuSehat Mapping
11. Aturan Pakai Templates
12. External Bridge Integration

---

## 💾 FILES TO CREATE (PHASE 2)

### Models (8 files)
```
src/Domains/Pharmacy/Infrastructure/Persistence/Models/
├── PharmacyStockTransferModels.php (2 models)
├── PharmacyStockOpnameModels.php (2 models)
├── PharmacyInstructionModels.php (2 models)
├── PharmacyAlertHistoryModels.php (1 model)
└── PharmacyKFAMappingModels.php (1 model)
```

### Services (12 files)
```
src/Domains/Pharmacy/Application/Services/
├── PharmacyStockTransferService.php
├── PharmacyStockOpnameService.php
├── PharmacyInstructionService.php
├── PharmacyCompoundingService.php
├── PharmacyEtiketService.php
├── PharmacyUsageAnalysisService.php
├── PharmacyRegulationReportService.php
├── PharmacyFinancialReportService.php
├── PharmacyDefectaService.php
├── PharmacyGeneralLedgerService.php
├── SatuSehatPharmacyIntegrationService.php
└── PharmacyExternalBridgeService.php
```

### Controllers (6 files)
```
src/Domains/Pharmacy/Presentation/Controllers/
├── PharmacyStockTransferController.php
├── PharmacyStockOpnameController.php
├── PharmacyInstructionController.php
├── PharmacyReportingController.php
├── PharmacyIntegrationController.php
└── PharmacyEtiketController.php
```

### Migrations (2 files)
```
database/migrations/
├── 2026_06_05_create_pharmacy_inventory_advanced_tables.php
└── 2026_06_05_create_pharmacy_reporting_and_integration_tables.php
```

### Requests (10 files)
```
src/Domains/Pharmacy/Presentation/Requests/
├── PharmacyStockTransferRequest.php
├── PharmacyStockOpnameRequest.php
├── PharmacyInstructionTemplateRequest.php
├── PharmacyCompoundedMedicineRequest.php
├── PharmacyEtiketRequest.php
├── PharmacyReportFilterRequest.php
├── PharmacyDefectaRequest.php
├── PharmacyKFAMappingRequest.php
├── SatuSehatSyncRequest.php
└── PharmacyExternalBridgeRequest.php
```

### Total New Files: 38 Files
**Estimated LOC: 15,000+ lines**

---

## 🚀 NEXT STEPS

1. **Approve Phase 2 Implementation** - Proceed dengan kompleks features?
2. **Set Priority** - Mana fitur yang paling urgent?
3. **Choose Starting Point** - Mulai dari Transfer Stok atau Stok Opname?
4. **Database Backup** - Siapkan backup sebelum add new tables

---

**Status**: Ready for Phase 2 Implementation
**Kompleksitas**: HIGH (Enterprise-grade)
**Estimasi Waktu**: 4-6 jam untuk implementasi lengkap
**Database**: PostgreSQL (UUID-based)
**Framework**: Laravel 11 DDD Architecture

Siap lanjut ke Phase 2? Mau mulai dari mana?
