import {createRootRoute, Outlet} from '@tanstack/react-router';
import RouteProgress from "@/components/loading/index.jsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <RouteProgress/>
            <Outlet/>
        </>
    ),
});

