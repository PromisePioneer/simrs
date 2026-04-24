<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\PaymentMethodRepositoryInterface;
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
