import {createFileRoute} from '@tanstack/react-router';
import UserPage from "@/pages/master/user/index.jsx";
import {useUserStore} from "@/store/useUserStore.js";
import {useUserCrud} from "@/hooks/useUserCrud.js";

export const Route = createFileRoute('/_protected/master/user/')({
    component: UserPage
});