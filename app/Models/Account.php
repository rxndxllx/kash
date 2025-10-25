<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AccountType;
use App\Enums\Currency;
use App\Observers\AccountObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

#[ObservedBy([AccountObserver::class])]
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
        $this->decrement("current_balance", $amount);
    }

    public function credit(float $amount): void
    {
        $this->increment("current_balance", $amount);
    }

    /**
     * Checks if this account has transactions that are dated after $transacted_at.
     */
    public function isLatestTransactionDate(Carbon $transacted_at, ?int $id = null): bool
    {
        return !$this->transactions()
            ->where(fn (Builder $query) => $query
                ->where("transacted_at", ">", $transacted_at)
                ->when(!is_null($id), fn ($query) => $query
                    ->orWhere(fn (Builder $query) => $query
                        ->where("transacted_at", $transacted_at)
                        ->where("id", ">", $id)
                    )
                )
            )
            ->exists();
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
