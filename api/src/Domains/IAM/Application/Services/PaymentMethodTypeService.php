<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\PaymentMethodTypeRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class PaymentMethodTypeService extends BaseCrudService
{
    public function __construct(PaymentMethodTypeRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
