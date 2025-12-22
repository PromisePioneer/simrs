import Layout from "@/pages/dashboard/layout.jsx";
import {Card} from "@/components/ui/card.jsx";
import {Link} from '@tanstack/react-router'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.jsx";


function SettingPage({children}) {

    const components = [
        {
            title: "Alert Dialog",
            href: "/docs/primitives/alert-dialog",
            description:
                "A modal dialog that interrupts the user with important content and expects a response.",
        }
    ]
    return (
        <>
            <Layout>
                <Card className="mb-20 mt-4 p-0">
                    <div className="grid grid-cols-1">
                        <div className="flex items-start justify-start gap-3 p-3">
                            <NavigationMenu>
                                <NavigationMenuList className="flex-wrap">
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                            <Link to="/settings/patients"
                                                  className="font-bold text-2xlhover:text-teal-500">Daftar Pasien</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                </Card>
                {children}
            </Layout>
        </>
    )
}

export default SettingPage;