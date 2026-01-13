// src/pages/settings/ReferencesPage.jsx
import {useState, useEffect} from 'react';
import {usePermission} from '@/hooks/usePermission';
import {PERMISSIONS} from '@/constants/permissions';
import {ShieldAlert, Lock} from 'lucide-react';
import {toast} from 'sonner';
import DegreePage from "@/pages/settings/references/degrees/index.jsx";
import PaymentMethodPage from "@/pages/settings/references/payment-methods/index.jsx";
import Institutions from "@/pages/settings/references/institutions/index.jsx";
import SettingPage from "@/pages/settings/index.jsx"; // atau library toast yang Anda pakai

function ReferencesPage() {
    const {hasPermission} = usePermission();
    const [activeTab, setActiveTab] = useState('');
    const tabs = [
        {
            key: 'gelar',
            label: 'Gelar',
            permission: hasPermission(PERMISSIONS.DEGREE.VIEW),
            component: DegreePage
        },
        {
            key: 'metode-pembayaran',
            label: 'Metode Pembayaran',
            permission: hasPermission(PERMISSIONS.PAYMENT_METHOD.VIEW),
            component: PaymentMethodPage
        },
        {
            key: 'lembaga-pendaftaran',
            label: 'Lembaga Pendaftaran',
            permission: hasPermission(PERMISSIONS.INSTITUTION.VIEW),
            component: Institutions
        }
    ];

    // Set default tab ke tab pertama yang ada permission
    useEffect(() => {
        const firstAccessibleTab = tabs.find(tab => tab.permission);
        if (firstAccessibleTab) {
            setActiveTab(firstAccessibleTab.key);
        }
    }, []);

    // Handle tab click
    const handleTabClick = (tabKey, hasPermission) => {
        if (!hasPermission) {
            toast.error('Akses Ditolak', {
                description: 'Anda tidak memiliki izin untuk mengakses tab ini.'
            });
            return;
        }
        setActiveTab(tabKey);
    };

    // Jika tidak ada tab yang bisa diakses sama sekali
    const hasAnyTabAccess = tabs.some(tab => tab.permission);

    if (!hasAnyTabAccess) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4"/>
                    <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Anda tidak memiliki izin untuk mengakses halaman referensi.
                        Silakan hubungi administrator untuk mendapatkan akses.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <SettingPage>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Pengaturan</h1>
                <p className="text-gray-600">
                    Kelola pengaturan sistem dan data master aplikasi
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b mb-6">
                <div className="flex gap-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            disabled={!tab.permission}
                            className={`pb-2 px-1 transition-colors flex items-center gap-1 ${
                                activeTab === tab.key
                                    ? 'border-b-2 border-teal-500 text-teal-600 font-medium'
                                    : tab.permission
                                        ? 'text-gray-600 hover:text-gray-900'
                                        : 'text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                            onClick={() => handleTabClick(tab.key, tab.permission)}
                        >
                            {tab.label}
                            {!tab.permission && (
                                <Lock className="w-3 h-3"/>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {tabs.map(tab => {
                    const TabComponent = tab.component;
                    return (
                        activeTab === tab.key &&
                        tab.permission &&
                        <TabComponent key={tab.key}/>
                    );
                })}
            </div>
        </SettingPage>
    );
}

export default ReferencesPage;