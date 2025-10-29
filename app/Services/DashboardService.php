<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Enums\TrendType;
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
        $yearly_data = $this->generateYearlyData($stats, $user, $currency, $year);
        $monthly_data = $yearly_data->first(fn (Collection $item) => $item->get("month") === $month);

        return collect([
            "yearly_data" => $yearly_data,
            "monthly_data" => $monthly_data,
            "recent_transactions" => $user->transactions()
                ->whereCurrency($currency)
                ->orderByDesc("transacted_at")
                ->orderByDesc("id")
                ->paginate(10),
        ]);
    }

    private function generateYearlyData(Collection $data, User $user, Currency $currency, int $year): Collection
    {
        $indexed = $data->keyBy("month");
        $balance = 0;

        return collect()->times(12, function (int $month) use ($indexed, $currency, $year, $user, &$balance) {
            $stat = $indexed->get($month);

            /**
             * Set the previous year's last known balance
             * as the starting balance for the month of January.
             */
            if ($month === 1) {
                $balance = DashboardStats::lastKnownStats(
                    $user->id,
                    $currency,
                    $month,
                    $year
                )?->total_balance ?? 0;
            }

            /**
             * If the current month has no stats record, use the last known balance.
             */
            $previous_total_balance = $balance;
            $balance = $stat?->total_balance ?? $balance;

            $top_income_categories = $this->getTopCategories(
                $user,
                TransactionType::INCOME,
                $currency,
                $month,
                $year,
                $stat?->total_income ?? 0,
            );

            $top_expense_categories = $this->getTopCategories(
                $user,
                TransactionType::EXPENSE,
                $currency,
                $month,
                $year,
                $stat?->total_expense ?? 0,
            );

            return collect([
                "total_balance" => $balance,
                "total_expense" => $stat?->total_expense ?? 0,
                "total_income" => $stat?->total_income ?? 0,
                "currency" => $currency->details(),
                "month" => $month,
                "year" => $year,
                "cash_flow" => $stat?->cash_flow ?? 0,
                "top_incomes" => $top_income_categories,
                "top_expenses" => $top_expense_categories,
                "balance_insights" => $this->generateBalanceInsights($previous_total_balance, $balance),
            ]);
        });
    }

    private function getTopCategories(
        User $user,
        TransactionType $type,
        Currency $currency,
        int $month,
        int $year,
        float $total_amount
    ): Collection {
        $transactions = $user->transactions()
            ->with("category:id,title")
            ->select(["category_id", DB::raw("SUM(amount) as total")])
            ->whereType($type)
            ->whereCurrency($currency)
            ->whereMonth("transacted_at", $month)
            ->whereYear("transacted_at", $year)
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

    private function generateBalanceInsights(float $previous_balance, float $current_balance): Collection
    {
        $percentage = 0;
        $trend_type = TrendType::NO_ACTIVITY;
        $difference = $current_balance - $previous_balance;

        switch (true) {
            case isEpsilonZero($previous_balance) && $current_balance > 0:
                $percentage = 100;
                $trend_type = TrendType::NEW_POSITIVE;
                break;
            case isEpsilonZero($previous_balance) && $current_balance < 0:
                $percentage = -100;
                $trend_type = TrendType::NEW_NEGATIVE;
                break;
            case !isEpsilonZero($previous_balance) && !isEpsilonZero($difference):
                $percentage = computePercentage($difference, abs($previous_balance));
                $trend_type = $percentage > 0 ? TrendType::POSITIVE : TrendType::NEGATIVE;
                break;
        }

        return collect([
            "percentage" => $percentage,
            "trend_type" => $trend_type,
            "difference" => $difference,
        ]);
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
