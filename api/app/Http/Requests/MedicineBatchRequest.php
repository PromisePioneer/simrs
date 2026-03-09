<?php

namespace App\Http\Requests;

use App\Services\Master\Pharmachy\Medicine\Repository\MedicineBatchRepository;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineRepository;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicineBatchRequest extends FormRequest
{


    protected MedicineRepository $medicineRepository;

    public function __construct(array $query = [], array $request = [], array $attributes = [], array $cookies = [], array $files = [], array $server = [], $content = null)
    {
        parent::__construct($query, $request, $attributes, $cookies, $files, $server, $content);
        $this->medicineRepository = new MedicineRepository();
    }

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
        $medicine = $this->medicineRepository->findById($this->input('medicine_id'));


        return [
            'medicine_id' => ['required'],
            'warehouse_id' => ['required'],
            'rack_id' => ['required'],
            'batch_number' => [Rule::requiredIf(function () {
                return $this->input('is_auto_batch') == false;
            })],
            'expired_date' => ['required', 'date', 'date_format:Y-m-d', 'after:today'],
            'stock_amount' => ['required'],
            'is_auto_batch' => ['required', 'in:true,false'],
            'selling_price' => [Rule::requiredIf(function () use ($medicine) {
                return $medicine->is_for_sell === true;
            })]
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
