// src/routes/_protected/upgrade/index.jsx
import {createFileRoute} from '@tanstack/react-router';
import UpgradePage from '@features/upgrade/pages/index.jsx';

export const Route = createFileRoute('/_protected/upgrade/')({
    component: UpgradePage,
});