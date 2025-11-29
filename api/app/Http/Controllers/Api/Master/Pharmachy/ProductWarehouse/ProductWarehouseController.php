<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\ProductWarehouse;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductWarehouseRequest;
use App\Models\ProductWarehouse;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductWarehouseController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $productWarehouse = ProductWarehouse::paginate(20);
        return response()->json($productWarehouse);
    }


    public function store(ProductWarehouseRequest $request)
    {
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? session('active_tenant_id');
        $productWarehouse = ProductWarehouse::create($data);
        return $this->successResponse($productWarehouse, 'Warehouse successfully created.');
    }

    public function show(ProductWarehouse $productWarehouse)
    {
        return response()->json($productWarehouse);
    }

    public function update(ProductWarehouseRequest $request, ProductWarehouse $productWarehouse)
    {
        $productWarehouse->update($request->validated());
        return $this->successResponse($productWarehouse, 'Warehouse successfully updated.');
    }


    public function destroy(ProductWarehouse $productWarehouse)
    {
        $productWarehouse->delete();
        return $this->successResponse($productWarehouse, 'Warehouse successfully deleted.');
    }
}
