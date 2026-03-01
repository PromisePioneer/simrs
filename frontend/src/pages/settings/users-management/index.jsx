import SettingPage from "@/pages/settings/index.jsx";
import RolePage from "@/pages/settings/users-management/roles/index.jsx";
import UserPage from "@/pages/settings/users-management/users/index.jsx";
import {usePermission} from "@/hooks/usePermission.js";
import {useEffect, useState} from "react";
import {PERMISSIONS} from "@/constants/permissions.js";
import {ShieldAlert, Lock} from "lucide-react";
import {Route} from "@/routes/_protected/settings/users-management/index.jsx";
import {useNavigate} from "@tanstack/react-router";
import {PermissionTabs} from "@/components/common/tabs.jsx";

function UsersManagementPage() {

    const {hasPermission} = usePermission();
    const navigate = useNavigate();
    const search = Route.useSearch();
    const [isInitialized, setIsInitialized] = useState(false);
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
            if (currentTab && !currentTab.permission) {
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


    const hasAnyTabAccess = tabs.some(tab => tab.permission);

    if (!hasAnyTabAccess) {
        return (
            <SettingPage>
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4"/>
                        <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Anda tidak memiliki izin untuk mengakses halaman ini.
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
                <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
                <p className="text-muted-foreground">Kelola data pengguna .</p>
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

export default UsersManagementPage;