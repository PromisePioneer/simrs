<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProfessionSeeder::class,
            TenantSeeder::class,
            DepartmentSeeder::class,
            PaymentMethodTypeSeeder::class,
            PaymentMethodSeeder::class,
            PoliSeeder::class,
            PatientSeeder::class,
            RoleSeeder::class,
            DegreeSeeder::class,
            MedicineCategorySeeder::class,
            MedicineWarehouseSeeder::class,
            TenantModuleSeeder::class,
            PlanSeeder::class,
            PlanModuleSeeder::class,
            TenantSubscriptionSeeder::class,
            UserSeeder::class,
            MedicineSeeder::class,
            BuildingSeeder::class,
            WardSeeder::class,
            RegistrationInstitutionSeeder::class,
            IndoRegionProvinceSeeder::class,
            IndoRegionRegencySeeder::class,
            IndoRegionDistrictSeeder::class,
            IndoRegionVillageSeeder::class,
        ]);
    }
}
