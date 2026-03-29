import {createFileRoute} from '@tanstack/react-router'
import SettingPage from "@features/settings/pages/index.jsx";

export const Route = createFileRoute('/_protected/settings/')({
    component: SettingPage,
});
