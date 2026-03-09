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
import {Controller, useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";

function SwitchTenant() {
    const {fetchTenants, tenants, switchTenant} = useTenantStore();
    const {fetchRolesByTenantId, rolesByTenantId} = useRoleStore();


    const {
        watch,
        handleSubmit,
        setValue,
        control,
        formState: {errors, isSubmitting},
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            tenant_id: "",
            role_id: ""
        }
    });

    const watchTenantId = watch("tenant_id");

    useEffect(() => {
        fetchTenants();
    }, []);

    useEffect(() => {
        if (watchTenantId) {
            fetchRolesByTenantId(watchTenantId);
            setValue("role_id", "");
        }
    }, [watchTenantId, fetchRolesByTenantId]);

    const onSubmit = async (data) => {
        await switchTenant(data);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="tenant_id">Merchant</Label>
                        <Controller
                            name="tenant_id"
                            control={control}
                            rules={{required: "Merchant harus dipilih!"}}
                            render={({field}) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue
                                            placeholder="Pilih Tenant"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tenants?.map((tenant) => (
                                            <SelectItem key={tenant.id}
                                                        value={tenant.id}>
                                                {tenant.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.tenant_id && (
                            <p className="text-sm text-destructive">{errors.tenant_id.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tenant_id">Peran Pengguna</Label>
                        <Controller
                            name="role_id"
                            control={control}
                            render={({field}) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!watchTenantId}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue
                                            placeholder="Pilih Peran"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolesByTenantId?.map((role) => (
                                            <SelectItem key={role.uuid}
                                                        value={role.uuid}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Harap tunggu..' : "Submit"}</Button>
            </form>
        </>
    );

}

export default SwitchTenant;