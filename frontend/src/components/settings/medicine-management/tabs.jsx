import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {useNavigate} from "@tanstack/react-router";
import {usePermission} from "@/hooks/usePermission.js";
import {PERMISSIONS} from "@/constants/permissions.js";
import {Lock} from "lucide-react";
import {toast} from "sonner";

export function MedicineTabs({activeTab = "medicine-management"}) {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();

    const tabs = [
        {
            key: 'medicine-management',
            label: 'Data obat',
            permission: hasPermission(PERMISSIONS.MEDICINE.VIEW),
        },
        {
            key: 'medicine_categories',
            label: 'Kategori obat',
            permission: hasPermission(PERMISSIONS.MEDICINE_CATEGORY.VIEW),
        },
        {
            key: 'medicine_warehouses',
            label: 'Gudang obat',
            permission: hasPermission(PERMISSIONS.MEDICINE_WAREHOUSE.VIEW),
        },
    ];

    const handleTabChange = (value) => {
        const selectedTab = tabs.find(tab => tab.key === value);

        if (!selectedTab?.permission) {
            toast.error('Akses Ditolak', {
                description: 'Anda tidak memiliki izin untuk mengakses tab ini.'
            });
            return;
        }

        navigate({
            to: '/settings/medicine-management',
            search: {tab: value}
        });
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
                {tabs.map(tab => (
                    <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        disabled={!tab.permission}
                        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="flex items-center gap-2">
                            {tab.label}
                            {!tab.permission && <Lock className="w-3 h-3"/>}
                        </span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}