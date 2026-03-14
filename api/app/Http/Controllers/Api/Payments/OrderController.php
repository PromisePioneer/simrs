<?php

namespace App\Http\Controllers\Api\Payments;

use App\Http\Controllers\Controller;
use App\Services\Payment\Order\Service\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Xendit\XenditSdkException;

class OrderController extends Controller
{
    use ApiResponse;

    private OrderService $orderService;

    public function __construct()
    {
        $this->orderService = new OrderService();
    }

    public function createOrder(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|uuid|exists:plans,id',
        ]);

        try {
            $data = $this->orderService->store($request);

            // Ambil payment_url dari payment record yang tersimpan
            // lebih reliable daripada dari invoice response langsung
            $paymentUrl = $data->order->payment?->payment_url
                ?? $data->payment_url['payment_url']
                ?? null;

            return $this->successResponse([
                'order' => $data->order,
                'payment_url' => $paymentUrl,
                'existing' => $data->existing ?? false,
            ], $data->existing ?? false
                ? 'Order masih aktif. Lanjutkan pembayaran.'
                : 'Order berhasil dibuat. Lanjutkan ke halaman pembayaran.'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        } catch (XenditSdkException $e) {
            return $this->errorResponse('Gagal membuat invoice pembayaran: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

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
            'order' => $order,
            'payment_url' => $order->payment?->payment_url,
        ]);
    }

    public function handleWebhook(Request $request): JsonResponse
    {
        // Validasi webhook token dari Xendit
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
