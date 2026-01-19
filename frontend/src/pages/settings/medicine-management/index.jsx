import SettingPage from "@/pages/settings/index.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_protected/settings/medicine-management/index.jsx";
import {usePermission} from "@/hooks/usePermission.js";
import {useEffect} from "react";
import {PERMISSIONS} from "@/constants/permissions.js";
import {Lock, ShieldAlert} from "lucide-react";
import {toast} from "sonner";
import MedicinePage from "@/pages/settings/medicine-management/medicines/index.jsx";
import MedicineCategoriesPage from "@/pages/settings/medicine-management/categories/index.jsx";
import MedicineWarehousePage from "@/pages/settings/medicine-management/warehouses /index.jsx";

function MedicineManagementPage() {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();
    const search = Route.useSearch();

    const tabs = [
        {
            key: 'medicine-management',
            label: 'Data obat',
            permission: hasPermission(PERMISSIONS.MEDICINE.VIEW),
            component: MedicinePage
        },
        {
            key: 'medicine_categories',
            label: 'Kategori obat',
            permission: hasPermission(PERMISSIONS.MEDICINE_CATEGORY.VIEW),
            component: MedicineCategoriesPage
        },
        {
            key: 'medicine_warehouses',
            label: 'Gudang obat',
            permission: hasPermission(PERMISSIONS.MEDICINE_WAREHOUSE.VIEW),
            component: MedicineWarehousePage
        },
    ];

    const firstAccessibleTab = tabs.find(tab => tab.permission);
    const activeTab = search?.tab || '';

    useEffect(() => {
        if (!search?.tab && firstAccessibleTab) {
            navigate({
                to: '/settings/medicines',
                search: {tab: firstAccessibleTab.key},
                replace: true
            });
        }
    }, []);

    useEffect(() => {
        if (activeTab) {
            const currentTab = tabs.find(tab => tab.key === activeTab);
            if (currentTab && !currentTab.permission) {
                if (firstAccessibleTab) {
                    navigate({
                        to: '/settings/medicine-management',
                        search: {tab: firstAccessibleTab.key},
                        replace: true
                    });
                    toast.error('Akses Ditolak', {
                        description: 'Anda tidak memiliki izin untuk mengakses tab tersebut.'
                    });
                }
            }
        }
    }, [activeTab]);

    const handleTabChange = (value) => {
        const selectedTab = tabs.find(tab => tab.key === value);

        if (!selectedTab?.permission) {
            toast.error('Akses Ditolak', {
                description: 'Anda tidak memiliki izin untuk mengakses tab ini.'
            });
            return;
        }

        navigate({
            to: '/settings/medicine-management',
            search: {tab: value}
        });
    };

    const hasAnyTabAccess = tabs.some(tab => tab.permission);

    if (!hasAnyTabAccess) {
        return (
            <SettingPage>
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4"/>
                        <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Anda tidak memiliki izin untuk mengakses halaman manajemen obat.
                            Silakan hubungi administrator untuk mendapatkan akses.
                        </p>
                    </div>
                </div>
            </SettingPage>
        );
    }

    if (!activeTab) {
        return (
            <SettingPage>
                <div className="p-6 pb-20">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">Manajemen Obat</h2>
                        <p className="text-muted-foreground">Kelola data Obat dan pantau stok obat.</p>
                    </div>
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-pulse">Loading...</div>
                    </div>
                </div>
            </SettingPage>
        );
    }

    return (
        <SettingPage>
            <div className="p-6 pb-20">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Obat</h2>
                    <p className="text-muted-foreground">Kelola data Obat dan pantau stok obat.</p>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.key}
                                value={tab.key}
                                disabled={!tab.permission}
                                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span className="flex items-center gap-2">
                                    {tab.label}
                                    {!tab.permission && <Lock className="w-3 h-3"/>}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map(tab => {
                        const TabComponent = tab.component;
                        return (
                            <TabsContent key={tab.key} value={tab.key} className="space-y-6 mt-0">
                                {tab.permission ? (
                                    <TabComponent/>
                                ) : (
                                    <div className="text-center py-12">
                                        <ShieldAlert className="w-12 h-12 mx-auto text-red-500 mb-4"/>
                                        <p className="text-gray-600">Anda tidak memiliki akses ke tab ini.</p>
                                    </div>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </SettingPage>
    );
}

export default MedicineManagementPage;