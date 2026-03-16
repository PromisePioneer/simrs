<?php

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\PaymentMethodRepositoryInterface;
use Domains\IAM\Domain\Repository\PoliRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class PaymentMethodService extends BaseCrudService
{
    public function __construct(PaymentMethodRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
