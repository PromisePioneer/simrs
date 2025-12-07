import {createRouter, RouterProvider} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen.ts';
import {Spinner} from "@/components/ui/spinner.jsx";
import {useLoadingStore} from "@/store/loadingStore.js";

const router = createRouter({routeTree});

function App() {
    const loading = useLoadingStore((state) => state.loading);
    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <Spinner className="size-12"/>
                </div>
            )}
            <RouterProvider router={router}/>
        </>
    );
}

export default App;