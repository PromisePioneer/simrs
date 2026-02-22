<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicineBatchRequest extends FormRequest
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
            'medicine_id' => ['required'],
            'warehouse_id' => ['required'],
            'rack_id' => ['required'],
            'batch_number' => [Rule::requiredIf(function () {
                return $this->input('is_auto_batch') == false;
            })],
            'expired_date' => ['required', 'date', 'date_format:Y-m-d', 'after:today'],
            'stock_amount' => ['required'],
            'is_auto_batch' => ['required', 'in:true,false']
        ];
    }


    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Medis tidak boleh kosong',
            'rack_id.required' => 'Rak tidak boleh kosong',
            'batch_number.required' => 'No. Batch tidak boleh kosong',
            'is_auto_batch.required' => 'Auto Batch tidak boleh kosong',
            'expired_date.required' => 'Expired Date tidak boleh kosong',
            'stock_amount.required' => 'Stock Amount tidak boleh kosong'
        ];
    }
}
