<?php

namespace App\Services\Payment\Order\Service;

use App\Models\Order;
use App\Models\Subscription;
use App\Services\Master\General\Pricing\Repository\PlanRepository;
use App\Services\Master\General\Pricing\Repository\SubscriptionRepository;
use App\Services\Payment\Order\Repository\OrderRepository;
use App\Services\Tenant\SubscriptionCacheHelper;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Xendit\XenditSdkException;

class OrderService
{
    private OrderRepository $orderRepository;
    private PlanRepository $planRepository;
    private XenditPaymentService $xenditPaymentService;
    private PaymentService $paymentService;
    private SubscriptionRepository $subscriptionRepository;

    public function __construct()
    {
        $this->orderRepository        = new OrderRepository();
        $this->planRepository         = new PlanRepository();
        $this->xenditPaymentService   = new XenditPaymentService();
        $this->paymentService         = new PaymentService();
        $this->subscriptionRepository = new SubscriptionRepository();
    }

    public function generateOrderNumber(): string
    {
        return 'ORD-' . now()->format('YmdHis') . '-' . mt_rand(1000, 9999);
    }

    /**
     * @throws XenditSdkException
     */
    public function store(Request $request): object
    {
        $tenantId = auth()->user()->getActiveTenantId();

        // Cek order pending yang masih aktif
        $activeOrder = $this->orderRepository->getValidByTenantId($tenantId);
        if ($activeOrder) {
            // Kalau payment_url ada, kembalikan order yang lama
            $paymentUrl = $activeOrder->payment?->payment_url;
            if ($paymentUrl) {
                return (object) [
                    'order'       => $activeOrder->load('plan'),
                    'payment_url' => ['payment_url' => $paymentUrl],
                    'existing'    => true,
                ];
            }

            // Kalau payment_url tidak ada (rusak), cancel order lama dan buat baru
            $activeOrder->update(['status' => 'cancelled']);
        }

        $plan = $this->planRepository->findById($request->plan_id);

        $order = $this->orderRepository->store([
            'tenant_id'    => $tenantId,
            'plan_id'      => $plan->id,
            'order_number' => $this->generateOrderNumber(),
            'amount'       => $plan->price,
            'total'        => $plan->price,
            'status'       => 'pending',
            'paid_at'      => null,
            'expires_at'   => now()->addHours(24),
        ]);

        $invoice = $this->xenditPaymentService->createInvoice($order);

        $this->paymentService->store(
            request: $request,
            order: $order,
            invoice: $invoice
        );

        return (object) [
            'order'       => $order->load(['plan', 'payment']),
            'payment_url' => $invoice,
            'existing'    => false,
        ];
    }

    public function getActiveOrder(string $tenantId): ?Order
    {
        return $this->orderRepository->getValidByTenantId($tenantId)?->load(['plan', 'payment']);
    }

    public function handleWebhook(array $payload): void
    {
        $externalId = $payload['external_id'] ?? null;
        $status     = strtolower($payload['status'] ?? '');

        if (!$externalId) return;

        $order = Order::find($externalId);
        if (!$order) return;

        match ($status) {
            'paid', 'settled' => $this->handlePaid($order, $payload),
            'expired'         => $order->update(['status' => 'expired']),
            default           => null,
        };
    }

    private function handlePaid(Order $order, array $payload): void
    {
        $order->update(['status' => 'paid', 'paid_at' => now()]);

        $order->payment?->update([
            'status'                 => 'success',
            'gateway_transaction_id' => $payload['id'] ?? $order->order_number,
            'payment_type'           => $payload['payment_method'] ?? null,
            'paid_at'                => now(),
        ]);

        $tenantId = $order->tenant_id;

        $this->subscriptionRepository->assignSubs([
            'tenant_id'     => $tenantId,
            'plan_id'       => $order->plan_id,
            'status'        => 'active',
            'starts_at'     => now(),
            'ends_at'       => now()->addMonth(),
            'trial_ends_at' => null,
            'cancelled_at'  => null,
        ]);

        SubscriptionCacheHelper::clearModuleAccess($tenantId);
    }
}
