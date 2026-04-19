<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\IAM\Application\Services\ModuleService;
use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\IAM\Presentation\Requests\ModuleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ModuleController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ModuleService $moduleService,
    ) {}

    public function index(): JsonResponse
    {
        $data = $this->moduleService->getModules();
        return response()->json($data);
    }

    public function data(Request $request): JsonResponse
    {
        return response()->json($this->moduleService->getPaginatedModules($request));
    }

    /** @throws Throwable */
    public function store(ModuleRequest $request): JsonResponse
    {
        $module = $this->moduleService->store(
            data: $request->validated(),
            tenantId: $request->user()->tenant_id ?? null,
        );
        return $this->successResponse($module, 'Module berhasil dibuat.');
    }

    public function show(ModuleModel $module): JsonResponse
    {
        $module->load('permissions');
        return response()->json($module);
    }

    /** @throws Throwable */
    public function update(ModuleRequest $request, ModuleModel $module): JsonResponse
    {
        $result = $this->moduleService->update(
            moduleId: $module->id,
            data: $request->validated(),
            tenantId: $request->user()->tenant_id ?? null,
        );
        return $this->successResponse($result, 'Module berhasil diperbarui.');
    }

    /**
     * @throws Throwable
     */
    public function updatedModule(Request $request): JsonResponse
    {
        $result = $this->moduleService->updatedModule($request);
        return $this->successResponse($result, 'Module berhasil diperbarui.');
    }

    /** @throws Throwable */
    public function destroy(ModuleModel $module): JsonResponse
    {
        $this->moduleService->destroy($module->id);
        return $this->successResponse(null, 'Module berhasil dihapus.');
    }
}
