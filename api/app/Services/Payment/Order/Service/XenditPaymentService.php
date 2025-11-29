<?php

namespace App\Services\Payment\Order\Service;

use App\Models\Order;
use App\Services\Master\General\Pricing\Repository\SubscriptionRepository;
use App\Services\Payment\Order\Repository\OrderRepository;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Xendit\XenditSdkException;

class XenditPaymentService
{

    protected InvoiceApi $xenditInvoiceApi;
    protected OrderRepository $orderRepository;
    protected PaymentService $paymentService;
    protected SubscriptionRepository $subscriptionRepository;

    public function __construct()
    {
        Configuration::setXenditKey(config('xendit.secret_key'));
        $this->xenditInvoiceApi = new InvoiceApi();
        $this->orderRepository = new OrderRepository();
        $this->paymentService = new PaymentService();
        $this->subscriptionRepository = new SubscriptionRepository();
    }

    /**
     * @throws XenditSdkException
     */
    public function createInvoice(Order $order): array
    {
        $body = new CreateInvoiceRequest([
            'external_id' => (string)$order->id,
            'amount' => (float)$order->amount,
            'description' => "Credit Order #" . $order->id,
            'customer' => [
                'given_names' => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
            'currency' => 'IDR',
            'invoice_duration' => 86400,
        ]);

        $invoice = $this->xenditInvoiceApi->createInvoice($body);

        return [
            'invoice_id' => $invoice->getId(),
            'status' => $invoice->getStatus(),
            'invoice_url' => $invoice->getInvoiceUrl(),
            'payment_url' => $invoice->getInvoiceUrl()
        ];
    }
}
