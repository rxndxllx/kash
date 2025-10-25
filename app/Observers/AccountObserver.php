<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Account;
use App\Models\DashboardStats;
use App\Models\Transaction;
use App\Services\DashboardService;
use Illuminate\Database\Eloquent\Collection;

class AccountObserver
{
    private DashboardService $dashboard_service;

    public function __construct(DashboardService $dashboard_service)
    {
        $this->dashboard_service = $dashboard_service;
    }

    public function created(Account $account): void
    {
        /**
         * When creating a new Dashboard Stat, use the last stat's total balance
         * to keep the currency's total balance rolling every month.
         */
        $stats = DashboardStats::findOrCreateWithLastKnownBalance(
            $account->user_id,
            $account->currency,
            $account->created_at->year,
            $account->created_at->month,
        );

        $stats->incrementBalance($account->initial_balance);
    }

    /**
     * @todo Add the side effects of updating Account details (e.g. balance, currency).
     */
    public function updating(Account $account): void
    {
        //
    }

    public function deleting(Account $account): void
    {
        /**
         * Triggers the delete model event for each transaction instead of mass deletion or cascade deletes.
         * This ensures that all transaction reversals are executed properly.
         */
        $account->transactions()
            ->chunk(100, fn (Collection $chunk) => $chunk
                ->each(fn (Transaction $transaction) => $transaction->delete())
            );

        /**
         * Set the transfer account references to null instead of deleting.
         * This ensures that the pair account does not lose its own transfer record.
         */
        $account->debitTransfers()->update([
            "from_account_id" => null,
        ]);

        $account->creditTransfers()->update([
            "to_account_id" => null,
        ]);

        $stats = DashboardStats::where("user_id", $account->user_id)
            ->where("currency", $account->currency)
            ->where("year", $account->created_at->year)
            ->where("month", $account->created_at->month)
            ->firstOrFail();

        $stats->decrementBalance($account->initial_balance);

        $this->dashboard_service->forwardRecalculateMonthlyTotalBalance(
            $stats->user_id,
            $stats->currency,
            $stats->year,
            $stats->month,
            -($account->initial_balance)
        );
    }
}
