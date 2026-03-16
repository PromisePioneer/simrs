<?php

namespace App\Services\Master\General\PaymentMethod\Service;

use App\Models\PaymentMethod;
use App\Services\Master\General\PaymentMethod\Repository\PaymentMethodRepository;
use Domains\IAM\Presentation\Requests\PaymentMethodRequest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentMethodService
{
    private PaymentMethodRepository $paymentMethodRepository;

    public function __construct()
    {
        $this->paymentMethodRepository = new PaymentMethodRepository();
    }


    public function getAllPaymentMethods(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->paymentMethodRepository->getAllPaymentMethods($filters, $perPage);
    }

    public function store(PaymentMethodRequest $request): ?object
    {
        $data = $request->validated();
        return $this->paymentMethodRepository->store($data);
    }


    public function update(PaymentMethodRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->paymentMethodRepository->update($id, $data);
    }


    public function destroy(PaymentMethod $paymentMethod): ?object
    {
        return $this->paymentMethodRepository->destroy($paymentMethod->id);
    }
}
