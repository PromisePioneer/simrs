<?php

declare(strict_types=1);

namespace Domains\Subscriptions;

use Domains\Subscriptions\Application\Services\OrderService;
use Domains\Subscriptions\Application\Services\PlanService;
use Domains\Subscriptions\Application\Services\SubscriptionService;
use Domains\Subscriptions\Domain\Repository\OrderRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\PlanRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\SubscriptionPaymentRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\SubscriptionRepositoryInterface;
use Domains\Subscriptions\Infrastructure\Persistence\Repositories\EloquentOrderRepository;
use Domains\Subscriptions\Infrastructure\Persistence\Repositories\EloquentPlanRepository;
use Domains\Subscriptions\Infrastructure\Persistence\Repositories\EloquentSubscriptionPaymentRepository;
use Domains\Subscriptions\Infrastructure\Persistence\Repositories\EloquentSubscriptionRepository;
use Domains\Subscriptions\Infrastructure\Services\XenditPaymentService;
use Domains\Subscriptions\Presentation\Controllers\OrderController;
use Domains\Subscriptions\Presentation\Controllers\PlanController;
use Domains\Subscriptions\Presentation\Controllers\SubscriptionController;
use Illuminate\Support\ServiceProvider;

class SubscriptionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind interfaces to implementations
        $this->app->bind(PlanRepositoryInterface::class, EloquentPlanRepository::class);
        $this->app->bind(SubscriptionRepositoryInterface::class, EloquentSubscriptionRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, EloquentOrderRepository::class);
        $this->app->bind(SubscriptionPaymentRepositoryInterface::class, EloquentSubscriptionPaymentRepository::class);

        // Bind Application Services
        $this->app->bind(PlanService::class, fn($app) => new PlanService(
            $app->make(PlanRepositoryInterface::class),
        ));

        $this->app->bind(SubscriptionService::class, fn($app) => new SubscriptionService(
            $app->make(SubscriptionRepositoryInterface::class),
            $app->make(PlanRepositoryInterface::class),
        ));

        $this->app->bind(OrderService::class, fn($app) => new OrderService(
            $app->make(OrderRepositoryInterface::class),
            $app->make(PlanRepositoryInterface::class),
            $app->make(SubscriptionRepositoryInterface::class),
            $app->make(SubscriptionPaymentRepositoryInterface::class),
            $app->make(XenditPaymentService::class),
        ));

        // Bind Controllers
        $this->app->bind(PlanController::class, fn($app) => new PlanController(
            $app->make(PlanService::class),
        ));

        $this->app->bind(SubscriptionController::class, fn($app) => new SubscriptionController(
            $app->make(SubscriptionService::class),
        ));

        $this->app->bind(OrderController::class, fn($app) => new OrderController(
            $app->make(OrderService::class),
        ));
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/Presentation/routes/subscriptions.php');
    }
}
