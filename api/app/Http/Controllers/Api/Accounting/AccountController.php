<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccountRequest;
use App\Models\Account;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AccountController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $accounts = Account::with(['children'])->whereNull('parent_id')
            ->orderBy('name')
            ->select(
                'id',
                'tenant_id',
                'account_category_id',
                'code',
                'name',
                'parent_id'
            )->paginate(10);
        return $this->successResponse($accounts);
    }

    public function store(AccountRequest $request): JsonResponse
    {
        $account = Account::create($request->validated());
        return $this->successResponse($account, 'Account created successfully.');
    }

    public function show(Account $account): JsonResponse
    {
        return response()->json($account);
    }

    public function update(AccountRequest $request, Account $account): JsonResponse
    {
        $account->update($request->validated());
        return $this->successResponse($account, 'Account updated successfully.');
    }

    public function destroy(Account $account): JsonResponse
    {
        $account->delete();
        return $this->successResponse($account, 'Account deleted successfully.');
    }
}
