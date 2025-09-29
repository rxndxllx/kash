<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DataAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "currency" => ["bail", "sometimes", Rule::enum(Currency::class)],
        ];
    }
}
