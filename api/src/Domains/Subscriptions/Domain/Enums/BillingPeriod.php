<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Enums;

enum BillingPeriod: string
{
    case Monthly  = 'monthly';
    case Yearly   = 'yearly';
    case Lifetime = 'lifetime';
}
