import {Card} from "@/components/ui/card.jsx";
import {
    Database,
    Users,
    Activity,
    HardDrive,
    FileText,
    Pill
} from "lucide-react";
import {useState} from "react";

function SystemInfo() {
    const [systemStats, setSystemStats] = useState({
        totalPatients: 1248,
        activePatients: 856,
        totalMedicines: 342,
        totalUsers: 24,
        storageUsed: 65, // percentage
        lastBackup: "2025-01-27 23:00",
        systemVersion: "1.2.0",
        uptime: "45 hari"
    });

    const [recentActivities] = useState([
        {
            id: 1,
            action: "Pasien baru ditambahkan",
            user: "Dr. Andi Wijaya",
            time: "2 jam yang lalu",
            type: "patient"
        },
        {
            id: 2,
            action: "Data obat diperbarui",
            user: "Admin Farmasi",
            time: "5 jam yang lalu",
            type: "medicine"
        },
        {
            id: 3,
            action: "Pengguna baru dibuat",
            user: "Administrator",
            time: "1 hari yang lalu",
            type: "user"
        },
        {
            id: 4,
            action: "Backup sistem berhasil",
            user: "System",
            time: "1 hari yang lalu",
            type: "system"
        }
    ]);

    const statCards = [
        {
            title: "Total Pasien",
            value: systemStats.totalPatients.toLocaleString(),
            subtitle: `${systemStats.activePatients} aktif`,
            icon: Users,
            color: "teal"
        },
        {
            title: "Total Obat",
            value: systemStats.totalMedicines.toLocaleString(),
            subtitle: "Item terdaftar",
            icon: Pill,
            color: "blue"
        },
        {
            title: "Pengguna Sistem",
            value: systemStats.totalUsers.toLocaleString(),
            subtitle: "Akun aktif",
            icon: Activity,
            color: "purple"
        },
        {
            title: "Penyimpanan",
            value: `${systemStats.storageUsed}%`,
            subtitle: "Terpakai",
            icon: HardDrive,
            color: "orange"
        }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'patient':
                return Users;
            case 'medicine':
                return Pill;
            case 'user':
                return Activity;
            case 'system':
                return Database;
            default:
                return FileText;
        }
    };

    const getColorClass = (color) => {
        const colors = {
            teal: "bg-teal-100 text-teal-600",
            blue: "bg-blue-100 text-blue-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600"
        };
        return colors[color] || colors.teal;
    };

    return (
        <div className="space-y-6">
            {/* System Statistics */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Statistik Sistem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {stat.subtitle}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${getColorClass(stat.color)}`}>
                                        <Icon className="h-5 w-5"/>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity & System Info Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Aktivitas Terbaru
                        </h3>
                        <Activity className="h-5 w-5 text-gray-400"/>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => {
                            const Icon = getActivityIcon(activity.type);
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
                                >
                                    <div className="p-2 bg-teal-50 rounded-lg">
                                        <Icon className="h-4 w-4 text-teal-600"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            oleh {activity.user}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {activity.time}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* System Information */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Informasi Sistem
                        </h3>
                        <Database className="h-5 w-5 text-gray-400"/>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Versi Aplikasi</p>
                            <p className="text-sm font-semibold text-gray-900">
                                v{systemStats.systemVersion}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Uptime Sistem</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {systemStats.uptime}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Backup Terakhir</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {systemStats.lastBackup}
                            </p>
                        </div>

                        <div className="pt-3 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500">
                                        Penggunaan Storage
                                    </span>
                                    <span className="text-xs font-semibold text-gray-900">
                                        {systemStats.storageUsed}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                                        style={{width: `${systemStats.storageUsed}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default SystemInfo;