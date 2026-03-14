<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // ── Referensi dasar ─────────────────────────────────────────────
            ProfessionSeeder::class,
            DegreeSeeder::class,
            DepartmentSeeder::class,
            PoliSeeder::class,
            RegistrationInstitutionSeeder::class,
            PaymentMethodTypeSeeder::class,
            PaymentMethodSeeder::class,
            RoomTypeSeeder::class,
            MedicineCategorySeeder::class,
            MedicineWarehouseSeeder::class,

            // ── Region (besar, taruh awal supaya tidak timeout di tengah) ───
            IndoRegionProvinceSeeder::class,
            IndoRegionRegencySeeder::class,
            IndoRegionDistrictSeeder::class,
            IndoRegionVillageSeeder::class,

            // ── Role (harus sebelum User) ────────────────────────────────────
            RoleSeeder::class,

            // ── Module & Permission ──────────────────────────────────────────
            // TenantModuleSeeder harus duluan — PermissionSeeder butuh module_id
            TenantModuleSeeder::class,
            PermissionSeeder::class,

            // ── Plan & module access ─────────────────────────────────────────
            PlanSeeder::class,
            PlanModuleSeeder::class,

            // ── Tenant & subscription ────────────────────────────────────────
            TenantSeeder::class,
            TenantSubscriptionSeeder::class,

            // ── User (butuh tenant + role + permission sudah ada) ────────────
            UserSeeder::class,

            // ── Data operasional ─────────────────────────────────────────────
            PatientSeeder::class,
            MedicineSeeder::class,
            BuildingSeeder::class,
            WardSeeder::class,
            RoomSeeder::class,
//            InpatientAdmissionSeeder::class,
        ]);
    }
}
