<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Queue\Service\QueueService;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function __construct(
        protected QueueService $queueService
    )
    {
    }


    public function index(Request $request)
    {
        return response()->json($this->queueService->getQueues(request: $request));
    }


    public function store()
    {

    }


    public function show()
    {

    }


    public function update()
    {

    }


    public function destroy()
    {

    }
}
