<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Country;
use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ValidateOnboardingStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            "step" => $this->step,
        ]);
    }

    public function rules(): array
    {
        return [
            "gender" => ["bail", "required_if:step,1", "in:male,female,other"],
            "birthdate" => ["bail", "required_if:step,1", "date", Rule::date()->format("Y-m-d")],
            "country" => ["bail", "required_if:step,1", Rule::enum(Country::class)],
            "base_currency" => ["bail", "required_if:step,2", Rule::enum(Currency::class)],
        ];
    }
}
