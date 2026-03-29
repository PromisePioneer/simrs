import {useState, useEffect} from 'react';
import {usePermission} from '@shared/hooks';
import {PERMISSIONS} from '@shared/constants';
import {ShieldAlert} from 'lucide-react';
import DegreePage from "@features/settings/pages/references/degrees/index.jsx";
import PaymentMethodPage from "@features/settings/pages/references/payment-methods/index.jsx";
import Institutions from "@features/settings/pages/references/institutions/index.jsx";
import SettingPage from "@features/settings/pages/index.jsx";
import PoliPage from "@features/settings/pages/references/poli/index.jsx";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_protected/settings/references/index.jsx";
import {PermissionTabs} from "@shared/components/common/tabs.jsx";
import DepartmentPage from "@features/settings/pages/references/department/index.jsx";
import RoomTypes from "@features/settings/pages/references/room-types/index.jsx";
import RoomTypePage from "@features/settings/pages/references/room-types/index.jsx";

function ReferencesPage() {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();
    const search = Route.useSearch();
    const [isInitialized, setIsInitialized] = useState(false);


    const tabs = [
        {
            key: 'degrees',
            label: 'Gelar',
            permission: hasPermission(PERMISSIONS.DEGREE.VIEW),
            component: DegreePage
        },
        {
            key: 'payment-methods',
            label: 'Metode Pembayaran',
            permission: hasPermission(PERMISSIONS.PAYMENT_METHOD.VIEW),
            component: PaymentMethodPage
        },
        {
            key: 'registration-institutions',
            label: 'Lembaga Pendaftaran',
            permission: hasPermission(PERMISSIONS.INSTITUTION.VIEW),
            component: Institutions
        },
        {
            key: 'poli',
            label: 'Manajemen Poli',
            permission: hasPermission(PERMISSIONS.POLI.VIEW),
            component: PoliPage
        },
        {
            key: 'departments',
            label: 'Manajemen Departemen',
            permission: hasPermission(PERMISSIONS.DEPARTMENT.VIEW),
            component: DepartmentPage
        },
        {
            key: 'room-types',
            label: 'Tipe Ruangan',
            permission: hasPermission(PERMISSIONS.ROOM_TYPE.VIEW),
            component: RoomTypePage
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
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Manajemen Data Referensi</h2>
                <p className="text-muted-foreground">Kelola data Referensi.</p>
            </div>
            <PermissionTabs
                activeTab={activeTab}
                tabs={tabs}
                gridCols={3}
            />
        </SettingPage>
    );
}

export default ReferencesPage;