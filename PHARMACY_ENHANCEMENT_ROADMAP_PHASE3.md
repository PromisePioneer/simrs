# PHARMACY ENHANCEMENT ROADMAP - OPTIMALISASI FITUR KOMPLEKS

**Date:** 2026-06-10  
**Status:** Audit & Enhancement Planning  
**Target:** Maksimalkan 6 fitur utama farmasi SIMRS Khanza

---

## 📊 AUDIT HASIL - FITUR YANG SUDAH ADA

### ✅ Existing Components (71 files)

**Services (16 files):**
1. MedicineBatchService
2. MedicineBatchStockService
3. MedicineCategoryService
4. MedicineRackService
5. MedicineService
6. MedicineStockMovementService
7. MedicineUnitTypeService
8. MedicineWarehouseService
9. PharmacyDefectaService *(Phase 2)*
10. PharmacyFinancialReportService *(Phase 2)*
11. PharmacyPrescriptionAndSalesService
12. PharmacyProcurementService
13. PharmacyStockOpnameService *(Phase 2)*
14. PharmacyStockTransferService *(Phase 2)*
15. SatuSehatPharmacyIntegrationService *(Phase 2)*

**Models (9 files):**
- MedicineBatchModel
- MedicineBatchStockModel
- MedicineCategoryModel
- MedicineModel
- MedicineRackModel
- MedicineStockMovementModel
- MedicineUnitModel
- MedicineUnitTypeModel
- MedicineWarehouseModel
- PharmacyAdvancedModels (16 models)
- PharmacyPrescriptionAndSalesModels
- PharmacyProcurementModels
- PharmacySupplier

**Controllers (13 files):**
- 8 Medicine Master Data Controllers
- 4 Phase 2 Advanced Controllers
- 1 Prescription/Sales Controller
- 1 Procurement Controller

---

## 🎯 FEATURE ENHANCEMENT MATRIX

| Feature | Status | Gap | Priority |
|---------|--------|-----|----------|
| 1. Master Data Obat | ✅ 70% | Hierarchy units, Producer/Distributor relations | P1 |
| 2. Multi Gudang | ✅ 80% | Cross-warehouse visibility, location tracking | P1 |
| 3. Surat Pemesanan | ✅ 60% | Approval workflow, PBF integration | P1 |
| 4. Registrasi Penerimaan | ✅ 65% | Batch registration, GRN automation | P1 |
| 5. Retur Obat | ✅ 50% | Supplier retur, patient retur tracking | P2 |
| 6. Mutasi/Transfer | ✅ 95% | *(Phase 2 complete)* | ✓ |
| 7. Stok Opname | ✅ 95% | *(Phase 2 complete)* | ✓ |
| 8. Expired Alert | ✅ 70% | Escalation, auto-hold | P1 |
| 9. Min Stock Alert | ✅ 75% | Smart thresholds, auto-PO | P1 |
| 10. Batch Tracing | ⚠️ 40% | Distribution tracking, recall workflow | P1 |
| 11. E-Resep | ✅ 60% | Clinical validation, integration | P2 |
| 12. Telaah Resep | ✅ 50% | Admin/Farmasetik/Klinis checks | P2 |
| 13. Penjualan Obat | ✅ 85% | Stock deduction, billing integration | ✓ |
| 14. Obat Racikan | ⚠️ 30% | Component calc, compounding cost | P2 |
| 15. Penjualan OTC | ✅ 70% | Free sale, customer type | P2 |
| 16. Retur Pasien | ⚠️ 45% | Restock tracking, billing reverse | P2 |
| 17. Aturan Pakai | ✅ 55% | Template system, dosage calc | P2 |
| 18. Cetak Etiket | ✅ 60% | Thermal printer, label format | P2 |
| 19. High Alert/LASA | ⚠️ 25% | Classification, visual marking | P2 |
| 20. Usage Analysis | ✅ 85% | Fast/slow moving, trends | ✓ |
| 21. Narcotics Report | ✅ 80% | DINKES/BPOM format | ✓ |
| 22. Financial Report | ✅ 95% | *(Phase 2 complete)* | ✓ |
| 23. Defecta Report | ✅ 95% | *(Phase 2 complete)* | ✓ |
| 24. GL Mutations | ⚠️ 50% | Journal entries, reconciliation | P2 |
| 25. KFA Mapping | ✅ 90% | *(Phase 2 complete)* | ✓ |
| 26. External Bridge | ⚠️ 40% | System integration, data sync | P3 |

