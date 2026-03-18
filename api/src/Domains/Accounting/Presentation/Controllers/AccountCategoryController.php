<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Controllers;

use App\Traits\ApiResponse;
use Domains\Accounting\Application\Services\AccountCategoryService;
use Domains\Accounting\Application\Services\AccountService;
use Domains\Accounting\Presentation\Requests\AccountCategoryRequest;
use Domains\Accounting\Presentation\Requests\AccountRequest;
use Domains\Accounting\Presentation\Resources\AccountCategoryResource;
use Domains\Accounting\Presentation\Resources\AccountResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class AccountCategoryController extends BaseCrudController
{
    protected string $resourceClass = AccountCategoryResource::class;

    public function __construct(AccountCategoryService $service)
    {
        parent::__construct($service);
    }

    public function store(AccountCategoryRequest $request): JsonResponse
    {
        $result = $this->service->store($request->validated());
        return response()->json(new AccountCategoryResource($result), 201);
    }

    public function update(AccountCategoryRequest $request, string $id): JsonResponse
    {
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new AccountCategoryResource($result));
    }
}
