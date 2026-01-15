import {useAuthStore} from "@/store/authStore.js";
import {useTenantStore} from "@/store/useTenantStore.js";
import {Label} from "@/components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {useEffect} from "react";

function SwitchTenant({tenant, setTenant}) {
    const {fetchTenants, tenants} = useTenantStore();

    useEffect(() => {
        fetchTenants();
    }, []);

    return (
        <div className="space-y-2">
            <Label htmlFor="tenant_id">
                Tenant / Klinik <span className="text-destructive">*</span>
            </Label>

            <Select
                value={tenant}
                onValueChange={(value) => setTenant(value)}
            >
                <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Pilih tenant"/>
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Daftar Tenant</SelectLabel>

                        {tenants.map((t) => (
                            <SelectItem
                                key={t.id}
                                value={String(t.id)} // ⚠️ wajib string
                            >
                                {t.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}


export default SwitchTenant;