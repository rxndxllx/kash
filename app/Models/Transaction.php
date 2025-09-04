<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Currency;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        "account_id",
        "amount",
        "category_id",
        "note",
        "running_balance",
        "transacted_at",
        "type",
        "user_id",
        "transfer_id",
    ];

    protected function casts(): array
    {
        return [
            "amount" => "float",
            "running_balance" => "float",
            "type" => TransactionType::class,
            "transacted_at" => "datetime",
        ];
    }

    protected static function booted(): void
    {
        static::created(function (self $transaction) {
            $stats = DashboardStats::where(
                [
                    "currency" => $transaction->currency,
                    "month" => $transaction->transacted_at->month,
                    "year" => $transaction->transacted_at->year,
                ]
            );

            switch ($transaction->type) {
                case TransactionType::INCOME:
                    $stats->total_balance += $transaction->amount;
                    $stats->total_income += $transaction->amount;
                    break;

                case TransactionType::EXPENSE:
                    $stats->total_balance -= $transaction->amount;
                    $stats->total_expense += $transaction->amount;
                    break;
            }

            $stats->save();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transferDetails(): BelongsTo
    {
        return $this->belongsTo(Transfer::class, "transfer_id", "id");
    }

    #[Scope]
    protected function whereCurrency(Builder $query, Currency $currency): void
    {
        $query->whereRelation("account", "currency", $currency);
    }

    public function currency(): Attribute
    {
        return new Attribute(fn () => $this->account->currency);
    }

    public function isTransferDebit(): bool
    {
        return $this->type === TransactionType::TRANSFER && $this->transferDetails->from_account_id === $this->account_id;
    }

    public function isTransferCredit(): bool
    {
        return $this->type === TransactionType::TRANSFER && !$this->isTransferDebit();
    }

    public function isDebit(): bool
    {
        return $this->type === TransactionType::TRANSFER
            ? $this->isTransferDebit()
            : $this->type === TransactionType::EXPENSE;
    }

    public function isCredit(): bool
    {
        return !$this->isDebit();
    }

    public function transferPair(): ?self
    {
        return $this->isTransferDebit()
            ? $this->transferDetails->creditTransaction()
            : $this->transferDetails?->debitTransaction();
    }

    public function getPreviousTransaction(): ?self
    {
        return self::whereAccountId($this->account_id)
            ->where(fn (Builder $q) => $q
                ->where("transacted_at", "<", $this->transacted_at)
                ->orWhere(fn (Builder $q2) => $q2
                    ->where("transacted_at", $this->transacted_at)
                    ->where("id", "<", $this->id)
                ))
            ->orderByDesc("transacted_at")
            ->orderByDesc("id")
            ->first();
    }
}
