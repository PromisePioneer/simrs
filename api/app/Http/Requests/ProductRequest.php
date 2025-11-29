<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'sku' => ['required', Rule::unique('products', 'sku')->ignore($this->route('product'))],
            'name' => ['required'],
            'code' => ['required', Rule::unique('products', 'code')->ignore($this->route('product'))],
            'must_has_receipt' => ['nullable', 'boolean'],
            'type' => ['required', Rule::in(array_keys(Product::getTypes()))],
            'warehouse_id' => ['required', Rule::exists('product_warehouses', 'id')],
            'category_id' => ['required', Rule::exists('product_categories', 'id')],
            'rack_id' => ['required', Rule::exists('product_warehouses', 'id')],
            'is_for_sell' => ['nullable', 'boolean'],
            'expired_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'expired_notification_days' => ['nullable', 'numeric'],
            'stock_amount' => ['required', 'numeric'],
            'minimum_stock_amount' => ['nullable', 'numeric'],
            'reference_purchase_price' => ['nullable', 'numeric'],
        ];
    }
}
