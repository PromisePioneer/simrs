<?php

namespace App\Enum\Plan;

enum BillingPeriod: string
{
    case Monthly = 'monthly';
    case Yearly = 'yearly';
}
