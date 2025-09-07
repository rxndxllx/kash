<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AccountType;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
