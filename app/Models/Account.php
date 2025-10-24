<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AccountType;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "type",
        "current_balance",
        "initial_balance",
        "user_id",
        "currency",
    ];

    protected function casts(): array
    {
        return [
            "type" => AccountType::class,
            "currency" => Currency::class,
            "current_balance" => "float",
            "initial_balance" => "float",
        ];
    }

    /**
     * @todo Add the side effects of updating Account details (e.g. balance, currency).
     */
    protected static function booted(): void
    {
        static::created(function (self $account) {
            /**
             * @todo Use the previous month's final running balance when creating a new stat record.
             */
            $stats = DashboardStats::firstOrNew(
                [
                    "user_id" => $account->user_id,
                    "currency" => $account->currency,
                    "month" => now()->month,
                    "year" => now()->year,
                ]
            );

            $stats->total_balance += $account->initial_balance;
            $stats->save();
        });

        static::deleting(function (self $account) {
            /**
             * Triggers the delete model event for each transaction instead of mass deletion or cascade deletes.
             * This ensures that all transaction reversals are executed properly.
             */
            $account->transactions()->each(fn (Transaction $transaction) => $transaction->delete());

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

            DashboardStats::where("user_id", $account->user_id)
                ->where("currency", $account->currency)
                ->whereRaw(
                    "(year > ? OR (year = ? AND month >= ?))",
                    [$account->created_at->year, $account->created_at->year, $account->created_at->month]
                )
                ->update([
                    "total_balance" => DB::raw("total_balance - ({$account->initial_balance})"),
                ]);
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function debitTransfers(): HasMany
    {
        return $this->hasMany(Transfer::class, "from_account_id");
    }

    public function creditTransfers(): HasMany
    {
        return $this->hasMany(Transfer::class, "to_account_id");
    }

    public function debit(float $amount): void
    {
        $this->current_balance -= $amount;
        $this->save();
    }

    public function credit(float $amount): void
    {
        $this->current_balance += $amount;
        $this->save();
    }

    public function isTransactionDateLatest(Carbon $transacted_at): bool
    {
        return !$this->transactions()->where("transacted_at", ">", $transacted_at)->exists();
    }

    public function getTransactionBeforeDatetime(Carbon $transacted_at): ?Transaction
    {
        return $this->transactions()
            ->where("transacted_at", "<", $transacted_at)
            ->orderByDesc("transacted_at")
            ->orderByDesc("id")
            ->first();
    }

    public function getLatestTransaction(): ?Transaction
    {
        return $this->transactions()
            ->orderByDesc("transacted_at")
            ->orderByDesc("id")
            ->first();
    }
}
