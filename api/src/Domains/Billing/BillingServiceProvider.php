<?php

declare(strict_types=1);

namespace Domains\Billing;

use Domains\Billing\Application\Services\AccountingJournalService;
use Domains\Billing\Application\Services\InpatientBillService;
use Domains\Billing\Application\Services\OutpatientBillService;
use Domains\Billing\Presentation\Controllers\InpatientBillController;
use Domains\Billing\Presentation\Controllers\OutpatientBillController;
use Illuminate\Support\ServiceProvider;

class BillingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AccountingJournalService::class);
        $this->app->singleton(OutpatientBillService::class);
        $this->app->singleton(InpatientBillService::class);

        $this->app->bind(OutpatientBillController::class,
            fn($app) => new OutpatientBillController($app->make(OutpatientBillService::class)));

        $this->app->bind(InpatientBillController::class,
            fn($app) => new InpatientBillController($app->make(InpatientBillService::class)));
    }
}
