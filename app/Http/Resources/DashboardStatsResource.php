<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "currency" => $this->currency,
            "month" => $this->month,
            "year" => $this->year,
            "total_balance" => $this->total_balance,
            "total_expense" => $this->total_expense,
            "total_income" => $this->total_income,
        ];
    }
}
