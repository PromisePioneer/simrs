<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductComboSourceController extends Controller
{
    public function getAllProducts(Request $request)
    {
        $search = $request->query('search');
        $data = Product::query();
        if ($search) {
            $data->where('name', 'like', '%' . $search . '%')
                ->orWhere('code', 'like', '%' . $search . '%');
        }
        $data = $data->orderBy('name')->get(['id', 'name', 'code']);
        return response()->json($data);
    }


    public function getProductByExpiredStatus(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Product::query();

        if ($status === 'expired') {
            $query->where('expired_date', '<=', now());
        } elseif ($status === 'active') {
            $query->where('expired_date', '>', now());
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('name')->get(['id', 'code', 'name', 'expired_date']);
        return response()->json($products);
    }
}
