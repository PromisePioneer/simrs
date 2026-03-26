<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // plan_id diambil dari route parameter {plan}
        ];
    }
}
