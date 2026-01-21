import {useTenantStore} from "@/store/useTenantStore.js";
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
import {useRoleStore} from "@/store/useRoleStore.js";
import {useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.jsx";
import {Button} from "@/components/ui/button.jsx";

function SwitchTenant({onSubmit}) {
    const {fetchTenants, tenants, switchTenant} = useTenantStore();
    const {fetchRolesByTenantId, rolesByTenantId} = useRoleStore();


    const form = useForm({
        defaultValues: {
            tenant_id: "",
            role_id: ""
        }
    });

    const watchTenantId = form.watch("tenant_id");

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    // Fetch roles when a tenant is selected
    useEffect(() => {
        if (watchTenantId) {
            fetchRolesByTenantId(watchTenantId);
            form.setValue("role_id", ""); // Reset role when tenant changes
        }
    }, [watchTenantId, fetchRolesByTenantId, form]);

    const handleSubmit = async (data) => {
        await switchTenant(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="tenant_id"
                        rules={{required: "Tenant harus dipilih"}}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Tenant / Klinik <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih tenant"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Daftar Tenant</SelectLabel>
                                            {tenants && tenants.length > 0 ? (
                                                tenants.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={String(t.id)}>
                                                        {t.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    Tidak ada tenant tersedia
                                                </div>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role_id"
                        rules={{required: "Role harus dipilih"}}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Role <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!watchTenantId}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih role"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Daftar Role</SelectLabel>
                                            {rolesByTenantId && rolesByTenantId.length > 0 ? (
                                                rolesByTenantId.map((role) => (
                                                    <SelectItem
                                                        key={role.uuid}
                                                        value={String(role.uuid)}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    {watchTenantId ? "Tidak ada role tersedia" : "Pilih tenant terlebih dahulu"}
                                                </div>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default SwitchTenant;