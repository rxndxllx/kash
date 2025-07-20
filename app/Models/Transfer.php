<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
