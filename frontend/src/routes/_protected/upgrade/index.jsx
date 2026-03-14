// src/routes/_protected/upgrade/index.jsx
import {createFileRoute} from '@tanstack/react-router';
import UpgradePage from '@/pages/upgrade/index.jsx';

export const Route = createFileRoute('/_protected/upgrade/')({
    component: UpgradePage,
});