<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountCategoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return ['name' => ['required', 'string']];
    }
}