**Summary:**
- ✅ Complete (13 features) = 50%
- ✅ Advanced (8 features) = 31%
- ⚠️ Partial (5 features) = 19%
- **Overall:** 76% implementation

---

## 🚀 ENHANCEMENT ROADMAP - 3 PHASES

### PHASE 3A: PROCUREMENT & RECEIVING (HIGH PRIORITY)
*Duration: 2 weeks | Focus: Supplier integration & receipt automation*

#### 3A.1 Enhanced Master Data
**What's missing:**
- Hierarchical unit system (tablet → strip → box → carton)
- Producer/Distributor relationship mapping
- Medicine classification (Narcotics, Psychotropics, High Alert, LASA)
- Cross-reference code system (Internal code, Barcode, KFA code, Supplier code)

**Files to create:**
- `PharmacyMedicineHierarchyService.php` - Unit hierarchy management
- `PharmacyMedicineClassificationService.php` - Drug classification
- `PharmacySupplierIntegrationService.php` - Supplier master data

#### 3A.2 Purchase Order Workflow
**What's missing:**
- Multi-step approval workflow (Create → Submit → Review → Approve → Confirm)
- PBF/Supplier integration
- Budget control & approval limits
- Purchase order to receiving automation

**Files to create:**
- Enhance `PharmacyProcurementService.php` with:
  - `createPurchaseOrder()` - with approval routing
  - `submitForApproval()` - workflow management
  - `approvePurchaseOrder()` - multi-level approval
  - `confirmPurchaseOrder()` - send to supplier
  - `trackDelivery()` - delivery status

#### 3A.3 Goods Receipt Automation
**What's missing:**
- GRN (Goods Receipt Note) auto-generation
- Batch number & expiry date registration
- Quality inspection integration
- Stock placement (rack/bin assignment)
- Receipt variance handling (under/over quantity, damaged goods)

**Files to create:**
- `PharmacyGoodsReceiptService.php` - GRN processing
- `PharmacyQualityInspectionService.php` - Inspection workflow
- Models: GoodsReceipt, QualityInspection, ReceiptVariance

---

### PHASE 3B: SAFETY & COMPLIANCE (HIGH PRIORITY)
*Duration: 2 weeks | Focus: Alerts, batch tracking, regulatory compliance*

#### 3B.1 Advanced Expiry Management
**What's missing:**
- Escalation alerts (7 days → 3 days → 1 day)
- Auto-hold near expiry
- Near-expiry sales priority
- Expiry report automation
- FIFO enforcement

**Files to create:**
- Enhance `PharmacyDefectaService.php` with expiry module
- `PharmacyExpiryAlertService.php` - Alert management
- Models: ExpiryAlert, ExpiryHold

#### 3B.2 Batch Tracing & Recall
**What's missing:**
- Full batch lifecycle tracking
- Distribution chain tracking (which patient got batch X?)
- Recall workflow automation
- Impact analysis (how many units recalled?)
- Compliance reporting

**Files to create:**
- `PharmacyBatchTracingService.php` - Full traceability
- `PharmacyRecallManagementService.php` - Recall workflow
- Models: BatchDistribution, RecallLog, RecallImpact
- Enhanced `PharmacyBatchRecallHistory` model

#### 3B.3 High Alert & LASA System
**What's missing:**
- LASA (Look Alike Sound Alike) classification
- High Alert medicine flag
- Visual marking rules
- Warning system during dispensing
- Separation/isolation recommendations

**Files to create:**
- `PharmacyHighAlertService.php` - High alert management
- Models: HighAlertClassification, LASAClassification
- Enhanced validation in sales/dispensing

---

