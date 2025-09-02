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

    public function rules(): array
    {
        return [
            "currency" => ["sometimes", Rule::enum(Currency::class)],
            "month" => ["sometimes", "numeric", "min:1", "max:12"],
            "year" => ["sometimes", "numeric", "min:2025", "digits:4"],
        ];
    }
}
