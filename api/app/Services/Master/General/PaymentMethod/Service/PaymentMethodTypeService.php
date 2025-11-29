<?php

namespace App\Services\Master\General\PaymentMethod\Service;

use App\Http\Requests\PaymentMethodTypeRequest;
use App\Services\Master\General\PaymentMethod\Repository\PaymentMethodTypeRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentMethodTypeService
{
    private PaymentMethodTypeRepository $paymentMethodRepository;

    public function __construct()
    {
        $this->paymentMethodRepository = new PaymentMethodTypeRepository();
    }


    public function getAllPaymentMethodTypes(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->paymentMethodRepository->getAllPaymentMethodTypes($filters, $perPage);
    }


    public function store(PaymentMethodTypeRequest $request): ?object
    {
        $data = $request->validated();
        return $this->paymentMethodRepository->store($data);
    }


    public function update(PaymentMethodTypeRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->paymentMethodRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->paymentMethodRepository->destroy($id);
    }
}
