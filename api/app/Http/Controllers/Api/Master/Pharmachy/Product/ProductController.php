<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Services\Master\Pharmachy\Product\Service\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;


    private ProductService $productService;

    public function __construct()
    {
        $this->productService = new ProductService();
    }

    public function index(Request $request)
    {
        $this->authorize('view', Product::class);
        $products = $this->productService->getProducts($request);
        return response()->json($products);
    }


    public function store(ProductRequest $request)
    {
        $this->authorize('create', Product::class);
        $product = $this->productService->store($request);
        return $this->successResponse($product, 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);
        $product->load('warehouse', 'category', 'rack');
        return response()->json($product);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);
        $this->productService->update($request, $product->id);
        return $this->successResponse($product, 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $this->productService->destroy($product->id);
        return $this->successResponse($product, 'Product deleted successfully.');
    }
}
