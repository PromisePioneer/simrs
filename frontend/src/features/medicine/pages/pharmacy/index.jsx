import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_protected/pharmacy/index.jsx";
import {usePermission} from "@shared/hooks";
import {useEffect, useState} from "react";
import {PERMISSIONS} from "@shared/constants";
import {ShieldAlert} from "lucide-react";
import {PermissionTabs} from "@shared/components/common/tabs.jsx";
import MedicinePage from "@features/medicine/pages/pharmacy/medicines/index.jsx";
import MedicineCategoriesPage from "@features/medicine/pages/pharmacy/categories/index.jsx";
import MedicineWarehousePage from "@features/medicine/pages/pharmacy/warehouses/index.jsx";
import StockMovementPage from "@features/medicine/pages/stock-movements/index.jsx";
import Layout from "@features/dashboard/pages/layout.jsx";

function PharmacyPage() {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();
    const search = Route.useSearch();
    const [isInitialized, setIsInitialized] = useState(false);

    const tabs = [
        {
            key: 'medicine-management',
            label: 'Data Obat',
            permission: PERMISSIONS.MEDICINE.VIEW,
            component: MedicinePage
        },
        {
            key: 'medicine_categories',
            label: 'Kategori Obat',
            permission: PERMISSIONS.MEDICINE_CATEGORY.VIEW,
            component: MedicineCategoriesPage
        },
        {
            key: 'medicine_warehouses',
            label: 'Gudang Obat',
            permission: PERMISSIONS.MEDICINE_WAREHOUSE.VIEW,
            component: MedicineWarehousePage
        },
        {
            key: 'medicine_stock_movements',
            label: 'Mutasi Obat',
            permission: PERMISSIONS.STOCK_MOVEMENT.VIEW,
            component: StockMovementPage
        }
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
        if (search?.tab) setIsInitialized(true);
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
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4"/>
                    <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Anda tidak memiliki izin untuk mengakses halaman farmasi.
                    </p>
                </div>
            </div>
        );
    }

    if (!activeTab) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Farmasi</h2>
                    <p className="text-muted-foreground">Kelola data obat, kategori, gudang, dan mutasi stok.</p>
                </div>
                <PermissionTabs
                    activeTab={activeTab}
                    tabs={tabs}
                    gridCols={4}
                />
            </div>
        </Layout>
    );
}

export default PharmacyPage;