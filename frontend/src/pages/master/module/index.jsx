import Layout from "@/pages/dashboard/layout.jsx";
import {useModuleStore} from "@/store/useModuleStore.js";
import {useEffect} from "react";
import ModuleDragDropMenu from "@/components/module-drag-and-drop.jsx";

function ModulePage() {
    const {fetchModules, moduleData, updateModules} = useModuleStore();

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    const handleSave = async (updatedModules) => {
        console.log("Data yang akan disimpan:", updatedModules);
        try {
            await updateModules(updatedModules);
            window.location.reload();
        } catch (error) {
            console.error("Error updating modules:", error);
            throw error;
        }
    };


    return (
        <Layout>
            <div className="container mx-auto p-4">
                {moduleData && <ModuleDragDropMenu
                    initialModules={moduleData}
                    onSave={handleSave}
                />}
            </div>
        </Layout>
    )
}

export default ModulePage;