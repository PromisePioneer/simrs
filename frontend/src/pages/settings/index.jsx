import Layout from "@/pages/dashboard/layout.jsx";
import {Card} from "@/components/ui/card.jsx";
import {Link, useLocation} from '@tanstack/react-router';
import {cn} from "@/lib/utils";
import {Users, Database, UserCog, Pill} from "lucide-react";

function SettingPage({children}) {
    const location = useLocation();

    const menuItems = [
        {
            title: "Manajemen Pasien",
            href: "/settings/patients",
            icon: Users,
            description: "Kelola data pasien"
        },
        {
            title: "Referensi",
            href: "/settings/references",
            icon: Database,
            description: "Data referensi"
        },
        {
            title: "Manajemen Pengguna",
            href: "/settings/users",
            icon: UserCog,
            description: "Atur pengguna sistem"
        },
        {
            title: "Manajemen Obat",
            href: "/settings/roles",
            icon: Pill,
            description: "Kelola data obat"
        }
    ];

    const isActive = (href) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-teal-600">
                        Pengaturan
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola pengaturan sistem dan data master aplikasi
                    </p>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="group"
                            >
                                <Card
                                    className={cn(
                                        "p-6 transition-all duration-200 cursor-pointer hover:shadow-lg border-2",
                                        active
                                            ? "border-teal-500 bg-teal-50 shadow-md"
                                            : "border-transparent hover:border-teal-200 hover:bg-teal-50/50"
                                    )}
                                >
                                    <div className="space-y-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                                            active
                                                ? "bg-teal-500 text-white"
                                                : "bg-teal-100 text-teal-600 group-hover:bg-teal-500 group-hover:text-white"
                                        )}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "font-semibold text-base mb-1 transition-colors",
                                                active
                                                    ? "text-teal-700"
                                                    : "text-gray-900 group-hover:text-teal-700"
                                            )}>
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </Layout>
    );
}

export default SettingPage;