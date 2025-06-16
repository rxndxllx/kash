<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AccountType;
use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateAccountRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:50"],
            "currency" => ["required", Rule::enum(Currency::class)],
            "type" => ["required", Rule::enum(AccountType::class)],
            "balance" => ["required", "numeric", "gte:0"],
        ];
    }
}
