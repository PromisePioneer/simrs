<?php

namespace App\Http\Controllers\Api\Master\General\Department;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use App\Services\Master\General\Department\Service\DepartmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    protected DepartmentService $departmentService;

    public function __construct()
    {
        $this->departmentService = new DepartmentService();
    }


    public function index(Request $request): JsonResponse
    {

        $this->authorize('view', Department::class);
        $data = $this->departmentService->getDepartments(request: $request);
        return response()->json($data);
    }


    public function store(DepartmentRequest $request): JsonResponse
    {
        $this->authorize('create', Department::class);
        $data = $this->departmentService->store(request: $request);
        return $this->successResponse(data: $data, message: 'Department created successfully.');
    }


    public function show(Department $department): JsonResponse
    {

        $this->authorize('view', Department::class);
        return response()->json($department);
    }


    public function update(DepartmentRequest $request, Department $department): JsonResponse
    {
        $this->authorize('update', Department::class);
        $data = $this->departmentService->update(request: $request, department: $department);
        return $this->successResponse(data: $data, message: 'Department updated successfully.');
    }


    public function destroy(Department $department): JsonResponse
    {
        $this->authorize('delete', Department::class);
        $data = $this->departmentService->destroy($department);
        return $this->successResponse(data: $data, message: 'Department deleted successfully.');
    }
}
