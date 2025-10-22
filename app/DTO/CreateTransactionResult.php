<?php

declare(strict_types=1);

namespace App\DTO;

use App\Models\Transaction;

class CreateTransactionResult
{
    public function __construct(
        public Transaction $transaction,
        public bool $is_latest,
        public float $old_running_balance,
        public float $new_running_balance,
    ) {}

    /**
     * Computes the balance difference ("delta") caused by this transaction.
     *
     * The delta represents how much the subsequent transactions’ running balances
     * must be adjusted during a recalculation job.
     *
     * There are two main cases:
     *
     * 1. **New Transaction (Create):**
     *    - A new transaction is inserted, possibly in the middle of existing ones.
     *    - Its running balance is derived from the previous transaction’s balance
     *      (or the account’s initial balance if none).
     *    - The delta represents how much this new transaction shifts the
     *      balances of all later transactions.
     *
     * 2. **Updated Transaction:**
     *    - When an existing transaction changes (e.g., amount updated),
     *      the old record is deleted and a new one is created in its place.
     *    - The old transaction’s running balance is captured before deletion.
     *    - The delta is then computed as:
     *          new_running_balance - old_running_balance
     *      so only the *difference* between the old and new versions
     *      propagates to later transactions.
     *
     * Example:
     *
     * Initial balance: 10
     * A: -1 | running balance = 9
     * B: +1 | running balance = 10
     * C: -2 | running balance = 8
     *
     * Now, if B’s amount changes from **+1 → +2**:
     * - Old running balance (B old): 10
     * - New running balance (B new): 11
     * - Delta = 11 - 10 = +1 (NOT +2, use the difference, not the new amount)
     *
     * Resulting recalculation for C:
     * - Old C running balance: 8
     * - New C running balance: 8 + 1 = 9 ✅
     *
     * This ensures continuity of balances without double-counting or drift.
     */
    public function delta(): float
    {
        return $this->new_running_balance - $this->old_running_balance;
    }
}
