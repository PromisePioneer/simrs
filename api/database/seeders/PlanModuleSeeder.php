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
        $modules = Module::pluck('id')->toArray();

        foreach ($plans as $plan) {
            // Default allowed list
            $allowed = [];

            // Basic → semua module kecuali Setting
            if ($plan->slug === 'basic') {
                $except = Module::where('name', 'Setting')->pluck('id')->toArray();
                $allowed = array_diff($modules, $except);
            } // Pro → semua module
            else if ($plan->slug === 'pro') {
                $allowed = $modules;
            }

            // Eloquent: pivot create/update (tanpa hapus pivot lama)
            $pivotData = [];

            foreach ($allowed as $moduleId) {
                $pivotData[$moduleId] = ['is_accessible' => true];
            }

            $plan->modules()->syncWithoutDetaching($pivotData);
        }
    }
}
