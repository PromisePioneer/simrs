import {useRouterState} from "@tanstack/react-router";
import {useEffect} from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function RouteProgress() {
    const {isLoading} = useRouterState();
    useEffect(() => {
        if (isLoading) {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }, [isLoading]);

    return null;
}


export default RouteProgress;