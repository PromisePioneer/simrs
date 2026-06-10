# Pharmacy System - Deployment Checklist & Integration Guide

## ✅ Pre-Deployment Checklist

### Code & Files
- [x] All PHP files created and syntax validated
- [x] 2 database migrations created
- [x] 14 Eloquent models created
- [x] 2 Application services created
- [x] 2 API controllers created
- [x] 22 API endpoints defined
- [x] Configuration file created
- [x] Service provider created
- [x] Routes file created
- [x] Request validation classes created

### Database
- [x] Migration 1: Procurement tables (7 tables)
- [x] Migration 2: Prescriptions & Sales tables (11 tables)
- [x] All foreign keys use UUID type matching existing schema
- [x] All tables include tenant_id for multi-tenancy
- [x] Proper indexing on status, dates, tenant_id

### Dependencies
- [ ] Check Laravel version (requires 11+)
- [ ] Check Illuminate\Support\Facades availability
- [ ] Verify Spatie Permission package installed (if using role-based access)

## 🔧 Integration Steps

### Step 1: Register Service Provider

**File**: `config/app.php`

```php
'providers' => [
    // ... existing providers ...
    
    Domains\Pharmacy\Infrastructure\Providers\PharmacyServiceProvider::class,
],
```

### Step 2: Verify Namespaces

Check that the following base paths exist:
- `src/Domains/Pharmacy/` ✓
- `database/migrations/` ✓
- `config/` ✓

### Step 3: Run Migrations

```bash
cd api
php artisan migrate
```

Expected output:
```
2026_06_05_create_pharmacy_procurement_tables ... DONE
2026_06_05_create_pharmacy_prescriptions_and_sales_tables ... DONE
```

### Step 4: Verify Tables Created

```bash
php artisan tinker
```

```php
// Check tables exist
Schema::getTables();

// Verify key tables
Schema::hasTable('pharmacy_suppliers');
Schema::hasTable('pharmacy_purchase_orders');
Schema::hasTable('pharmacy_prescriptions');
Schema::hasTable('pharmacy_sales');
```

### Step 5: Configure Permissions (if using Spatie)

Create a seeder or artisan command:

```php
<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class PharmacyPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
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

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $pharmacist = Role::firstOrCreate(['name' => 'pharmacist']);
        $manager = Role::firstOrCreate(['name' => 'pharmacy-manager']);

        // Assign permissions to pharmacist
        $pharmacist->syncPermissions([
            'pharmacy.prescription.review',
            'pharmacy.prescription.approve',
            'pharmacy.prescription.dispense',
            'pharmacy.sales.create',
            'pharmacy.sales.complete',
            'pharmacy.safety_alert.acknowledge',
        ]);

        // Assign permissions to manager
        $manager->syncPermissions([
            'pharmacy.po.create',
            'pharmacy.po.approve',
            'pharmacy.grn.create',
            'pharmacy.grn.complete',
            'pharmacy.safety_alert.acknowledge',
        ]);
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=PharmacyPermissionSeeder
```

### Step 6: Test API Endpoints

```bash
# Create test user token
php artisan tinker
$user = User::first();
$token = $user->createToken('test')->plainTextToken;

# Test procurement endpoint
curl -X GET http://localhost/api/pharmacy/safety-alerts \
  -H "Authorization: Bearer $token"

# Expected response:
# { "success": true, "data": { ... } }
```

### Step 7: Publish Configuration (Optional)

```bash
php artisan vendor:publish --tag=pharmacy-config
```

This creates `config/pharmacy.php` in your project root where you can override settings.

## 📋 Environment Configuration

Add to `.env`:

