<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Transfer;
use App\Models\User;

class TransactionService
{
    public function createExpense(
        User $user,
        Account $account,
        int $category_id,
        float $amount,
        ?string $note,
    ) {
        $account->debit($amount);

        Transaction::create([
            "user_id" => $user->id,
            "account_id" => $account->id,
            "category_id" => $category_id,
            "amount" => $amount,
            "type" => TransactionType::EXPENSE,
            "transacted_at" => now(),
            "note" => $note,
            "running_balance" => $account->current_balance,
        ]);
    }

    public function createIncome(
        User $user,
        Account $account,
        int $category_id,
        float $amount,
        ?string $note,
    ) {
        $account->credit($amount);

        Transaction::create([
            "user_id" => $user->id,
            "account_id" => $account->id,
            "category_id" => $category_id,
            "amount" => $amount,
            "type" => TransactionType::INCOME,
            "transacted_at" => now(),
            "note" => $note,
            "running_balance" => $account->current_balance,
        ]);
    }

    public function createTransfer(
        User $user,
        Account $from_account,
        Account $to_account,
        float $amount,
        ?string $note,
        float $transfer_fee,
    ) {
        $from_account->debit($amount);
        $to_account->credit($amount);

        $transfer = Transfer::create([
            "from_account_id" => $from_account->id,
            "to_account_id" => $to_account->id,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "account_id" => $from_account->id,
            "amount" => $amount,
            "type" => TransactionType::TRANSFER,
            "transacted_at" => now(),
            "note" => $note,
            "running_balance" => $from_account->current_balance,
            "transfer_id" => $transfer->id,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "account_id" => $to_account->id,
            "amount" => $amount,
            "type" => TransactionType::TRANSFER,
            "transacted_at" => now(),
            "note" => $note,
            "running_balance" => $to_account->current_balance,
            "transfer_id" => $transfer->id,
        ]);

        if ($transfer_fee > 0) {
            $from_account->debit($transfer_fee);

            $this->createExpense(
                $user,
                $from_account,
                Category::transferFee()->id,
                $transfer_fee,
                $note
            );
        }
    }

    public function updateTransaction(
        Transaction $transaction,
        float $amount,
        ?string $note = null,
        ?int $category_id = null,
    ) {
        if (abs($transaction->amount - $amount) > 0.01) {
            $this->updateTransactionAmount($transaction, $amount);
        }

        $transaction->category_id = $category_id;
        $transaction->note = $note;
        $transaction->save();
    }

    private function updateTransactionAmount(Transaction $transaction, float $new_amount)
    {
        $prev = $transaction->getPreviousTransaction();
        $prev_running_balance = $prev ? $prev->running_balance : $transaction->account->initial_balance;

        $transaction->amount = $new_amount;

        $transaction->running_balance = $transaction->isDebit()
            ? $prev_running_balance - $transaction->amount
            : $prev_running_balance + $transaction->amount;

        $transaction->save();
    }
}
