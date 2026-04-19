<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Application\Services;

use Domains\Subscriptions\Domain\Repository\OrderRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\PlanRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\SubscriptionPaymentRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\SubscriptionRepositoryInterface;
use Domains\Subscriptions\Infrastructure\Persistence\Models\OrderModel;
use Domains\Subscriptions\Infrastructure\Services\XenditPaymentService;
use Domains\Tenant\Infrastructure\Services\SubscriptionCacheHelper;
use Xendit\XenditSdkException;

class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly PlanRepositoryInterface $planRepository,
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
        private readonly SubscriptionPaymentRepositoryInterface $paymentRepository,
        private readonly XenditPaymentService $xenditPaymentService,
    ) {}

    /**
     * Buat order baru untuk pembelian plan.
     * Jika sudah ada order pending + payment_url valid, kembalikan yang lama.
     *
     * @throws XenditSdkException
     */
    public function createOrder(string $tenantId, string $planId): object
    {
        // Cek order pending yang masih aktif
        $activeOrder = $this->orderRepository->findValidByTenantId($tenantId);

        if ($activeOrder) {
            $paymentUrl = $activeOrder->payment?->payment_url;

            if ($paymentUrl) {
                return (object) [
                    'order'       => $activeOrder->load('plan'),
                    'payment_url' => $paymentUrl,
                    'existing'    => true,
                ];
            }

            // payment_url hilang → cancel dan buat ulang
            $activeOrder->update(['status' => 'cancelled']);
        }

        $plan = $this->planRepository->findById($planId);

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

        $this->paymentRepository->store([
            'order_id'    => $order->id,
            'tenant_id'   => $tenantId,
            'gateway'     => 'xendit',
            'amount'      => $plan->price,
            'status'      => 'pending',
            'payment_url' => $invoice['payment_url'],
        ]);

        return (object) [
            'order'       => $order->load(['plan', 'payment']),
            'payment_url' => $invoice['payment_url'],
            'existing'    => false,
        ];
    }

    public function getActiveOrder(string $tenantId): ?OrderModel
    {
        return $this->orderRepository->findValidByTenantId($tenantId)?->load(['plan', 'payment']);
    }

    /**
     * Handle webhook dari Xendit.
     */
    public function handleWebhook(array $payload): void
    {
        $externalId = $payload['external_id'] ?? null;
        $status     = strtolower($payload['status'] ?? '');

        if (!$externalId) {
            return;
        }

        // external_id di Xendit = order.id
        $order = OrderModel::find($externalId);
        if (!$order) {
            return;
        }

        match ($status) {
            'paid', 'settled' => $this->handlePaid($order, $payload),
            'expired'         => $order->update(['status' => 'expired']),
            default           => null,
        };
    }

    // -------------------------------------------------------------------------

    private function handlePaid(OrderModel $order, array $payload): void
    {
        $order->update(['status' => 'paid', 'paid_at' => now()]);

        $order->payment?->update([
            'status'                 => 'success',
            'gateway_transaction_id' => $payload['id'] ?? $order->order_number,
            'payment_type'           => $payload['payment_method'] ?? null,
            'paid_at'                => now(),
        ]);

        $tenantId = $order->tenant_id;

        $this->subscriptionRepository->assignSubscription([
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

    private function generateOrderNumber(): string
    {
        return 'ORD-' . now()->format('YmdHis') . '-' . mt_rand(1000, 9999);
    }
}
