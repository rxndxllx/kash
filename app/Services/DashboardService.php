<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Models\DashboardStats;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
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
                "total_expense" => $stat?->total_expense ?? 0,
                "total_income" => $stat?->total_income ?? 0,
                "currency" => $stat?->currency ?? $inputs->currency,
                "year" => $stat?->year ?? $inputs->year,
            ];
        });
    }

    public function generateMonthlyData(?DashboardStats $data, ValidatedInput $inputs): Collection
    {
        return collect([
            "total_balance" => $data?->total_balance ?? 0,
            "total_expense" => $data?->total_expense ?? 0,
            "total_income" => $data?->total_income ?? 0,
            "currency" => $data?->currency ?? $inputs->currency,
            "month" => $data?->month ?? $inputs->month,
            "year" => $data?->year ?? $inputs->year,
            "cash_flow" => $data?->cash_flow ?? 0,
            "top_incomes" => $this->getTopCategories(
                TransactionType::INCOME,
                Currency::from($inputs->currency),
                (int) $inputs->month,
                $data?->total_income ?? 0,
            ),
            "top_expenses" => $this->getTopCategories(
                TransactionType::EXPENSE,
                Currency::from($inputs->currency),
                (int) $inputs->month,
                $data?->total_expense ?? 0,
            ),
        ]);

    }

    private function getTopCategories(
        TransactionType $type,
        Currency $currency,
        int $month,
        float $total_amount
    ): Collection {
        $user = auth()->user();

        $transactions = $user->transactions()
            ->with("category:id,title")
            ->select(["category_id", DB::raw("SUM(amount) as total")])
            ->whereType($type)
            ->whereCurrency($currency)
            ->whereMonth("transacted_at", $month)
            ->groupBy("category_id")
            ->orderByDesc("total")
            ->limit(3)
            ->get();

        $result = $transactions->map(function (Transaction $transaction) use ($total_amount) {
            return [
                "category" => $transaction->category->title,
                "total_amount" => $transaction->total,
                "percentage" => $this->computePercentage($transaction->total, $total_amount, 1),
            ];
        });

        return $result;
    }

    private function computePercentage(float $part, float $whole, int $precision = 0): float
    {
        return round(($part / $whole) * 100, $precision);
    }
}
