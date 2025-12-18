import {createFileRoute} from '@tanstack/react-router'
import DegreePage from "@/pages/master/degree/index.jsx";

export const Route = createFileRoute('/_protected/master/degree/')({
    component: DegreePage,
});
