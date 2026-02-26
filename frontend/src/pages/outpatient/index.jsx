import Layout from "@/pages/dashboard/layout.jsx";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "@tanstack/react-router";
import {stats} from "@/constants/outpatient-visits.js";
import {PERMISSIONS} from "@/constants/permissions.js";
import {usePermission} from "@/hooks/usePermission.js";
import OutpatientVisitPage from "@/pages/outpatient/visit/index.jsx";
import PrescriptionPage from "@/pages/outpatient/prescriptions/index.jsx";
import {Route} from "@/routes/_protected/outpatient/index.jsx";
import {useOutpatientDashboardReportStore} from "@/store/outpatientDashboardReportStore.js";
import {PermissionTabs} from "@/components/common/tabs.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Users, UserPlus, ShieldAlert} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import SettingPage from "@/pages/settings/index.jsx";

function OutpatientPage() {
    const {hasPermission} = usePermission();
    const [isInitialized, setIsInitialized] = useState(false);
    const search = Route.useSearch();


    const {
        fetchPatientVisitCount,
        patientTodayCount,
        fetchTodayPatientCountByStatus,
        todayPatientCountByStatus,
    } = useOutpatientDashboardReportStore();

    useEffect(() => {
        fetchPatientVisitCount();
        fetchTodayPatientCountByStatus();
    }, []);


    const navigate = useNavigate();

    const tabs = [
        {
            key: 'outpatient-visit',
            label: 'Manajemen Rawat Jalan',
            permission: PERMISSIONS.MEDICINE.VIEW,
            component: OutpatientVisitPage
        },
        {
            key: 'prescription-dispensing',
            label: 'Penebusan Obat',
            permission: PERMISSIONS.PRESCRIPTION.VIEW,
            component: PrescriptionPage
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


    const statsData = stats(patientTodayCount, todayPatientCountByStatus);


    return (
        <Layout>

            {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500">
                            <Users className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Rawat Jalan
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola pasien rawat jalan dan antrian
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                {statsData.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.color} p-2 rounded-lg`}>
                                <stat.icon className="h-4 w-4 text-white"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <PermissionTabs
                activeTab={activeTab}
                tabs={tabs}
                gridCols={3}
            />

        </Layout>
    );
}

export default OutpatientPage;