### PHASE 3C: PRESCRIPTION & DISPENSING (HIGH PRIORITY)
*Duration: 2.5 weeks | Focus: E-Resep, clinical validation, compounding*

#### 3C.1 E-Resep Integration
**What's missing:**
- Direct capture from doctor's prescription input
- Real-time availability check
- Drug interaction checking
- Allergic/contraindication screening
- Prescription verification workflow

**Files to create:**
- Enhance `PharmacyPrescriptionAndSalesService.php` with:
  - `captureEPrescription()` - from doctor input
  - `checkDrugInteractions()` - interaction engine
  - `checkContraindications()` - patient allergies
  - `verifyPrescription()` - pharmacist review

#### 3C.2 Clinical Pharmacy Review
**What's missing:**
- 3-level review (administrative, pharmaceutical, clinical)
- Therapeutic duplication check
- Dosage appropriateness validation
- Route of administration validation
- Duration logic

**Files to create:**
- `PharmacyPrescriptionReviewService.php` - Review workflow
- Models: PrescriptionReview, ReviewComment, RejectionReason

#### 3C.3 Compounding Management
**What's missing:**
- Component-level management (individual tablets/capsules)
- Compounding cost calculation
- Embalase (packaging) management
- Compounding labor cost
- Batch compounding for multiple prescriptions

**Files to create:**
- `PharmacyCompoundingService.php` - Full compounding logic
- Models: CompoundingFormula, CompoundingBatch, CompoundingLog
- Calculations for: Component qty, cost per dose, labor time

#### 3C.4 Label & Etiket Generation
**What's missing:**
- Dynamic etiket templates (thermal printer format)
- Dosage instruction printing
- Barcode/QR code generation
- Patient-specific warning labels
- High Alert visual marking

**Files to create:**
- `PharmacyLabelGenerationService.php` - Label templates & generation
- `PharmacyThermalPrinterService.php` - Thermal printer integration
- Models: LabelTemplate, PrinterConfig

---

### PHASE 3D: FINANCIAL & REPORTING (MEDIUM PRIORITY)
*Duration: 2 weeks | Focus: Advanced analytics, GL integration*

#### 3D.1 General Ledger Integration
**What's missing:**
- Automatic GL entry generation for all pharmacy transactions
- Cost allocation (COGS, overhead, etc.)
- Manual journal posting for variances
- GL reconciliation
- Trial balance reports

**Files to create:**
- `PharmacyGeneralLedgerService.php` - GL integration
- Models: PharmacyGLEntry, GLReconciliation
- Enhanced `PharmacyGeneralLedgerStock` model

#### 3D.2 Advanced Usage Analysis
**What's missing:**
- ABC/XYZ analysis (fast/slow moving + cost)
- Therapeutic category trends
- Seasonality analysis
- Forecasting (demand projection)
- Consumption vs. target analysis

**Files to create:**
- `PharmacyUsageAnalysisService.php` - Advanced analytics
- Models: UsageAnalysis, DemandForecast, CategoryTrend

#### 3D.3 Customer Return Processing
**What's missing:**
- Supplier return workflow (RMA tracking)
- Patient return processing (restock, credit)
- Return reason analysis
- Quality issue tracking
- Credit memo generation

**Files to create:**
- `PharmacyReturnManagementService.php` - Return processing
- Models: SupplierReturn, PatientReturn, ReturnAnalysis

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 3A: Procurement (Week 1-2)
- [ ] Master data hierarchy system
- [ ] Purchase order workflow
- [ ] GRN automation
- [ ] Quality inspection module
- [ ] Database migrations (6 new tables)
- [ ] Service classes (5 new services)
- [ ] Controllers (3 new controllers)
- [ ] Unit tests

### Phase 3B: Safety (Week 1-2, parallel)
- [ ] Expiry management enhancement
- [ ] Batch tracing system
- [ ] Recall management workflow
- [ ] High Alert/LASA classification
- [ ] Database migrations (5 new tables)
- [ ] Service classes (3 new services)
- [ ] Alert engine & notifications
- [ ] Unit tests