```env
# Pharmacy Stock Thresholds
PHARMACY_STOCK_LOW_THRESHOLD=10
PHARMACY_STOCK_CRITICAL_THRESHOLD=5
PHARMACY_EXPIRED_SOON_THRESHOLD=30

# Pharmacy Pricing
PHARMACY_DEFAULT_DISCOUNT=0
PHARMACY_DEFAULT_TAX=10
PHARMACY_DEFAULT_ITEM_DISCOUNT=10
PHARMACY_SALES_TAX_PERCENTAGE=10

# Prescription Settings
PHARMACY_PRESCRIPTION_VALIDITY_DAYS=30
PHARMACY_ENABLE_LASA_CHECKING=true
PHARMACY_ENABLE_INTERACTION_CHECKING=true
PHARMACY_REQUIRE_THREE_STAGE_REVIEW=true
PHARMACY_AUTO_GENERATE_ETIKET=true

# Safety & Sales
PHARMACY_ENABLE_HIGH_ALERT_TRACKING=true
PHARMACY_ALLOW_OTC_SALES=true
PHARMACY_BATCH_DEPLETION_STRATEGY=fifo

# Warehouse Codes
PHARMACY_MAIN_WAREHOUSE=GDG-UTAMA
PHARMACY_OUTPATIENT_WAREHOUSE=APT-RAWAT-JALAN
PHARMACY_INPATIENT_WAREHOUSE=APT-RAWAT-INAP
PHARMACY_EMERGENCY_WAREHOUSE=DEPO-IGD

# Numbering
PHARMACY_PO_PREFIX=PO
PHARMACY_GRN_PREFIX=GRN
PHARMACY_RETURN_PREFIX=RET
PHARMACY_PRESCRIPTION_PREFIX=RX
PHARMACY_SALES_PREFIX=SAL
PHARMACY_PATIENT_RETURN_PREFIX=PRR
PHARMACY_COMPOUND_PREFIX=CMP

# Notifications
PHARMACY_SEND_ALERTS=true
PHARMACY_ALERT_CHANNELS=database,mail
PHARMACY_SEND_REVIEW_NOTIFICATIONS=true

# Audit
PHARMACY_ENABLE_AUDIT_LOGGING=true
PHARMACY_LOG_SENSITIVE_OPERATIONS=true
PHARMACY_AUDIT_RETENTION_DAYS=365

# Integration
PHARMACY_INTEGRATE_WITH_BILLING=true
PHARMACY_INTEGRATE_WITH_INVENTORY=true
PHARMACY_INTEGRATE_WITH_CLINICAL=true
```

## 🚀 Post-Deployment Verification

### 1. Check Migrations
```bash
php artisan migrate:status | grep pharmacy
```

Should show all pharmacy migrations as "Ran".

### 2. Test Service Registration
```bash
php artisan tinker

app(\Domains\Pharmacy\Application\Services\PharmacyProcurementService::class)
app(\Domains\Pharmacy\Application\Services\PharmacyPrescriptionAndSalesService::class)
```

Should return service instances without errors.

### 3. Test Database Connections
```bash
php artisan tinker

// Check tables
DB::table('pharmacy_suppliers')->count()
DB::table('pharmacy_purchase_orders')->count()
DB::table('pharmacy_prescriptions')->count()
DB::table('pharmacy_sales')->count()

// All should return 0 (empty tables)
```

### 4. Test API Routes
```bash
php artisan route:list | grep pharmacy

// Should show 22 routes starting with:
// POST   /api/pharmacy/purchase-orders
// POST   /api/pharmacy/prescriptions
// etc.
```

### 5. Run Tests
```bash
php artisan test tests/Feature/Pharmacy/

# Or specific test file
php artisan test tests/Feature/Pharmacy/PharmacyWorkflowTest.php
```

## 🔄 Data Migration (if migrating from old system)

### Step 1: Create Migration Script

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySupplier;

class MigratePharmacyData extends Command
{
    protected $signature = 'pharmacy:migrate-data';
    protected $description = 'Migrate pharmacy data from old system';

