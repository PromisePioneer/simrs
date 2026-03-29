import Layout from "@features/dashboard/pages/layout.jsx";
import {useModuleStore} from "@shared/store";
import {useEffect} from "react";
import ModuleDragDropMenu from "@shared/components/module-drag-and-drop.jsx";

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