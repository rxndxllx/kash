<?php

declare(strict_types=1);

namespace App\Models;

// use App\Enums\TransactionType;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model
{
    protected $fillable = [
        "user_id",
        "parent_id",
        "title",
        "key",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class);
    }

    /**
     * Category of auto-generated transfer fee for transfer transactions
     */
    public static function transferFee(): self
    {
        return self::where("key", "transfer_fee")->first();
    }

    #[Scope]
    protected function generic(Builder $query): void
    {
        $query->whereNull("user_id");
    }
}
