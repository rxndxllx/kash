<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Models\DashboardStats;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Generate dashboard data for a user, including yearly stats, monthly stats, and recent transactions.
     *
     * @return Collection{
     *     yearly_data: Collection,
     *     monthly_data: Collection,
     *     recent_transactions: Collection<int, Transaction>
     * }
     */
    public function generateDashboardData(User $user, Currency $currency, int $year, int $month): Collection
    {
        $stats = $user->dashboardStats()->where("year", $year)->where("currency", $currency)->get();
        $monthly_stats = $stats->firstWhere("month", $month);

        return collect([
            "yearly_data" => $this->generateYearlyData($stats, $currency, $year),
            "monthly_data" => $this->generateMonthlyData($monthly_stats, $currency, $month, $year, $user),
            "recent_transactions" => $user->transactions()
                ->whereCurrency($currency)
                ->orderByDesc("transacted_at")
                ->orderByDesc("id")
                ->paginate(10),
        ]);
    }

    /**
     * Build yearly data for all 12 months, filling missing months with zeros.
     */
    private function generateYearlyData(Collection $data, Currency $currency, int $year): Collection
    {
        $indexed = $data->keyBy("month");

        return collect()->times(12, function (int $month) use ($indexed, $currency, $year) {
            $stat = $indexed->get($month);

            return [
                "month" => $month,
                "total_expense" => $stat?->total_expense ?? 0,
                "total_income" => $stat?->total_income ?? 0,
                "currency" => $stat?->currency ?? $currency,
                "year" => $stat?->year ?? $year,
            ];
        });
    }

    /**
     * Build monthly data for the requested month with default values.
     */
    private function generateMonthlyData(
        ?DashboardStats $data,
        Currency $currency,
        int $month,
        int $year,
        User $user
    ): Collection {
        $top_income_categories = $this->getTopCategories(
            $user,
            TransactionType::INCOME,
            $currency,
            $month,
            $data?->total_income ?? 0,
        );

        $top_expense_categories = $this->getTopCategories(
            $user,
            TransactionType::EXPENSE,
            $currency,
            $month,
            $data?->total_expense ?? 0,
        );

        return collect([
            "total_balance" => $data?->total_balance ?? 0,
            "total_expense" => $data?->total_expense ?? 0,
            "total_income" => $data?->total_income ?? 0,
            "currency" => $data?->currency ?? $currency,
            "month" => $data?->month ?? $month,
            "year" => $data?->year ?? $year,
            "cash_flow" => $data?->cash_flow ?? 0,
            "top_incomes" => $top_income_categories,
            "top_expenses" => $top_expense_categories,
        ]);
    }

    private function getTopCategories(
        User $user,
        TransactionType $type,
        Currency $currency,
        int $month,
        float $total_amount
    ): Collection {
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

        $result = $transactions->map(fn (Transaction $transaction) => [
            "category" => $transaction->category->title,
            "total_amount" => $transaction->total,
            "percentage" => computePercentage($transaction->total, $total_amount, 1),
        ]);

        return $result;
    }

    public function forwardRecalculateMonthlyTotalBalance(
        int $user_id,
        Currency $currency,
        int $year,
        int $month,
        float $delta
    ): void {
        DashboardStats::where("user_id", $user_id)
            ->where("currency", $currency)
            ->afterMonth($month, $year)
            ->update([
                "total_balance" => DB::raw("total_balance + ({$delta})"),
            ]);
    }
}
