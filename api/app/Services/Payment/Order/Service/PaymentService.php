<?php

namespace App\Services\Payment\Order\Service;

use App\Models\Order;
use App\Services\Payment\Order\Repository\PaymentRepository;
use Illuminate\Http\Request;

class PaymentService
{
    private PaymentRepository $paymentRepository;

    public function __construct()
    {
        $this->paymentRepository = new PaymentRepository();
    }

    public function store(Request $request, Order $order, ?array $invoice = null)
    {
        $data = [
            'order_id' => $order->id,
            'gateway_transaction_id' => $order->order_number,
            'payment_type' => $request->payment_method,
            'amount' => $order->amount,
            'status' => strtolower($order->status),
            'payment_url' => $invoice['payment_url'],
            'gateway_response' => $request->all(),
        ];

        return $this->paymentRepository->store($data);
    }
}
