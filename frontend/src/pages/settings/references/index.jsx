import {useState, useEffect} from 'react';
import {usePermission} from '@/hooks/usePermission';
import {PERMISSIONS} from '@/constants/permissions';
import {ShieldAlert, Lock} from 'lucide-react';
import {toast} from 'sonner';
import DegreePage from "@/pages/settings/references/degrees/index.jsx";
import PaymentMethodPage from "@/pages/settings/references/payment-methods/index.jsx";
import Institutions from "@/pages/settings/references/institutions/index.jsx";
import SettingPage from "@/pages/settings/index.jsx";
import PoliPage from "@/pages/settings/references/poli/index.jsx";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_protected/settings/references/index.jsx";
import {PermissionTabs} from "@/components/common/tabs.jsx";

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
            {/* Header ditempatkan di luar Tabs */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Manajemen Data Referensi</h2>
                <p className="text-muted-foreground">Kelola data Referensi.</p>
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

export default ReferencesPage;