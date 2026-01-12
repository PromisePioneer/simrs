<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanModuleSeeder extends Seeder
{
    public function run(): void
    {
        $plans = Plan::all();
        $allModules = Module::pluck('id')->toArray();

        // Prepare pivot data
        $pivotData = [];
        foreach ($allModules as $moduleId) {
            $pivotData[$moduleId] = ['is_accessible' => true];
        }

        foreach ($plans as $plan) {
            // Semua plan dapat akses ke semua module
            $plan->modules()->sync($pivotData);

            $this->command->info("Plan '{$plan->name}' assigned with " . count($allModules) . " modules");
        }

        $this->command->info('Plan modules seeding completed!');
    }
}
