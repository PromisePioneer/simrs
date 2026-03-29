import {createRootRoute, Outlet} from '@tanstack/react-router';
import RouteProgress from "@shared/components/loading/index.jsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <RouteProgress/>
            <Outlet/>
        </>
    ),
});

