<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantDefaultPermission;
use App\Models\TenantDefaultRole;
use Exception;
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
                'icon' => "House",
                'route' => '/dashboard',
                'permissions' => [
                    'Melihat Dashboard',
                ]
            ],
            [
                'name' => 'Master',
                'parent_id' => null,
                'order' => 2,
                'icon' => 'Database',
                'route' => null,
                'permissions' => [
                    'Melihat Master',
                ],
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
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Rawat Jalan',
                'parent_id' => null,
                'order' => 3,
                'icon' => 'CalendarDays',
                'route' => '/outpatient',
                'permissions' => [
                    'Melihat Rawat Jalan',
                    'Menambahkan Rawat Jalan'
                ]
            ],
            [
                'name' => 'Pendaftaran',
                'parent_id' => null,
                'order' => 4,
                'icon' => 'Contact',
                'route' => '/registration',
                'permissions' => [
                    'Melihat Registrasi',
                ],
                'children' => [
                    [
                        'name' => 'Rawat Jalan Poli',
                        'order' => 1,
                        'icon' => null,
                        'route' => '/registration/poly-outpatient',
                        'permissions' => [
                            'Melihat Rawat Jalan Poli',
                        ]
                    ],
                    [
                        'name' => 'Antrian Cepat',
                        'order' => 2,
                        'icon' => null,
                        'route' => '/registration/fast-queue',
                        'permissions' => [
                            'Melihat Antrian Cepat',
                        ]
                    ],
                    [
                        'name' => 'Antrian Awal',
                        'order' => 3,
                        'icon' => null,
                        'route' => '/registration/early-queue',
                        'permissions' => [
                            'Melihat Antrian Awal',
                        ]
                    ],
                    [
                        'name' => 'Layar Antrian',
                        'order' => 4,
                        'icon' => null,
                        'route' => '/registration/queue-screen',
                        'permissions' => [
                            'Melihat Layar Antrian',
                        ]
                    ],
                ]
            ],
            [
                'name' => 'Electronic Medical Record',
                'parent_id' => null,
                'order' => 5,
                'icon' => 'Clipboard',
                'route' => '/electronic-medical-record',
                'permissions' => [
                    'Melihat Electronic Medical Record',
                ]
            ],
            [
                'name' => 'Kasir',
                'parent_id' => null,
                'order' => 6,
                'icon' => 'ShoppingCart',
                'route' => '/cashier',
                'permissions' => [
                    'Melihat Kasir',
                ],
                'children' => [
                    [
                        'name' => 'Pembayaran',
                        'order' => 1,
                        'icon' => null,
                        'route' => '/cashier/payment',
                        'permissions' => [
                            'Melihat Pembayaran',
                        ]
                    ],
                    [
                        'name' => 'Pemesanan',
                        'order' => 2,
                        'icon' => null,
                        'route' => '/cashier/booking',
                        'permissions' => [
                            'Melihat Pemesanan',
                        ]
                    ],
                ]
            ],
            [
                'name' => 'Profile',
                'parent_id' => null,
                'order' => 7,
                'icon' => 'Hospital',
                'route' => '/profile',
                'permissions' => [
                    'Melihat Profile',
                ],
                'children' => [
                    [
                        'name' => 'Informasi Dasar',
                        'order' => 1,
                        'icon' => null,
                        'route' => '/profile/basic-information',
                        'permissions' => [
                            'Melihat Informasi Dasar',
                        ]
                    ],
                    [
                        'name' => 'Fasilitas',
                        'order' => 2,
                        'icon' => null,
                        'route' => '/profile/facility',
                        'permissions' => [
                            'Melihat Fasilitas',
                        ]
                    ],
                    [
                        'name' => 'Jam Operasional',
                        'order' => 3,
                        'icon' => null,
                        'route' => '/profile/operating-hours',
                        'permissions' => [
                            'Melihat Jam Operasional',
                        ]
                    ],
                    [
                        'name' => 'Poli',
                        'order' => 4,
                        'icon' => null,
                        'route' => '/profile/poly',
                        'permissions' => [
                            'Melihat Poli',
                            'Menambahkan Poli',
                            'Mengubah Poli',
                            'Menghapus Poli',
                        ]
                    ],
                ],
            ],
            [
                'name' => 'Office',
                'parent_id' => null,
                'order' => 8,
                'icon' => 'File',
                'route' => '/office',
                'permissions' => [
                    'Melihat Office',
                ]
            ],
            [
                'name' => 'Setting',
                'parent_id' => null,
                'order' => 9,
                'icon' => 'Settings',
                'route' => '/settings',
                'permissions' => [
                    'Melihat Setting',
                ]
            ],
        ];

        foreach ($modules as $moduleData) {
            $this->storeModuleStructure($moduleData, null, $moduleIds);
        }

        return $moduleIds;
    }

    private function storeModuleStructure(array $moduleData, $parentId, &$moduleIds): void
    {
        $module = Module::create([
            'name' => $moduleData['name'],
            'parent_id' => $parentId,
            'route' => $moduleData['route'] ?? null,
            'icon' => $moduleData['icon'] ?? null,
            'order' => $moduleData['order'] ?? 0,
        ]);

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
                    [
                        'name' => $permissionName,
                        'guard_name' => 'sanctum',
                    ], [
                        'module_id' => $moduleId ?? null,
                    ]
                );
            }
        }
    }

    private function assignPermissionsToRoles($tenantId): void
    {
        setPermissionsTeamId(null);

        $roles = Role::get();
        if ($roles->isEmpty()) {
            $this->command->warn("No roles found for tenant: {$tenantId}");
            return;
        }

        foreach ($roles as $role) {
            switch ($role->name) {
                case 'Owner':
                    try {
                        $this->generateOwnerDefaultPermission();
                    } catch (\Exception $e) {
                        $this->command->error("Error syncing permissions for Owner role: " . $e->getMessage());
                    }
                    break;
                case 'Admin':
                    break;
            }
        }

        // Reset team_id setelah selesai
        setPermissionsTeamId(null);
    }


    public function generateOwnerDefaultPermission(): void
    {
        $role = Role::where('name', 'Owner')->first();
        if (!$role) {
            return;
        }

        $permissions = [
            'Melihat Dashboard',
            'Melihat Role',
            'Menambahkan Role',
            'Mengubah Role',
            'Menghapus Role',
            'Melihat User Management',
            'Menambahkan User Management',
            'Mengubah User Management',
            'Menghapus User Management',
            'Melihat Rak Produk',
            'Membuat Rak Produk',
            'Mengubah Rak Produk',
            'Menghapus Rak Produk',
            'Melihat Kategori Produk',
            'Menambah Kategori Produk',
            'Mengubah Kategori Produk',
            'Menghapus Kategori Produk',
            'Melihat Satuan Produk',
            'Menambahkan Satuan Produk',
            'Mengubah Satuan Produk',
            'Menghapus Satuan Produk',
            'Melihat Produk',
            'Membuat Produk',
            'Mengubah Produk',
            'Menghapus Produk',
            'Melihat Lembaga Pendaftaran',
            'Menambahkan Lembaga Pendaftaran',
            'Mengubah Lembaga Pendaftaran',
            'Menghapus Lembaga Pendaftaran',
            'Melihat master',
            'Melihat Tipe Pembayaran',
            'Menambahkan Tipe Pembayaran',
            'Mengubah Tipe Metode Pembayaran',
            'Menghapus Tipe Metode Pembayaran',
            'Melihat Gelar',
            'Membuat Gelar',
            'Mengubah Gelar',
            'Menghapus Gelar',

            'Melihat Profesi',
            'Membuat Profesi',
            'Mengubah Profesi',
            'Menghapus Profesi',

            'Melihat Spesialisasi',
            "Membuat Spesialisasi",
            "Mengubah Spesialisasi",
            "Menghapus Spesialisasi",

            "Melihat Sub Spesialisasi",
            "Membuat Sub Spesialisasi",
            "Mengubah Sub Spesialisasi",
            "Menghapus Sub Spesialisasi"
        ];

        foreach ($permissions as $permissionName) {
            Permission::updateOrCreate([
                'name' => $permissionName,
                'guard_name' => 'sanctum',
            ]);

            Role::where('name', 'Owner')
                ->first()
                ->givePermissionTo($permissionName);
        }
    }
}
