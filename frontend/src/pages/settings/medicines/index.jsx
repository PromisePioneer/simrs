import SettingPage from "@/pages/settings/index.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import MedicineCategoriesPage from "@/pages/settings/medicines/categories/index.jsx";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_protected/settings/medicines/index.jsx";
import MedicineWarehousePage from "@/pages/settings/medicines/warehouses /index.jsx"; // Adjust path sesuai struktur route Anda

function MedicinePage() {
    const navigate = useNavigate();
    const search = Route.useSearch(); // Baca search params
    const activeTab = search?.tab || 'medicines'; // Default ke 'medicines'

    const handleTabChange = (value) => {
        navigate({
            to: '/settings/medicines',
            search: { tab: value }
        });
    };

    return (
        <SettingPage>
            <div className="p-6 pb-20">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Data Obat</h2>
                    <p className="text-muted-foreground">Kelola stok obat.</p>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
                        <TabsTrigger className="cursor-pointer" value="medicines">
                            Data Obat
                        </TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="medicine_categories">
                            Data Kategori
                        </TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="medicine_warehouses">
                            Data Gudang
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="medicines" className="space-y-6 mt-0">
                        {/* Medicine list content */}
                    </TabsContent>

                    <TabsContent value="medicine_categories" className="space-y-6 mt-0">
                        <MedicineCategoriesPage/>
                    </TabsContent>

                    <TabsContent value="medicine_warehouses" className="space-y-6 mt-0">
                        <MedicineWarehousePage/>
                    </TabsContent>
                </Tabs>
            </div>
        </SettingPage>
    );
}

export default MedicinePage;