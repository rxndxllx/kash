<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Country;
use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteOnboardingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "gender" => ["bail", "required", "in:male,female,other"],
            "birthdate" => ["bail", "required", "date", Rule::date()->format("Y-m-d")],
            "country" => ["bail", "required", Rule::enum(Country::class)],
            "base_currency" => ["bail", "required", Rule::enum(Currency::class)],
        ];
    }
}
