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
        $max_year = now()->year;
        $min_year = now()->subYear(5)->year;

        return [
            "currency" => ["required", Rule::enum(Currency::class)],
            "month" => ["required", "numeric", "min:1", "max:12"],
            "year" => ["required", "numeric", "min:$min_year", "max:$max_year", "digits:4"],
        ];
    }
}
