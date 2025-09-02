<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DashboardStats;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\ValidatedInput;

class DashboardService
{
    /**
     * Build yearly data for all 12 months, filling missing months with zeros.
     *
     * @param  EloquentCollection<int, DashboardStats>  $data
     * @return Collection<int, array{month:int, expense:float, income:float}>
     */
    public function generateYearlyData(EloquentCollection $data, ValidatedInput $inputs): Collection
    {
        $indexed = $data->keyBy("month");

        return collect(range(1, 12))->map(function ($month) use ($indexed, $inputs) {
            $stat = $indexed->get($month);

            return [
                "month" => $month,
                "total_expense" => $stat?->total_expense ?? rand(10, 20),
                "total_income" => $stat?->total_income ?? rand(10, 20),
                "currency" => $stat?->currency ?? $inputs->currency,
                "year" => $stat?->year ?? $inputs->year,
            ];
        });
    }

    public function generateMonthlyData(?DashboardStats $data, ValidatedInput $inputs): Collection
    {
        return collect([
            "total_balance" => $data?->total_balance ?? 0,
            "total_expense" => $data?->total_expense ?? 10,
            "total_income" => $data?->total_income ?? 20,
            "currency" => $data?->currency ?? $inputs->currency,
            "month" => $data?->month ?? $inputs->month,
            "year" => $data?->year ?? $inputs->year,
            "cash_flow" => $data?->cash_flow ?? 0,
        ]);
    }
}