### Phase 3C: Prescribing (Week 1-2.5)
- [ ] E-Resep integration
- [ ] Clinical validation engine
- [ ] Prescription review workflow
- [ ] Compounding management
- [ ] Label generation & etiket
- [ ] Database migrations (8 new tables)
- [ ] Service classes (5 new services)
- [ ] Controllers (3 new controllers)
- [ ] Thermal printer integration
- [ ] Unit tests

### Phase 3D: Financials (Week 2)
- [ ] GL integration
- [ ] Usage analysis engine
- [ ] Customer return processing
- [ ] Database migrations (4 new tables)
- [ ] Service classes (3 new services)
- [ ] Advanced reporting
- [ ] Unit tests

---

## 💾 DATABASE TABLES TO CREATE

### Phase 3A: Procurement (6 tables)
1. `pharmacy_purchase_orders` - PO master
2. `pharmacy_purchase_order_items` - PO line items
3. `pharmacy_goods_receipts` - GRN records
4. `pharmacy_receipt_items` - Receipt line items
5. `pharmacy_quality_inspections` - QC records
6. `pharmacy_receipt_variances` - Variance tracking

### Phase 3B: Safety (5 tables)
7. `pharmacy_batch_distributions` - Batch to patient tracing
8. `pharmacy_recall_logs` - Recall history
9. `pharmacy_recall_impacts` - Impact analysis
10. `pharmacy_high_alert_classifications` - High Alert flag
11. `pharmacy_lasa_classifications` - LASA grouping

### Phase 3C: Prescribing (8 tables)
12. `pharmacy_eprescriptions` - E-Resep records
13. `pharmacy_prescription_reviews` - Review workflow
14. `pharmacy_drug_interactions` - Interaction matrix
15. `pharmacy_compounding_formulas` - Recipe management
16. `pharmacy_compounding_batches` - Batch records
17. `pharmacy_label_templates` - Etiket templates
18. `pharmacy_printer_configs` - Printer setup
19. `pharmacy_compounding_logs` - Transaction log

### Phase 3D: Financials (4 tables)
20. `pharmacy_gl_entries` - GL posting
21. `pharmacy_usage_analysis` - ABC/XYZ analysis
22. `pharmacy_demand_forecasts` - Forecast data
23. `pharmacy_return_management` - Returns tracking

**Total new tables: 23**

---

## 🔧 PRIORITY EXECUTION PLAN

**Immediate (This Sprint):**
1. Start Phase 3A (Procurement) - critical for PO automation
2. Start Phase 3B (Safety) - critical for compliance
3. Parallel Phase 3C (Prescribing) - needed for dispensing

**Next Sprint:**
4. Complete Phase 3A & 3B
5. Complete Phase 3C
6. Phase 3D (Financials)

**Timeline:** 6-8 weeks total for full enhancement

---

## 📊 DELIVERABLES SUMMARY

| Component | Phase 3A | Phase 3B | Phase 3C | Phase 3D | Total |
|-----------|----------|----------|----------|----------|-------|
| Services | 3 | 3 | 5 | 3 | 14 |
| Models | 6 | 5 | 8 | 4 | 23 |
| Controllers | 3 | 2 | 3 | 2 | 10 |
| Migrations | 6 | 5 | 8 | 4 | 23 |
| Routes | 25 | 18 | 30 | 15 | 88 |
| **Total** | **~30 files** | **~25 files** | **~45 files** | **~20 files** | **~120 files** |

---

## ✨ IMPACT

Once complete, pharmacy system will have:
- ✅ Full procurement automation (PO → GRN → Payment)
- ✅ Complete safety & compliance (Batch tracking, recalls, alerts)
- ✅ End-to-end prescribing (E-Resep → Review → Compounding → Dispensing)
- ✅ Advanced financial analytics (GL integration, usage analysis)
- ✅ Regulatory reporting (DINKES, BPOM, SatuSehat)

**Result:** 100% modern pharmacy management system per SIMRS standards

---

**Next Step:** Approve Phase 3A implementation to start with procurement automation.
