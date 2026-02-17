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
import {ChevronRight} from "lucide-react"

const pathLabels = {
    'settings': 'Pengaturan',
    'medicine-management': 'Manajemen Obat',
    'medicine': 'Data Obat',
    'create': 'Tambah Baru',
    'edit': 'Edit',
    'categories': 'Kategori',
    'warehouses': 'Gudang',
    'dashboard': 'Dashboard',
    'patients': 'Pasien',
    'appointments': 'Jadwal',
    'pharmacy': 'Farmasi',
    'billing': 'Billing',
    'users-management': 'Manajemen Pengguna',
    'references': 'Referensi',
    'users': 'Pengguna',
    'roles': 'Peran Pengguna',
    'details': 'Detail',
    'electronic-medical-record': 'Rekam Medis Elektronik',
};

// Function to check if string is UUID
const isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

// Function to check if string is numeric ID
const isNumericId = (str) => {
    return /^\d+$/.test(str);
};

// Function to check if path should be excluded from breadcrumb
const shouldExcludeFromBreadcrumb = (path) => {
    return isUUID(path) || isNumericId(path);
};

export default function Layout({children}) {
    const location = useLocation();
    const pathNames = location.pathname.split("/").filter(Boolean);

    // Filter out UUIDs and numeric IDs, then generate breadcrumb items
    const breadcrumbItems = pathNames
        .filter(path => !shouldExcludeFromBreadcrumb(path))
        .map((path, index, filteredPaths) => {
            // Reconstruct href using original pathNames up to this filtered index
            const originalIndex = pathNames.indexOf(path);
            const href = `/${pathNames.slice(0, originalIndex + 1).join('/')}`;
            const label = pathLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
            const isLast = index === filteredPaths.length - 1;

            return {href, label, isLast};
        });

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                {/* Sticky Header with Breadcrumb */}
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>

                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbItems.map((item, index) => (
                                    <div key={item.href} className="flex items-center">
                                        <BreadcrumbItem>
                                            {item.isLast ? (
                                                <BreadcrumbPage className="font-medium text-foreground">
                                                    {item.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link
                                                        to={item.href}
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>

                                        {!item.isLast && (
                                            <BreadcrumbSeparator className="mx-2">
                                                <ChevronRight className="h-4 w-4"/>
                                            </BreadcrumbSeparator>
                                        )}
                                    </div>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}