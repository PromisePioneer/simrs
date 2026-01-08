import SettingPage from "@/pages/settings/index.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import DegreePage from "@/pages/settings/references/degrees/index.jsx";
import PaymentMethodPage from "@/pages/settings/references/payment-methods/index.jsx";
import Institutions from "@/pages/settings/references/institutions/index.jsx";

function ReferencesPage() {

    return (
        <SettingPage>
            <div className="p-6 pb-20">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Referensi Data</h2>
                    <p className="text-muted-foreground">Kelola data referensi gelar dan metode pembayaran.</p>
                </div>

                <Tabs defaultValue="degrees" className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
                        <TabsTrigger className="cursor-pointer" value="degrees">Gelar</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="payments">Metode Pembayaran</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="institutions">Lembaga Pendaftaran</TabsTrigger>
                    </TabsList>


                    <TabsContent value="degrees" className="space-y-6 mt-0">
                        <DegreePage/>
                    </TabsContent>


                    <TabsContent value="payments" className="space-y-6 mt-0">
                        <PaymentMethodPage/>
                    </TabsContent>

                    <TabsContent value="institutions" className="space-y-6 mt-0">
                        <Institutions/>
                    </TabsContent>
                </Tabs>
            </div>
        </SettingPage>
    );
}

export default ReferencesPage;