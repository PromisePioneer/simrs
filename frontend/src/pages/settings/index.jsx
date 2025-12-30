import Layout from "@/pages/dashboard/layout.jsx";
import {Card} from "@/components/ui/card.jsx";
import {Link, useLocation} from '@tanstack/react-router';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.jsx";
import {cn} from "@/lib/utils";

function SettingPage({children}) {
    const location = useLocation();

    const menuItems = [
        {
            title: "Daftar Pasien",
            href: "/settings/patients",
        },
        {
            title: "Menu Lain",
            href: "/settings/other",
        },
    ];



    const isActive = (href) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return (
        <>
            <Layout>
                <Card className="mb-20 mt-4 p-0">
                    <div className="grid grid-cols-1">
                        <div className="flex items-start justify-start gap-3 p-3">
                            <NavigationMenu>
                                <NavigationMenuList className="flex-wrap">
                                    {menuItems.map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                                <Link
                                                    to={item.href}
                                                    className={cn(
                                                        "font-bold text-2xl hover:text-teal-500",
                                                        isActive(item.href)
                                                            ? "text-teal-600 font-extrabold bg-gray-100"
                                                            : "text-gray-600"
                                                    )}
                                                >
                                                    {item.title}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                </Card>
                {children}
            </Layout>
        </>
    );
}

export default SettingPage;