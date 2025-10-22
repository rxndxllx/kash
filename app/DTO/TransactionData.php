<?php

declare(strict_types=1);

namespace App\DTO;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Carbon;

class TransactionData
{
    public function __construct(
        public User $user,
        public Account $source_account,
        public ?Account $destination_account,
        public float $amount,
        public Carbon $transacted_at,
        public TransactionType $type,
        public ?int $category_id,
        public ?string $note,
        public float $transfer_fee = 0,
        public ?Transaction $old_transaction = null,
    ) {}
}
