import SettingPage from "@/pages/settings/index.jsx";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_protected/settings/medicine-management/index.jsx";
import {usePermission} from "@/hooks/usePermission.js";
import {useEffect, useState} from "react";
import {PERMISSIONS} from "@/constants/permissions.js";
import {ShieldAlert} from "lucide-react";
import MedicinePage from "@/pages/settings/medicine-management/medicines/index.jsx";
import MedicineCategoriesPage from "@/pages/settings/medicine-management/categories/index.jsx";
import {PermissionTabs} from "@/components/common/tabs.jsx";
import MedicineWarehousePage from "@/pages/settings/medicine-management/warehouses /index.jsx";

function MedicineManagementPage() {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();
    const search = Route.useSearch();
    const [isInitialized, setIsInitialized] = useState(false);

    const tabs = [
        {
            key: 'medicine-management',
            label: 'Data obat',
            permission: PERMISSIONS.MEDICINE.VIEW,
            component: MedicinePage
        },
        {
            key: 'medicine_categories',
            label: 'Kategori obat',
            permission: PERMISSIONS.MEDICINE_CATEGORY.VIEW,
            component: MedicineCategoriesPage
        },
        {
            key: 'medicine_warehouses',
            label: 'Gudang obat',
            permission: PERMISSIONS.MEDICINE_WAREHOUSE.VIEW,
            component: MedicineWarehousePage
        },
    ];

    const firstAccessibleTab = tabs.find(tab => hasPermission(tab.permission));
    const activeTab = search?.tab || '';

    useEffect(() => {
        if (!search?.tab && firstAccessibleTab) {
            navigate({
                to: '.',
                search: {tab: firstAccessibleTab.key},
                replace: true
            });
        } else {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (search?.tab) {
            setIsInitialized(true);
        }
    }, [search?.tab]);

    useEffect(() => {
        if (activeTab && isInitialized) {
            const currentTab = tabs.find(tab => tab.key === activeTab);
            if (currentTab && !hasPermission(currentTab.permission)) {
                if (firstAccessibleTab) {
                    navigate({
                        to: '.',
                        search: {tab: firstAccessibleTab.key},
                        replace: true
                    });
                }
            }
        }
    }, [activeTab, isInitialized]);

    const hasAnyTabAccess = tabs.some(tab => hasPermission(tab.permission));

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
                <div className="flex justify-center items-center py-12">
                    <div className="animate-pulse">Loading...</div>
                </div>
            </SettingPage>
        );
    }

    return (
        <SettingPage>
            {/* Header ditempatkan di luar Tabs */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Manajemen Obat</h2>
                <p className="text-muted-foreground">Kelola data Obat dan pantau stok obat.</p>
            </div>

            {/* Tabs dengan content */}
            <PermissionTabs
                activeTab={activeTab}
                tabs={tabs}
                gridCols={3}
            />
        </SettingPage>
    );
}

export default MedicineManagementPage;