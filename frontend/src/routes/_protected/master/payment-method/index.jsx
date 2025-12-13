import {createFileRoute} from '@tanstack/react-router'
import PaymentMethodPage from "@/pages/master/payment-method/index.jsx";

export const Route = createFileRoute('/_protected/master/payment-method/')({
    component: PaymentMethodPage,
})
