import {createFileRoute} from '@tanstack/react-router'
import SettingPage from "@/pages/settings/index.jsx";

export const Route = createFileRoute('/_protected/settings/')({
    component: SettingPage,
});
