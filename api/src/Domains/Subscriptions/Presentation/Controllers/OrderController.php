<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Controllers;

use App\Traits\ApiResponse;
use Domains\Subscriptions\Application\Services\OrderService;
use Domains\Subscriptions\Presentation\Requests\OrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Xendit\XenditSdkException;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OrderService $orderService,
    ) {}

    /**
     * Buat order baru dan dapatkan payment URL Xendit.
     * POST /api/v1/orders
     */
    public function createOrder(OrderRequest $request): JsonResponse
    {
        $tenantId = auth()->user()?->getActiveTenantId();

        if (!$tenantId) {
            return $this->errorResponse('Tenant tidak ditemukan.', 404);
        }

        try {
            $result = $this->orderService->createOrder($tenantId, $request->plan_id);

            return $this->successResponse(
                [
                    'order'       => $result->order,
                    'payment_url' => $result->payment_url,
                    'existing'    => $result->existing,
                ],
                $result->existing
                    ? 'Order masih aktif. Lanjutkan pembayaran.'
                    : 'Order berhasil dibuat. Lanjutkan ke halaman pembayaran.'
            );
        } catch (XenditSdkException $e) {
            return $this->errorResponse('Gagal membuat invoice pembayaran: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Cek order pending aktif tenant yang sedang login.
     * GET /api/v1/orders/active
     */
    public function activeOrder(): JsonResponse
    {
        $tenantId = auth()->user()?->getActiveTenantId();

        if (!$tenantId) {
            return $this->errorResponse('Tenant tidak ditemukan.', 404);
        }

        $order = $this->orderService->getActiveOrder($tenantId);

        if (!$order) {
            return $this->successResponse(null, 'Tidak ada order aktif.');
        }

        return $this->successResponse([
            'order'       => $order,
            'payment_url' => $order->payment?->payment_url,
        ]);
    }

    /**
     * Webhook callback dari Xendit.
     * POST /api/v1/orders/webhook
     *
     * Endpoint ini harus di-exclude dari CSRF & auth middleware.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $webhookToken = $request->header('x-callback-token');

        if ($webhookToken !== config('xendit.webhook_token')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $this->orderService->handleWebhook($request->all());

            return response()->json(['message' => 'OK']);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
