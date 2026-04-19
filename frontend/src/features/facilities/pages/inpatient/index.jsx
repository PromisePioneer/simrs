import {useNavigate} from "@tanstack/react-router";
import {usePermission} from "@shared/hooks";
import {Route} from "@/routes/_protected/facilities/inpatient";
import {useEffect, useState} from "react";
import {PERMISSIONS} from "@shared/constants";
import BuildingPage from "@features/facilities/pages/inpatient/building/index.jsx";
import Layout from "@features/dashboard/pages/layout.jsx";
import {ShieldAlert} from "lucide-react";
import {PermissionTabs} from "@shared/components/common/tabs.jsx";
import WardPage from "@features/facilities/pages/inpatient/ward/index.jsx";
import RoomPage from "@features/facilities/pages/inpatient/room/index.jsx";
import ContentHeader from "@shared/components/ui/content-header.jsx";

function InpatientFacilityPage() {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();
    const search = Route.useSearch();
    const [isInitialized, setIsInitialized] = useState(false);

    const tabs = [
        {key: "buildings", label: "Gedung", permission: PERMISSIONS.BUILDING.VIEW, component: BuildingPage},
        {key: "wards", label: "Ruang Rawat", permission: PERMISSIONS.WARD.VIEW, component: WardPage},
        {key: "rooms", label: "Ruangan", permission: PERMISSIONS.ROOM.VIEW, component: RoomPage},
    ];

    const firstAccessibleTab = tabs.find(tab => hasPermission(tab.permission));
    const activeTab = search?.tab || "";

    useEffect(() => {
        if (!search?.tab && firstAccessibleTab) {
            navigate({to: ".", search: {tab: firstAccessibleTab.key}, replace: true});
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
            if (currentTab && !hasPermission(currentTab.permission) && firstAccessibleTab) {
                navigate({to: ".", search: {tab: firstAccessibleTab.key}, replace: true});
            }
        }
    }, [activeTab, isInitialized]);

    const hasAnyTabAccess = tabs.some(tab => hasPermission(tab.permission));

    if (!hasAnyTabAccess) {
        return (
            <Layout>
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-6 h-6 text-red-500"/>
                        </div>
                        <h2 className="text-base font-semibold">Akses Ditolak</h2>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!activeTab) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-12">
                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"/>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 space-y-5">
                <ContentHeader
                    title="Fasilitas Rawat Inap"
                    description="Kelola gedung, ruang rawat, dan ruangan."
                />
                <PermissionTabs activeTab={activeTab} tabs={tabs} gridCols={3}/>
            </div>
        </Layout>
    );
}

export default InpatientFacilityPage;