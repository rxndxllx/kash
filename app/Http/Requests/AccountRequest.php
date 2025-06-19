<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AccountType;
use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "search" => ["sometimes", "string", "max:50"],
            "currency" => ["sometimes", Rule::enum(Currency::class)],
            "type" => ["sometimes", Rule::enum(AccountType::class)],
        ];
    }
}
