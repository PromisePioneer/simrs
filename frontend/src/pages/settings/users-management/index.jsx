import SettingPage from "@/pages/settings/index.jsx";
import RolePage from "@/pages/settings/users-management/roles/index.jsx";
import UserPage from "@/pages/settings/users-management/users/index.jsx";
import {usePermission} from "@/hooks/usePermission.js";
import {useEffect, useState} from "react";
import {PERMISSIONS} from "@/constants/permissions.js";
import {toast} from "sonner";
import {ShieldAlert, Lock} from "lucide-react";

function UsersManagementPage() {

    const {hasPermission} = usePermission();
    const [activeTab, setActiveTab] = useState('');
    const tabs = [
        {
            key: 'users',
            label: 'Manajemen Pengguna',
            permission: hasPermission(PERMISSIONS.USER.VIEW),
            component: UserPage
        },
        {
            key: 'roles',
            label: 'Manajemen Peran Pengguna',
            permission: hasPermission(PERMISSIONS.ROLE.VIEW),
            component: RolePage
        },
    ];

    useEffect(() => {
        const firstAccessibleTab = tabs.find(tab => tab.permission);
        if (firstAccessibleTab) {
            setActiveTab(firstAccessibleTab.key);
        }
    }, []);

    const handleTabClick = (tabKey, hasPermission) => {
        if (!hasPermission) {
            toast.error('Akses Ditolak', {
                description: 'Anda tidak memiliki izin untuk mengakses tab ini.'
            });
            return;
        }
        setActiveTab(tabKey);
    };


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
            <div className="p-6 pb-20">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
                    <p className="text-muted-foreground">Kelola data pengguna dan peran pengguna.</p>
                </div>

                <div className="border-b mb-6">
                    <div className="flex gap-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                disabled={!tab.permission}
                                className={`pb-2 px-1 transition-colors flex items-center gap-1 cursor-pointer font-medium ${
                                    activeTab === tab.key
                                        ? 'border-b-2 border-teal-500 text-teal-600 font-bold'
                                        : tab.permission
                                            ? 'text-gray-600 hover:text-gray-900 font-medium'
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
            </div>
        </SettingPage>
    )
}

export default UsersManagementPage;