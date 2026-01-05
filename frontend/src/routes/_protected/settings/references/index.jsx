import {createFileRoute} from '@tanstack/react-router'
import ReferencesPage from "@/pages/settings/references/index.jsx";

export const Route = createFileRoute('/_protected/settings/references/')({
    component: ReferencesPage,
})
