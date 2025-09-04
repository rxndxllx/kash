<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DashboardStatsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            "currency" => $this->currency ?? Currency::USD->value,
            "year" => $this->year ?? now()->year,
            "month" => $this->month ?? now()->month,
        ]);
    }

    public function rules(): array
    {
        return [
            "currency" => ["required", Rule::enum(Currency::class)],
            "month" => ["required", "numeric", "min:1", "max:12"],
            "year" => ["required", "numeric", "min:2025", "digits:4"],
        ];
    }
}
