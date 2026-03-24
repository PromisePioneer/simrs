<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Permission;
use App\Models\Tenant;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Throwable;

class TenantModuleSeeder extends Seeder
{
    /**
     * @throws Throwable
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $moduleIds = $this->createModules();
            $this->generateOwnerDefaultPermission();
            $tenants = Tenant::all();

            foreach ($tenants as $tenant) {
                $this->assignPermissionsToRoles($tenant->id);
                $this->createPermissionsForTenant($moduleIds);
            }

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
            $this->command->error('Error seeding tenant modules: ' . $e->getMessage());
            throw $e;
        }
    }

    private function createModules(): array
    {
        $moduleIds = [];

        $modules = [
            [
                'name' => 'Dashboard',
                'parent_id' => null,
                'order' => 1,
                'icon' => 'House',
                'route' => '/dashboard',
                'permissions' => ['Melihat Dashboard'],
            ],
            [
                'name' => 'Master',
                'parent_id' => null,
                'order' => 2,
                'icon' => 'Database',
                'route' => null,
                'permissions' => ['Melihat Master'],
                'children' => [
                    [
                        'name' => 'Module Management',
                        'order' => 3,
                        'icon' => null,
                        'route' => '/master/module',
                        'permissions' => [
                            'Melihat Module Management',
                            'Menambahkan Module Management',
                            'Mengubah Module Management',
                            'Menghapus Module Management',
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Rawat Jalan',
                'parent_id' => null,
                'order' => 3,
                'icon' => 'CalendarDays',
                'route' => '/outpatient',
                'permissions' => [
                    'Melihat Rawat Jalan',
                    'Menambahkan Rawat Jalan',
                    'Mengubah Rawat Jalan',
                    'Menghapus Rawat Jalan',
                ],
            ],
            [
                'name' => 'Rawat Inap',
                'parent_id' => null,
                'order' => 4,
                'icon' => 'Stethoscope',
                'route' => '/inpatient',
                'permissions' => [
                    'Melihat Rawat Inap',
                    'Membuat Rawat Inap',
                    'Mengubah Rawat Inap',
                    'Menghapus Rawat Inap',
                    // Facility
                    'Melihat Gedung',
                    'Membuat Gedung',
                    'Mengubah Gedung',
                    'Menghapus Gedung',
                    'Melihat Ruang Rawat',
                    'Membuat Ruang Rawat',
                    'Mengubah Ruang Rawat',
                    'Menghapus Ruang Rawat',
                    'Melihat Tipe Ruangan',
                    'Membuat Tipe Ruangan',
                    'Mengubah Tipe Ruangan',
                    'Menghapus Tipe Ruangan',
                    'Melihat Ruangan',
                    'Membuat Ruangan',
                    'Mengubah Ruangan',
                    'Menghapus Ruangan',
                    // Bed
                    'Melihat Tempat Tidur',
                    'Membuat Tempat Tidur',
                    'Mengubah Tempat Tidur',
                    'Menghapus Tempat Tidur',
                    // Inpatient Prescription
                    'Melihat Resep Rawat Inap',
                    'Membuat Resep Rawat Inap',
                    'Dispensing Resep Rawat Inap',
                    'Membatalkan Resep Rawat Inap',
                ],
            ],
            [
                'name' => 'Electronic Medical Record',
                'parent_id' => null,
                'order' => 5,
                'icon' => 'Clipboard',
                'route' => '/electronic-medical-record',
                'permissions' => [
                    'Melihat Electronic Medical Record',
                    'Melihat Penebusan Obat',
                    'Menambahkan Penebusan Obat',
                    'Mengubah Penebusan Obat',
                    'Menghapus Penebusan Obat',
                ],
            ],
            [
                'name' => 'Farmasi',
                'parent_id' => null,
                'order' => 6,
                'icon' => 'Pill',
                'route' => '/pharmacy',
                'permissions' => [
                    'Melihat Farmasi',
                    'Melihat Obat',
                    'Menambahkan Obat',
                    'Mengubah Obat',
                    'Menghapus Obat',
                    'Melihat Kategori Obat',
                    'Menambahkan Kategori Obat',
                    'Mengubah Kategori Obat',
                    'Menghapus Kategori Obat',
                    'Melihat Gudang Obat',
                    'Menambahkan Gudang Obat',
                    'Mengubah Gudang Obat',
                    'Menghapus Gudang Obat',
                    'Melihat Rak Obat',
                    'Menambahkan Rak Obat',
                    'Mengubah Rak Obat',
                    'Menghapus Rak Obat',
                    'Melihat Batch Obat',
                    'Menambahkan Batch Obat',
                    'Mengubah Batch Obat',
                    'Menghapus Batch Obat',
                ],
            ],
            [
                'name' => 'Fasilitas',
                'parent_id' => null,
                'order' => 7,
                'icon' => 'Hospital',
                'route' => '/facilities',
                'permissions' => ['Melihat Fasilitas'],
            ],
            // ── Akuntansi ──────────────────────────────────────────────────
            [
                'name' => 'Akuntansi',
                'parent_id' => null,
                'order' => 9,
                'icon' => 'BookOpen',
                'route' => '/accounting?tab=chart-of-accounts',
                'permissions' => [
                    // Akuntansi (general)
                    'Melihat Akuntansi',
                    'Menambahkan Entri Akuntansi',
                    'Mengubah Akuntansi',
                    'Menghapus Akuntansi',
                    // Kategori Akun
                    'Melihat Kategori Akun',
                    'Menambahkan Kategori Akun',
                    'Mengubah Kategori Akun',
                    'Menghapus Kategori Akun',
                    // Jurnal Entri
                    'Melihat Jurnal Entri',
                    'Menambahkan Jurnal Entri',
                    // Laporan Keuangan
                    'Melihat Laporan Keuangan',
                ],
            ],
            [
                'name' => 'Setting',
                'parent_id' => null,
                'order' => 10,
                'icon' => 'Settings',
                'route' => '/settings',
                'permissions' => [
                    'Melihat Setting',
                    'Melihat Role',
                    'Menambahkan Role',
                    'Mengubah Role',
                    'Menghapus Role',
                    'Melihat User Management',
                    'Menambahkan User Management',
                    'Mengubah User Management',
                    'Menghapus User Management',
                ],
            ],
        ];

        foreach ($modules as $moduleData) {
            $this->storeModuleStructure($moduleData, null, $moduleIds);
        }

        return $moduleIds;
    }

    private function storeModuleStructure(array $moduleData, $parentId, array &$moduleIds): void
    {
        $module = Module::updateOrCreate(
            ['name' => $moduleData['name']],
            [
                'parent_id' => $parentId,
                'route' => $moduleData['route'] ?? null,
                'icon' => $moduleData['icon'] ?? null,
                'order' => $moduleData['order'] ?? 0,
            ]
        );

        if (!empty($moduleData['permissions'])) {
            $moduleIds[$module->id] = $moduleData['permissions'];
        }

        if (!empty($moduleData['children'])) {
            foreach ($moduleData['children'] as $childData) {
                $this->storeModuleStructure($childData, $module->id, $moduleIds);
            }
        }
    }

    public function createPermissionsForTenant(array $moduleIds): void
    {
        foreach ($moduleIds as $moduleId => $permissions) {
            foreach ($permissions as $permissionName) {
                Permission::updateOrCreate(
                    ['name' => $permissionName, 'guard_name' => 'sanctum'],
                    ['module_id' => $moduleId]
                );
            }
        }
    }

    private function assignPermissionsToRoles(string $tenantId): void
    {
        setPermissionsTeamId(null);

        $roles = RoleModel::get();
        if ($roles->isEmpty()) {
            $this->command->warn("No roles found for tenant: {$tenantId}");
            return;
        }

        foreach ($roles as $role) {
            if ($role->name === 'Owner') {
                $this->generateOwnerDefaultPermission();
            }
        }

        setPermissionsTeamId(null);
    }

    public function generateOwnerDefaultPermission(): void
    {
        $role = RoleModel::where('name', 'Owner')->first();
        if (!$role) return;

        $permissions = [
            // Dashboard
            'Melihat Dashboard',

            // Setting
            'Melihat Setting',
            'Melihat Role', 'Menambahkan Role', 'Mengubah Role', 'Menghapus Role',
            'Melihat User Management', 'Menambahkan User Management', 'Mengubah User Management', 'Menghapus User Management',

            // Master
            'Melihat Master',
            'Melihat Tipe Pembayaran', 'Menambahkan Tipe Pembayaran', 'Mengubah Tipe Metode Pembayaran', 'Menghapus Tipe Metode Pembayaran',
            'Melihat Profesi', 'Membuat Profesi', 'Mengubah Profesi', 'Menghapus Profesi',
            'Melihat Spesialisasi', 'Membuat Spesialisasi', 'Mengubah Spesialisasi', 'Menghapus Spesialisasi',
            'Melihat Sub Spesialisasi', 'Membuat Sub Spesialisasi', 'Mengubah Sub Spesialisasi', 'Menghapus Sub Spesialisasi',
            'Melihat Lembaga Pendaftaran', 'Menambahkan Lembaga Pendaftaran', 'Mengubah Lembaga Pendaftaran', 'Menghapus Lembaga Pendaftaran',
            'Melihat Gelar', 'Menambahkan Gelar', 'Mengubah Gelar', 'Menghapus Gelar',
            'Melihat Departemen', 'Menambahkan Departemen', 'Mengubah Departemen', 'Menghapus Departemen',
            'Melihat Poli', 'Menambahkan Poli', 'Mengubah Poli', 'Menghapus Poli',

            // Pasien
            'Melihat Pasien', 'Menambahkan Pasien', 'Mengubah Pasien', 'Menghapus Pasien',

            // Rawat Jalan
            'Melihat Rawat Jalan', 'Menambahkan Rawat Jalan', 'Mengubah Rawat Jalan', 'Menghapus Rawat Jalan',

            // EMR
            'Melihat Electronic Medical Record',
            'Melihat Penebusan Obat', 'Menambahkan Penebusan Obat', 'Mengubah Penebusan Obat', 'Menghapus Penebusan Obat',

            // Farmasi
            'Melihat Farmasi',
            'Melihat Obat', 'Menambahkan Obat', 'Mengubah Obat', 'Menghapus Obat',
            'Melihat Kategori Obat', 'Menambahkan Kategori Obat', 'Mengubah Kategori Obat', 'Menghapus Kategori Obat',
            'Melihat Gudang Obat', 'Menambahkan Gudang Obat', 'Mengubah Gudang Obat', 'Menghapus Gudang Obat',
            'Melihat Rak Obat', 'Menambahkan Rak Obat', 'Mengubah Rak Obat', 'Menghapus Rak Obat',
            'Melihat Batch Obat', 'Menambahkan Batch Obat', 'Mengubah Batch Obat', 'Menghapus Batch Obat',

            // Rawat Inap
            'Melihat Rawat Inap', 'Membuat Rawat Inap', 'Mengubah Rawat Inap', 'Menghapus Rawat Inap',
            'Melihat Gedung', 'Membuat Gedung', 'Mengubah Gedung', 'Menghapus Gedung',
            'Melihat Ruang Rawat', 'Membuat Ruang Rawat', 'Mengubah Ruang Rawat', 'Menghapus Ruang Rawat',
            'Melihat Tipe Ruangan', 'Membuat Tipe Ruangan', 'Mengubah Tipe Ruangan', 'Menghapus Tipe Ruangan',
            'Melihat Ruangan', 'Membuat Ruangan', 'Mengubah Ruangan', 'Menghapus Ruangan',
            'Melihat Tempat Tidur', 'Membuat Tempat Tidur', 'Mengubah Tempat Tidur', 'Menghapus Tempat Tidur',
            'Melihat Resep Rawat Inap', 'Membuat Resep Rawat Inap', 'Dispensing Resep Rawat Inap', 'Membatalkan Resep Rawat Inap',

            // Fasilitas
            'Melihat Fasilitas',

            // Akuntansi
            'Melihat Akuntansi', 'Menambahkan Entri Akuntansi', 'Mengubah Akuntansi', 'Menghapus Akuntansi',
            'Melihat Kategori Akun', 'Menambahkan Kategori Akun', 'Mengubah Kategori Akun', 'Menghapus Kategori Akun',
            'Melihat Jurnal Entri', 'Menambahkan Jurnal Entri',
            'Melihat Laporan Keuangan',
        ];

        foreach ($permissions as $permissionName) {
            $permission = Permission::updateOrCreate(
                ['name' => $permissionName, 'guard_name' => 'sanctum']
            );

            if (!$role->hasPermissionTo($permissionName)) {
                $role->givePermissionTo($permission);
            }
        }

        $this->command->info('Owner default permissions updated ✓');
    }
}
