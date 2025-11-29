<?php

namespace App\Http\Controllers\Api\Master\General\PaymentMethod;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentMethodTypeRequest;
use App\Models\PaymentMethodType;
use App\Services\Master\General\PaymentMethod\Service\PaymentMethodTypeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodTypeController extends Controller
{
    use ApiResponse;

    private PaymentMethodTypeService $paymentMethodTypeService;

    public function __construct()
    {
        $this->paymentMethodTypeService = new PaymentMethodTypeService();
    }


    public function index(Request $request): JsonResponse
    {
        $paymentMethodTypes = $this->paymentMethodTypeService->getAllPaymentMethodTypes($request);
        return response()->json($paymentMethodTypes);
    }


    public function store(PaymentMethodTypeRequest $request): JsonResponse
    {
        $this->authorize('create', PaymentMethodType::class);
        $data = $this->paymentMethodTypeService->store($request);
        return $this->successResponse($data, 'Payment method type successfully created.');
    }


    public function update(PaymentMethodTypeRequest $request, PaymentMethodType $paymentMethodType): JsonResponse
    {
        $this->authorize('update', $paymentMethodType);
        $data = $request->validated();
        $data = $this->paymentMethodTypeService->update($paymentMethodType->id, $data);
        return $this->successResponse($paymentMethodType, 'Payment method type successfully updated.');
    }


    public function show(PaymentMethodType $paymentMethodType): JsonResponse
    {
        $this->authorize('view', $paymentMethodType);
        return response()->json($paymentMethodType);
    }


    public function destroy(PaymentMethodType $paymentMethodType): JsonResponse
    {
        $this->authorize('delete', $paymentMethodType);
        $data = $this->paymentMethodTypeService->destroy($paymentMethodType->id);
        return $this->successResponse($data, 'Payment method type successfully deleted.');
    }
}
