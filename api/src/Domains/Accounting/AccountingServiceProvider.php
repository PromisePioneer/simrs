<?php

declare(strict_types=1);

namespace Domains\Accounting;

use Domains\Accounting\Application\Services\AccountCategoryService;
use Domains\Accounting\Application\Services\AccountService;
use Domains\Accounting\Infrastructure\Persistence\Repositories\EloquentAccountCategoryRepository;
use Domains\Accounting\Infrastructure\Persistence\Repositories\EloquentAccountRepository;
use Domains\Accounting\Presentation\Controllers\AccountCategoryController;
use Domains\Accounting\Presentation\Controllers\AccountController;
use Illuminate\Support\ServiceProvider;

class AccountingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AccountCategoryService::class,
            fn($app) => new AccountCategoryService(new EloquentAccountCategoryRepository()));
        $this->app->bind(AccountService::class,
            fn($app) => new AccountService(new EloquentAccountRepository()));

        $this->app->bind(AccountCategoryController::class,
            fn($app) => new AccountCategoryController($app->make(AccountCategoryService::class)));
        $this->app->bind(AccountController::class,
            fn($app) => new AccountController($app->make(AccountService::class)));
    }
}
