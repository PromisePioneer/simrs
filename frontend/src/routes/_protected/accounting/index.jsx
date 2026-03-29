import {createFileRoute} from '@tanstack/react-router'
import AccountingPage from "@features/accounting/pages/index.jsx";
import {z} from "zod";


const accountingSearchSchema = z.object({
    tab: z
        .enum(["chart-of-accounts", "journal", "reports"])
        .optional()
        .default("chart-of-accounts"),
});


export const Route = createFileRoute('/_protected/accounting/')({
    validateSearch: accountingSearchSchema,
    component: AccountingPage,
})
