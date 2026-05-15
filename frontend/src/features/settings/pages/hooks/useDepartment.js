import {useDepartmentStore} from "@features/settings/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";


export const useDepartment = () => {
    const store = useDepartmentStore();


    const {
        register,
        handleSubmit,
        reset,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            description: ""
        }
    });


    useEffect(() => {
        store.fetchDepartments({perPage: 20});
    }, [store.fetchDepartments, store.search, store.currentPage]);

    useEffect(() => {
        if (store.departmentValue && !store.openDeleteModal) {
            reset({
                name: store.departmentValue.name || "",
                description: store.departmentValue.description || ""
            })
        } else {
            reset({name: "", description: ""});
        }
    }, [store.departmentValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", description: ""});
            if (store.setDepartmentValue) store.setDepartmentValue(null);
        }
    }, [store.openModal, store.setDepartmentValue]);

    const onSubmit = async (data) => {
        if (store.departmentValue) {
            await store.updateDepartment(store.departmentValue.id, data);
        } else {
            await store.createDepartment(data);
        }
    };


    return {}
}