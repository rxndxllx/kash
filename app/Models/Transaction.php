<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Builder;
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
