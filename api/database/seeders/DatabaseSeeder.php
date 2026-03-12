<?php

namespace Database\Seeders;

use App\Models\Degree;
use App\Models\InpatientAdmission;
use App\Models\TenantDefaultRole;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use AzisHapidin\IndoRegion\IndoRegion;
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
            RoomTypeSeeder::class,
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
            RoomSeeder::class,
            InpatientAdmissionSeeder::class,
            IndoRegionDistrictSeeder::class,
            IndoRegionVillageSeeder::class,
        ]);
    }
}
