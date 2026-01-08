import {createFileRoute} from '@tanstack/react-router'
import MedicinePage from "@/pages/settings/medicines/index.jsx";

export const Route = createFileRoute('/_protected/settings/medicines/')({
    component: MedicinePage,
})
