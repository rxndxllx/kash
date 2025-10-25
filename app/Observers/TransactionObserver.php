<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\TransactionType;
use App\Models\DashboardStats;
use App\Models\Transaction;
use App\Services\DashboardService;

class TransactionObserver
{
    private DashboardService $dashboard_service;

    public function __construct(DashboardService $dashboard_service)
    {
        $this->dashboard_service = $dashboard_service;
    }

    public function created(Transaction $transaction): void
    {
        if ($transaction->type === TransactionType::TRANSFER) {
            return;
        }

        $stats = DashboardStats::findOrCreateWithLastKnownBalance(
            $transaction->user_id,
            $transaction->currency,
            $transaction->transacted_at->year,
            $transaction->transacted_at->month,
        );

        $delta = 0;

        switch ($transaction->type) {
            case TransactionType::INCOME:
                $stats->applyIncome($transaction->amount);
                $delta = $transaction->amount;
                break;

            case TransactionType::EXPENSE:
                $stats->applyExpense($transaction->amount);
                $delta = -($transaction->amount);
                break;
        }

        $this->dashboard_service->forwardRecalculateMonthlyTotalBalance(
            $stats->user_id,
            $stats->currency,
            $stats->year,
            $stats->month,
            $delta,
        );
    }

    public function deleting(Transaction $transaction): void
    {
        switch ($transaction->type) {
            case TransactionType::INCOME:
                $transaction->account->debit($transaction->amount);
                break;

            case TransactionType::EXPENSE:
                $transaction->account->credit($transaction->amount);
                break;

            case TransactionType::TRANSFER:
                if ($transaction->isDebit()) {
                    $transaction->account->credit($transaction->amount);
                } else {
                    $transaction->account->debit($transaction->amount);
                }

                return;
        }

        $stats = DashboardStats::where("user_id", $transaction->user_id)
            ->where("currency", $transaction->currency)
            ->where("year", $transaction->transacted_at->year)
            ->where("month", $transaction->transacted_at->month)
            ->firstOrFail();

        $delta = 0;

        switch ($transaction->type) {
            case TransactionType::INCOME:
                $stats->reverseIncome($transaction->amount);
                $delta = -($transaction->amount);
                break;

            case TransactionType::EXPENSE:
                $stats->reverseExpense($transaction->amount);
                $delta = $transaction->amount;
                break;
        }

        $this->dashboard_service->forwardRecalculateMonthlyTotalBalance(
            $stats->user_id,
            $stats->currency,
            $stats->year,
            $stats->month,
            $delta,
        );
    }
}
