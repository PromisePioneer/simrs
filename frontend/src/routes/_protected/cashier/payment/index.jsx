import {createFileRoute} from '@tanstack/react-router'
import PaymentPage from "@/pages/payment/index.jsx";

export const Route = createFileRoute('/_protected/cashier/payment/')({
    component: PaymentPage,
})