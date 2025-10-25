<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\TransferObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy([TransferObserver::class])]
class Transfer extends Model
{
    protected $fillable = [
        "from_account_id",
        "to_account_id",
    ];

    public function fromAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, "from_account_id", "id");
    }

    public function toAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, "to_account_id", "id");
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function debitTransaction(): ?Transaction
    {
        return $this->transactions()->whereAccountId($this->from_account_id)->first();
    }

    public function creditTransaction(): ?Transaction
    {
        return $this->transactions()->whereAccountId($this->to_account_id)->first();
    }

    public function feeTransaction(): ?Transaction
    {
        return $this->transactions()->whereCategoryId(Category::transferFee()->id)->first();
    }
}
