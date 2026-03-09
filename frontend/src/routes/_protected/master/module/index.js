import {createFileRoute} from '@tanstack/react-router';
import ModulePage from "@/pages/master/module/index.jsx";

export const Route = createFileRoute('/_protected/master/module/')({
    component: ModulePage
});