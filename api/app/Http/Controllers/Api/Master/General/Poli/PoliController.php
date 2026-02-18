<?php

namespace App\Http\Controllers\Api\Master\General\Poli;

use App\Http\Controllers\Controller;
use App\Http\Requests\PoliRequest;
use App\Models\Poli;
use App\Services\Master\General\Poli\Service\PoliService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PoliController extends Controller
{

    use ApiResponse;

    protected PoliService $poliService;

    public function __construct()
    {
        $this->poliService = new PoliService();
    }

    public function index(Request $request)
    {

        $this->authorize('view', Poli::class);

        $poli = $this->poliService->getPoliData(request: $request);
        return response()->json($poli);
    }


    public function store(PoliRequest $request)
    {
        $this->authorize('create', Poli::class);
        $data = $this->poliService->store($request);
        return $this->successResponse(data: $data, message: 'Poli created successfully.');
    }


    public function show(Poli $poli)
    {
        $this->authorize('view', $poli);
        return response()->json($poli);
    }


    public function update(PoliRequest $request, Poli $poli)
    {
        $this->authorize('update', $poli);
        $data = $this->poliService->update(request: $request, poli: $poli);
        return $this->successResponse(data: $data, message: 'Poli created successfully.');
    }


    public function destroy(Poli $poli)
    {
        $this->authorize('delete', $poli);
        $this->poliService->destroy($poli);
        return $this->successResponse(message: 'Poli deleted successfully.');
    }
}
