<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccountCategoryRequest;
use App\Models\AccountCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountCategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $query = AccountCategory::query();

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $accountCategories = $query->paginate(20);
        return response()->json($accountCategories);
    }


    public function store(AccountCategoryRequest $request): JsonResponse
    {
        $accountCategory = AccountCategory::create($request->validated());
        return $this->successResponse($accountCategory, 'Account category created successfully.');
    }


    public function show(AccountCategory $accountCategory): JsonResponse
    {
        return response()->json($accountCategory);
    }

    public function update(AccountCategoryRequest $request, AccountCategory $accountCategory): JsonResponse
    {
        $accountCategory->update($request->validated());
        return $this->successResponse($accountCategory);
    }


    public function destroy(AccountCategory $accountCategory): JsonResponse
    {
        $accountCategory->delete();
        return $this->successResponse($accountCategory, 'Account category deleted successfully.');
    }
}
