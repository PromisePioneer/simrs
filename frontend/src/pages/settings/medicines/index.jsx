import SettingPage from "@/pages/settings/index.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import MedicineCategoriesPage from "@/pages/settings/medicines/categories/index.jsx";

function MedicinePage() {

    return (
        <SettingPage>
            <div className="p-6 pb-20">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Data Obat</h2>
                    <p className="text-muted-foreground">Kelola stok obat.</p>
                </div>

                <Tabs defaultValue="medicines" className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
                        <TabsTrigger className="cursor-pointer" value="medicines">Data Obat</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="medicine_categories">Data Kategori</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="medicine_warehouses">Data Gudang</TabsTrigger>
                    </TabsList>

                    <TabsContent value="medicine_categories" className="space-y-6 mt-0">
                        <MedicineCategoriesPage/>
                    </TabsContent>
                    <TabsContent value="medicine_warehouses" className="space-y-6 mt-0">
                        <MedicineWarehouse
                    </TabsContent>
                </Tabs>
            </div>
        </SettingPage>
    )
}


export default MedicinePage;