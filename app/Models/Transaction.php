<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        "user_id",
        "account_id",
        "category_id",
        "amount",
        "type",
        "transacted_at",
        "note",
    ];

    protected function casts(): array
    {
        return [
            "amount" => "float",
            "type" => TransactionType::class,
            "transacted_at" => "datetime",
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
