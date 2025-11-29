<?php

namespace App\Services\Payment\Order\Service;

use App\Models\Order;
use App\Services\Master\General\Pricing\Repository\PlanRepository;
use App\Services\Payment\Order\Repository\OrderRepository;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Xendit\XenditSdkException;

class OrderService
{
    private OrderRepository $orderRepository;
    private PlanRepository $planRepository;
    private XenditPaymentService $xenditPaymentService;
    private PaymentService $paymentService;

    public function __construct()
    {
        $this->orderRepository = new OrderRepository();
        $this->planRepository = new PlanRepository();
        $this->xenditPaymentService = new XenditPaymentService();
        $this->paymentService = new PaymentService();
    }


    public function generateOrderNumber(): string
    {
        return 'ORD-' . now()->format('YmdHis') . '-' . mt_rand(1000, 9999);
    }

    /**
     * @throws XenditSdkException
     */
    public function store(
        Request $request,
    ): object
    {
        $activeOrder = $this->orderRepository->getValidByTenantId(auth()->user()->tenant_id);


        if ($activeOrder) {
            throw ValidationException::withMessages([
                'order' => 'Order sudah aktif, bayar order yang lama terlebih dahulu.'
            ]);
        }

        $findPlan = $this->planRepository->findById($request->plan_id);

        $data = [
            'tenant_id' => auth()->user()->tenant_id,
            'plan_id' => $request->plan_id,
            'order_number' => $this->generateOrderNumber(),
            'amount' => $findPlan->price,
            'total' => $findPlan->price,
            'status' => $request->status ?? 'pending',
            'paid_at' => null,
            'expires_at' => now()->addHours(24),

        ];


        $order = $this->orderRepository->store($data);
        $invoice = $this->xenditPaymentService->createInvoice($order);
        $this->paymentService->store(
            request: $request,
            order: $order,
            invoice: $invoice
        );
        return (object)[
            'order' => $order,
            'payment_url' => $invoice,
        ];
    }
}
