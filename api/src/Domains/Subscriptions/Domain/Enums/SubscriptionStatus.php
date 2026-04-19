<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Enums;

enum SubscriptionStatus: string
{
    case Active    = 'active';
    case Expired   = 'expired';
    case Cancelled = 'cancelled';
    case Trialing  = 'trialing';
}