    public function handle()
    {
        $this->info('Starting pharmacy data migration...');

        // Migrate suppliers
        $oldSuppliers = DB::connection('old_mysql')
            ->table('suppliers')
            ->get();

        foreach ($oldSuppliers as $old) {
            PharmacySupplier::create([
                'tenant_id' => auth()->user()->current_tenant_id,
                'name' => $old->name,
                'code' => $old->code,
                'contact_person' => $old->contact_person,
                'phone' => $old->phone,
                'email' => $old->email,
                'address' => $old->address,
                'city' => $old->city,
                'status' => 'active',
            ]);
        }

        $this->info('Migration completed!');
    }
}
```

Run:
```bash
php artisan pharmacy:migrate-data
```

## 📊 Production Deployment

### 1. Database Backup
```bash
pg_dump simrs_database > backup_before_pharmacy.sql
```

### 2. Run Migrations in Production
```bash
cd /path/to/simrs/api
php artisan migrate --force
```

### 3. Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### 4. Restart Queue Workers (if using)
```bash
php artisan queue:restart
```

### 5. Monitor Logs
```bash
tail -f storage/logs/laravel.log | grep pharmacy
```

## 🔐 Security Considerations

### 1. API Authentication
All endpoints require:
- `auth:sanctum` - User must be authenticated
- `verified` - User email must be verified
- Permission checks in each controller action

### 2. Multi-Tenancy
All queries automatically filtered by `tenant_id`:
```php
// Automatic in queries
PharmacySupplier::where('tenant_id', auth()->user()->current_tenant_id)->get()
```

### 3. Audit Logging
Configure audit logging for sensitive operations:
```env
PHARMACY_ENABLE_AUDIT_LOGGING=true
PHARMACY_LOG_SENSITIVE_OPERATIONS=true
```

### 4. Data Validation
All POST/PUT requests validated with FormRequest classes.

## 🐛 Troubleshooting

### Issue: Routes not found (404)
**Solution**: 
1. Verify PharmacyServiceProvider registered in `config/app.php`
2. Clear routes cache: `php artisan route:clear`
3. Check routes file exists at correct path

### Issue: Database migrations fail
**Solution**:
1. Check PostgreSQL is running
2. Verify database connection in `.env`
3. Run migrations individually to identify the problematic one

### Issue: "Class not found" errors
**Solution**:
1. Clear autoloader: `composer dump-autoload`
2. Verify namespace paths match file locations
3. Check use statements in controllers/services

### Issue: Permission denied errors
**Solution**:
1. Verify user has required permission
2. Check permission names match exactly: `pharmacy.po.create`
3. Run permission seeder if using Spatie

### Issue: Stock not deducted after sale
**Solution**:
1. Verify `completeGoodsReceipt()` was called
2. Check batch stock exists in `medicine_batch_stocks`
3. Verify batch `expiry_date` is set correctly

## 📚 Documentation Files

- `PHARMACY_SYSTEM_DOCUMENTATION.md` - Complete feature documentation
- `PHARMACY_IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `PHARMACY_QUICK_START.md` - Quick start & API usage examples
- `tests/Feature/Pharmacy/PharmacyWorkflowTest.php` - Test examples

## 🎯 Next Steps

1. **Frontend Development**
   - Create React components for PO management
   - Create prescription review UI
   - Create sales/dispensing interface

2. **Integration**
   - Connect with Billing domain for automatic invoicing
   - Connect with Outpatient domain for prescriptions
   - Connect with Inpatient domain for ward dispensing

3. **Reporting**
   - Create pharmacy reports (sales, stock, profit)
   - Create safety alert reports
   - Create usage analysis

4. **Mobile App**
   - Barcode scanning for batch receipt
   - Mobile dispensing interface
   - Patient medication history

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review API documentation in PHARMACY_QUICK_START.md
3. Check logs: `storage/logs/laravel.log`
4. Run tests to identify problems: `php artisan test tests/Feature/Pharmacy/`

---

**Last Updated**: 2026-06-05
**Status**: Ready for Production Deployment
**Framework**: Laravel 11
**Database**: PostgreSQL
