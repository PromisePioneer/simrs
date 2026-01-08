import SettingPage from "@/pages/settings/index.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import RolePage from "@/pages/settings/users-management/roles/index.jsx";
import UserPage from "@/pages/settings/users-management/users/index.jsx";

function UsersManagementPage() {
    return (
        <SettingPage>
            <div className="p-6 pb-20">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
                    <p className="text-muted-foreground">Kelola data pengguna dan peran pengguna.</p>
                </div>

                <Tabs defaultValue="roles" className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-2 mb-6">
                        <TabsTrigger className="cursor-pointer" value="users">Pengguna</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="roles">Peran Pengguna</TabsTrigger>
                    </TabsList>


                    <TabsContent value="users" className="space-y-6 mt-0">
                        <UserPage/>
                    </TabsContent>

                    <TabsContent value="roles" className="space-y-6 mt-0">
                        <RolePage/>
                    </TabsContent>
                </Tabs>
            </div>
        </SettingPage>
    )
}

export default UsersManagementPage;