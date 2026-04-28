<?php

declare(strict_types=1);

namespace Domains\Shared\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseCrudController extends Controller
{
    use ApiResponse;

    protected string $resourceClass;
    protected ?string $policyClass = null;
    protected ?string $modelClass = null;


    public function __construct(
        protected readonly mixed $service,
    )
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {

        if ($this->policyClass) {
            $this->authorize('view', $this->modelClass);
        }
        /**
         * @var class-string<JsonResource> $resourceClass
         */
        $result = $this->service->getAll($request);
        $resourceClass = $this->resourceClass;
        return $resourceClass::collection($result);
    }

    public function show(string $id): JsonResponse
    {
        if ($this->policyClass) {
            $this->authorize('view', $this->modelClass);
        }
        $result = $this->service->findById($id);
        return response()->json(new $this->resourceClass($result));
    }

    public function destroy(string $id): JsonResponse
    {
        if ($this->policyClass) {
            $this->authorize('delete', $this->modelClass);
        }
        $this->service->delete($id);
        return $this->successResponse(['message' => 'Data berhasil dihapus.']);
    }
}
