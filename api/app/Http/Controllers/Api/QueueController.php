<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Services\Queue\Service\QueueService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected QueueService $queueService
    )
    {
    }


    public function index(Request $request)
    {
        $data = $this->queueService->getQueues(request: $request);
        return response()->json($data);
    }


    public function store(Request $request): JsonResponse
    {
        $data = $this->queueService->store(request: $request);
        return response()->json($data);
    }


    public function show(Queue $queue): JsonResponse
    {
        return response()->json($queue);
    }


    public function update(Request $request, Queue $queue): JsonResponse
    {
        $data = $this->queueService->update(request: $request, queue: $queue);
        return response()->json($data);
    }


    public function destroy(Queue $queue): JsonResponse
    {
        $data = $this->queueService->destroy($queue);
        return response()->json($data);
    }


    public function startDiagnose(Queue $queue)
    {
        $this->queueService->startDiagnose($queue->id);
        return $this->successResponse(message: 'Diagnose started successfully.');
    }
}
