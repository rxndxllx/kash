<?php

declare(strict_types=1);

namespace App\DTO;

use App\Models\Transaction;

class CreateTransactionResult
{
    public function __construct(
        public Transaction $transaction,
        public bool $is_latest
    ) {}
}
