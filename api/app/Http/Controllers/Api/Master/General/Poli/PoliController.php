<?php

namespace App\Http\Controllers\Api\Master\General\Poli;

use App\Http\Controllers\Controller;
use App\Http\Requests\PoliRequest;
use App\Models\Poli;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PoliController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Poli::query();
        $perPage = $request->query('per_page', 20);
        $search = $request->query('search');
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $poli = $query->paginate($perPage);
        return response()->json($poli);
    }


    public function store(PoliRequest $request)
    {
        $data = $request->validated();
        $poli = Poli::create($data);
        return $this->successResponse($poli, 'Poli created successfully.');
    }


    public function show(Poli $poli)
    {
        return response()->json($poli);
    }


    public function update(PoliRequest $request, Poli $poli)
    {
        $data = $request->validated();
        $poli->update($data);
        return $this->successResponse($poli, 'Poli created successfully.');
    }


    public function destroy(Poli $poli)
    {
        $poli->delete();
        return $this->successResponse($poli, 'Poli deleted successfully.');
    }
}
