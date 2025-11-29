<?php

namespace App\Http\Controllers\Api\Master\General\Module;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModuleRequest;
use App\Models\Module;
use App\Services\Master\General\Modules\Service\ModuleService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Throwable;

class ModuleController extends Controller
{

    use ApiResponse;

    protected ModuleService $moduleService;

    public function __construct()
    {
        $this->moduleService = new ModuleService();
    }

    public function index()
    {
        $data = $this->moduleService->getModules();
        return response()->json($data);
    }


    public function data(Request $request)
    {
        return response()->json($this->moduleService->getPaginatedModules($request));
    }


    /**
     * @throws Throwable
     */
    public function store(ModuleRequest $request)
    {
        $modules = $this->moduleService->store($request);
        return $this->successResponse($modules, 'Module created successfully.');
    }


    public function show(Module $module)
    {
        $module->load('permissions');
        return response()->json($module);
    }

    /**
     * @throws Throwable
     */
    public function update(ModuleRequest $request, Module $module)
    {
        $modules = $this->moduleService->update($request, $module);
        return $this->successResponse($modules, 'Module updated successfully.');
    }


    /**
     * @throws Throwable
     */
    public function destroy(Module $module)
    {
        $this->moduleService->destroy($module);
    }
}
