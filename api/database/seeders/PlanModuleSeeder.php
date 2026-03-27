<?php

namespace Database\Seeders;

use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\Subscriptions\Infrastructure\Persistence\Models\PlanModel;
use Illuminate\Database\Seeder;

class PlanModuleSeeder extends Seeder
{
    /**
     * Mapping module name → akses per plan.
     * 'limit' => null  = unlimited
     * 'limit' => N     = maksimal N record
     */
    private array $matrix = [
        'Dashboard' => [
            'free' => ['is_accessible' => true, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Rawat Jalan' => [
            'free' => ['is_accessible' => true, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Rawat Inap' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Fasilitas' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Master' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Setting' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Electronic Medical Record' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        // BARU: Farmasi — Basic & Pro saja
        'Farmasi' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => true, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
        'Office' => [
            'free' => ['is_accessible' => false, 'limit' => null],
            'basic' => ['is_accessible' => false, 'limit' => null],
            'pro' => ['is_accessible' => true, 'limit' => null],
        ],
    ];

    public function run(): void
    {
        $plans = PlanModel::all()->keyBy('slug');
        $modules = ModuleModel::whereNull('parent_id')->get()->keyBy('name');

        foreach ($this->matrix as $moduleName => $planAccess) {
            $module = $modules->get($moduleName);

            if (!$module) {
                $this->command->warn("Module '{$moduleName}' tidak ditemukan, dilewati.");
                continue;
            }

            foreach ($planAccess as $slug => $pivot) {
                $plan = $plans->get($slug);

                if (!$plan) {
                    $this->command->warn("Plan '{$slug}' tidak ditemukan, dilewati.");
                    continue;
                }

                $module->plans()->syncWithoutDetaching([
                    $plan->id => [
                        'is_accessible' => $pivot['is_accessible'],
                        'limit' => $pivot['limit'],
                    ],
                ]);
            }

            $this->command->info("✓ '{$moduleName}' plan access seeded.");
        }
    }
}
