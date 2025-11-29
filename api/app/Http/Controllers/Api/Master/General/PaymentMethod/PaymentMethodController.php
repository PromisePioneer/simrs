<?php

namespace App\Http\Controllers\Api\Master\General\PaymentMethod;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentMethodRequest;
use App\Models\PaymentMethod;
use App\Services\Master\General\PaymentMethod\Service\PaymentMethodService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{

    use ApiResponse;

    private PaymentMethodService $paymentMethodService;

    public function __construct()
    {
        $this->paymentMethodService = new PaymentMethodService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->paymentMethodService->getAllPaymentMethods($request);
        return response()->json($data);
    }


    public function store(PaymentMethodRequest $request): JsonResponse
    {
        $this->authorize('create', PaymentMethod::class);
        $paymentMethod = $this->paymentMethodService->store($request);
        return $this->successResponse($paymentMethod, 'Payment Method has been created successfully.');
    }


    public function show(PaymentMethod $paymentMethod): JsonResponse
    {
        $this->authorize('view', $paymentMethod);
        return response()->json($paymentMethod);
    }


    public function update(PaymentMethodRequest $request, PaymentMethod $paymentMethod): JsonResponse
    {
        $this->authorize('update', $paymentMethod);
        $paymentMethod = $this->paymentMethodService->update($request, $paymentMethod->id);
        return $this->successResponse($paymentMethod, 'Payment Method has been updated successfully.');
    }


    public function destroy(PaymentMethod $paymentMethod): JsonResponse
    {
        $this->authorize('delete', $paymentMethod);
        $paymentMethod = $this->paymentMethodService->destroy($paymentMethod);
        return $this->successResponse($paymentMethod, 'Payment Method has been deleted successfully.');
    }
}
