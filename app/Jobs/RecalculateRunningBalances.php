<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Collection;

class RecalculateRunningBalances implements ShouldQueue
{
    use Queueable;

    private Transaction $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    public function middleware(): array
    {
        return [new WithoutOverlapping($this->transaction->account_id)];
    }

    /**
     * @todo
     * 1. Fire an event/broadcast to the frontend to signal refresh
     */
    public function handle(): void
    {
        $transaction = $this->transaction;
        $running_balance = $transaction->running_balance;

        Transaction::whereAccountId($transaction->account_id)
            ->where(fn (Builder $q) => $q
                ->where("transacted_at", ">", $transaction->transacted_at)
                ->orWhere(fn (Builder $q2) => $q2
                    ->where("transacted_at", $transaction->transacted_at)
                    ->where("id", ">", $transaction->id)
                ))
            ->orderBy("transacted_at")
            ->orderBy("id")
            ->chunkById(100, fn (Collection $chunk) => $chunk->each(
                function (Transaction $sub) use (&$running_balance) {
                    $running_balance = $sub->isDebit()
                        ? $running_balance - $sub->amount
                        : $running_balance + $sub->amount;

                    $sub->running_balance = $running_balance;
                    $sub->save();
                }
            ));

        $transaction->account->current_balance = $running_balance;
        $transaction->account->save();
    }
}
