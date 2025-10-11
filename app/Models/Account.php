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

    protected static function booted(): void
    {
        static::created(function (self $account) {
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
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
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
