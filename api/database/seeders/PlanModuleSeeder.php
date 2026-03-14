<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanModuleSeeder extends Seeder
{
    /**
     * Mapping module name -> akses per plan.
     *
     * 'limit' => null  = unlimited
     * 'limit' => N     = maksimal N record (enforce di service layer)
     * 'is_accessible'  => false = module dikunci untuk plan ini
     */
    private array $matrix = [
        // ── Selalu tersedia di semua plan ──────────────────────────────────
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

        // ── Tersedia di Basic & Pro, dikunci di Free ───────────────────────
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

        // ── Hanya Pro ──────────────────────────────────────────────────────
        'Electronic Medical Record' => [
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
        $plans = Plan::all()->keyBy('slug');
        $modules = Module::whereNull('parent_id')->get()->keyBy('name');

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

                $plan->modules()->syncWithoutDetaching([
                    $module->id => [
                        'is_accessible' => $pivot['is_accessible'],
                        'limit' => $pivot['limit'],
                    ],
                ]);
            }

            $this->command->info("Module '{$moduleName}' ✓");
        }

        $this->command->info('PlanModuleSeeder selesai.');
    }
}
