<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Controllers;

use App\Traits\ApiResponse;
use Domains\Accounting\Application\Services\AccountService;
use Domains\Accounting\Presentation\Requests\AccountRequest;
use Domains\Accounting\Presentation\Resources\AccountResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class AccountController extends BaseCrudController
{
    protected string $resourceClass = AccountResource::class;

    public function __construct(AccountService $service)
    {
        parent::__construct($service);
    }

    public function store(AccountRequest $request): JsonResponse
    {
        $result = $this->service->store($request->validated());
        return response()->json(new AccountResource($result), 201);
    }

    public function update(AccountRequest $request, string $id): JsonResponse
    {
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new AccountResource($result));
    }
}
