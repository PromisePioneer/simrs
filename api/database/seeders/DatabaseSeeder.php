<?php

namespace Database\Seeders;

use App\Models\Degree;
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
            PaymentMethodTypeSeeder::class,
            PaymentMethodSeeder::class,
            PatientSeeder::class,
            RoleSeeder::class,
            DegreeSeeder::class,
            TenantModuleSeeder::class,
            PlanSeeder::class,
            PlanModuleSeeder::class,
            TenantSubscriptionSeeder::class,
            UserSeeder::class,
            RegistrationInstitutionSeeder::class,
            IndoRegionProvinceSeeder::class,
            IndoRegionRegencySeeder::class,
            IndoRegionDistrictSeeder::class,
            IndoRegionVillageSeeder::class,
        ]);
    }
}
