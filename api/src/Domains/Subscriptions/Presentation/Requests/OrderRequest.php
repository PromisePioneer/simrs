<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan_id' => ['required', 'uuid', 'exists:plans,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'plan_id.required' => 'Plan harus dipilih.',
            'plan_id.uuid'     => 'Plan ID tidak valid.',
            'plan_id.exists'   => 'Plan tidak ditemukan.',
        ];
    }
}
