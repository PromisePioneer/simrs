import {AppSidebar} from "@/components/sidebar/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {useLocation, Link} from "@tanstack/react-router"

export default function Layout({children}) {
    const location = useLocation();
    const pathNames = location.pathname.split("/").filter(Boolean);

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>

                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="#">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {pathNames.map((value, index) => {
                                    const to = "/" + pathNames.slice(0, index + 1).join("/");
                                    const isLast = index === pathNames.length - 1;
                                    return (
                                        <div className="flex items-center" key={to}>
                                            <BreadcrumbSeparator/>
                                            <BreadcrumbItem>
                                                {isLast ? (
                                                    <BreadcrumbPage className="capitalize">
                                                        {value}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link className="capitalize" to={to}>
                                                            {value}
                                                        </Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </div>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>

                    </div>
                </header>

                <div className="px-6 py-4">
                    {children}
                </div>

            </SidebarInset>
        </SidebarProvider>
    );
}
