<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InpatientDailyMedicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'medicine_id' => ['required', 'exists:medicines,id'],
            'dosage' => ['required', 'string', 'max:100'],
            'frequency' => ['required', 'string', 'max:100'],
            'route' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1'],
            'given_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'medicine_id.required' => 'Obat wajib dipilih.',
            'medicine_id.exists' => 'Obat yang dipilih tidak ditemukan.',
            'dosage.required' => 'Dosis wajib diisi.',
            'frequency.required' => 'Frekuensi wajib diisi.',
            'route.required' => 'Rute pemberian wajib diisi.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka bulat.',
            'quantity.min' => 'Jumlah minimal 1.',
            'given_date.required' => 'Tanggal pemberian wajib diisi.',
            'given_date.date' => 'Format tanggal pemberian tidak valid.',
        ];
    }
}
