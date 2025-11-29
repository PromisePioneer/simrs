<?php

namespace App\Http\Controllers\Api\Payments;

use App\Http\Requests\OrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;

class PaymentController
{
    private InvoiceApi $xenditInvoiceApi;

    public function __construct()
    {
        Configuration::setXenditKey(config('services.xendit.secret_key'));
        $this->xenditInvoiceApi = new InvoiceApi();
    }

    public function createOrder(OrderRequest $request)
    {

        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id;
        Order::create([
        ]);
    }

    public function createInvoice(Order $order)
    {

    }
}
