<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Services;

use Domains\Subscriptions\Infrastructure\Persistence\Models\OrderModel;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Xendit\XenditSdkException;

/**
 * Infrastructure Service: integrasi Xendit Invoice API.
 *
 * Diletakkan di Infrastructure karena bergantung pada Xendit SDK (third-party).
 * Application layer (OrderService) tidak tahu detail Xendit — hanya memanggil
 * method createInvoice() yang mengembalikan array standar.
 */
final class XenditPaymentService
{
    private InvoiceApi $invoiceApi;

    public function __construct()
    {
        Configuration::setXenditKey(config('xendit.secret_key'));
        $this->invoiceApi = new InvoiceApi();
    }

    /**
     * Buat Xendit Invoice dari Order.
     *
     * @throws XenditSdkException
     * @return array{invoice_id: string, status: string, invoice_url: string, payment_url: string}
     */
    public function createInvoice(OrderModel $order): array
    {
        $user = auth()->user();

        $body = new CreateInvoiceRequest([
            'external_id'      => (string) $order->id,
            'amount'           => (float) $order->amount,
            'description'      => "Subscription Order #{$order->order_number}",
            'customer'         => [
                'given_names' => $user?->name,
                'email'       => $user?->email,
            ],
            'currency'         => 'IDR',
            'invoice_duration' => 86400, // 24 jam
        ]);

        $invoice = $this->invoiceApi->createInvoice($body);

        return [
            'invoice_id'  => $invoice->getId(),
            'status'      => $invoice->getStatus(),
            'invoice_url' => $invoice->getInvoiceUrl(),
            'payment_url' => $invoice->getInvoiceUrl(),
        ];
    }
}
