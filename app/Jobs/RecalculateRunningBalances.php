<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\DB;

class RecalculateRunningBalances implements ShouldQueue
{
    use Queueable;

    private Transaction $transaction;

    private float $delta;

    public function __construct(Transaction $transaction, float $delta)
    {
        $this->transaction = $transaction;
        $this->delta = $delta;
    }

    public function middleware(): array
    {
        return [new WithoutOverlapping($this->transaction->account_id)];
    }

    public function handle(): void
    {
        $transaction = $this->transaction;

        Transaction::whereAccountId($transaction->account_id)
            ->where(fn (Builder $q) => $q
                ->where("transacted_at", ">", $transaction->transacted_at)
                ->orWhere(fn (Builder $q2) => $q2
                    ->where("transacted_at", $transaction->transacted_at)
                    ->where("id", ">", $transaction->id)
                ))
            ->update([
                "running_balance" => DB::raw("running_balance + ({$this->delta})"),
            ]);
    }
}
