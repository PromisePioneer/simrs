<?php

namespace App\Http\Controllers\Api\Payments;

use App\Http\Controllers\Controller;
use App\Models\Order;
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


    /**
     * @throws XenditSdkException
     */
    public function createOrder(Request $request): JsonResponse
    {
        $data = $this->orderService->store($request);
        return $this->successResponse($data, 'Order created successfully');
    }
}
