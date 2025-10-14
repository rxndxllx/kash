<?php

declare(strict_types=1);

namespace App\Services;

use App\DTO\CreateTransactionData;
use App\DTO\CreateTransactionResult;
use App\Enums\TransactionType;
use App\Jobs\RecalculateRunningBalances;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Transfer;
use App\Models\User;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function createExpense(CreateTransactionData $data)
    {
        DB::transaction(function () use ($data) {
            $result = $this->createTransaction(
                $data->user,
                $data->source_account,
                $data->amount,
                $data->transacted_at,
                $data->type,
                $data->note,
                $data->category_id,
            );

            $data->source_account->debit($data->amount);

            if (!$result->is_latest) {
                RecalculateRunningBalances::dispatch($result->transaction, $data->amount)->afterCommit();
            }
        });

    }

    public function createIncome(CreateTransactionData $data)
    {
        DB::transaction(function () use ($data) {
            $result = $this->createTransaction(
                $data->user,
                $data->source_account,
                $data->amount,
                $data->transacted_at,
                $data->type,
                $data->note,
                $data->category_id,
            );

            $data->source_account->credit($data->amount);

            if (!$result->is_latest) {
                RecalculateRunningBalances::dispatch($result->transaction, $data->amount)->afterCommit();
            }
        });
    }

    public function createTransfer(CreateTransactionData $data): void
    {
        DB::transaction(function () use ($data) {
            $transfer = Transfer::create([
                "from_account_id" => $data->source_account->id,
                "to_account_id" => $data->destination_account->id,
            ]);

            $this->createTransferDebit($data, $transfer);
            $this->createTransferCredit($data, $transfer);
        });
    }

    private function createTransferDebit(CreateTransactionData $data, Transfer $transfer): void
    {
        $from_account = $data->source_account;

        $debit_result = $this->createTransaction(
            $data->user,
            $from_account,
            $data->amount,
            $data->transacted_at,
            $data->type,
            $data->note,
            null,
            $transfer,
        );

        $delta = $data->amount + $data->transfer_fee;
        $from_account->debit($delta);

        $transfer_fee_details = [
            "user_id" => $data->user->id,
            "account_id" => $from_account->id,
            "amount" => $data->transfer_fee,
            "type" => TransactionType::EXPENSE,
            "transacted_at" => $data->transacted_at,
            "note" => $data->note,
            "running_balance" => $debit_result->transaction->running_balance - $data->transfer_fee,
            "transfer_id" => $transfer->id,
            "category_id" => Category::transferFee()->id,
        ];

        /**
         * If recalculation is needed, the job must complete first
         * before saving $transfer_fee, otherwise it will also be
         * included in the recalculation and debit the account twice.
         */
        if (!$debit_result->is_latest) {
            RecalculateRunningBalances::dispatch($debit_result->transaction, $delta)
                ->afterCommit()
                ->chain([
                    function () use ($data, $transfer_fee_details) {
                        if ($data->transfer_fee > 0) {
                            Transaction::create($transfer_fee_details);
                        }
                    },
                ]);
        } elseif ($data->transfer_fee > 0) {
            Transaction::create($transfer_fee_details);
        }
    }

    private function createTransferCredit(CreateTransactionData $data, Transfer $transfer): void
    {
        $to_account = $data->destination_account;

        $credit_result = $this->createTransaction(
            $data->user,
            $to_account,
            $data->amount,
            $data->transacted_at,
            TransactionType::TRANSFER,
            $data->note,
            null,
            $transfer,
        );

        $to_account->credit($data->amount);

        if (!$credit_result->is_latest) {
            RecalculateRunningBalances::dispatch($credit_result->transaction, $data->amount)->afterCommit();
        }
    }

    private function createTransaction(
        User $user,
        Account $account,
        float $amount,
        Carbon $transacted_at,
        TransactionType $type,
        ?string $note,
        ?int $category_id,
        ?Transfer $transfer = null,
    ): CreateTransactionResult {
        $latest = $account->isTransactionDateLatest($transacted_at);
        $is_debit = $type === TransactionType::EXPENSE || $transfer?->from_account_id === $account->id;
        $running_balance = $is_debit
            ? $account->current_balance - $amount
            : $account->current_balance + $amount;

        if (!$latest) {
            $previous_transaction = $account->getTransactionBeforeDatetime($transacted_at);
            $previous_running_balance = $previous_transaction?->running_balance ?? $account->initial_balance;
            $running_balance = $is_debit
                ? $previous_running_balance - $amount
                : $previous_running_balance + $amount;
        }

        $transaction = Transaction::create([
            "user_id" => $user->id,
            "account_id" => $account->id,
            "amount" => $amount,
            "type" => $type,
            "transacted_at" => $transacted_at,
            "note" => $note,
            "running_balance" => $running_balance,
            "transfer_id" => $transfer?->id,
            "category_id" => $category_id,
        ]);

        return new CreateTransactionResult($transaction, $latest);
    }

    public function create($data): void
    {
        match ($data->type) {
            TransactionType::EXPENSE => $this->createExpense($data),
            TransactionType::INCOME => $this->createIncome($data),
            TransactionType::TRANSFER => $this->createTransfer($data),
            default => throw new Exception("Unsupported transaction.")
        };
    }

    public function update(object $data, Transaction $transaction): void
    {
        /**
         * If any of these details are changed,
         * delete and recreate the transactions instead
         * of updating, because these values have major
         * side effects when changed.
         */
        if (
            $data->type !== $transaction->type
            || $data->amount !== $transaction->amount
            || $data->source_account !== $transaction->account_id
            || $data->transacted_at !== $transaction->transacted_at
            || $data->transfer_fee !== $transaction->transfer_fee
        ) {
            if ($transaction->type === TransactionType::TRANSFER) {
                $transaction->transfer->delete();
            } else {
                $transaction->delete();
            }

            $this->create($data);

            return;
        }

        /**
         * If the changes are minor, simply update the fields.
         */
        if (
            $data->note !== $transaction->note
            || $data->category_id !== $transaction->category_id
        ) {
            $transaction->update([
                "note" => $data->note,
                "category_id" => $data->category_id,
            ]);
        }
    }
}
