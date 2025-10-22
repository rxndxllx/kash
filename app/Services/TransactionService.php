<?php

declare(strict_types=1);

namespace App\Services;

use App\DTO\CreateTransactionResult;
use App\DTO\TransactionData;
use App\Enums\TransactionType;
use App\Jobs\RecalculateRunningBalances;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Transfer;
use Exception;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function createExpense(TransactionData $data)
    {
        DB::transaction(function () use ($data) {
            $result = $this->createTransaction($data);

            $data->source_account->debit($data->amount);

            if (!$result->is_latest) {
                RecalculateRunningBalances::dispatch($result->transaction, $result->delta())->afterCommit();
            }
        });
    }

    public function createIncome(TransactionData $data)
    {
        DB::transaction(function () use ($data) {
            $result = $this->createTransaction($data);

            $data->source_account->credit($data->amount);

            if (!$result->is_latest) {
                RecalculateRunningBalances::dispatch($result->transaction, $result->delta())->afterCommit();
            }
        });
    }

    public function createTransfer(TransactionData $data): void
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

    private function createTransferDebit(TransactionData $data, Transfer $transfer): void
    {
        $from_account = $data->source_account;

        $debit_result = $this->createTransaction(
            $data,
            $transfer,
        );

        $from_account->debit($data->amount + $data->transfer_fee);

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
            RecalculateRunningBalances::dispatch($debit_result->transaction, $debit_result->delta())
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

    private function createTransferCredit(TransactionData $data, Transfer $transfer): void
    {
        $to_account = $data->destination_account;

        $credit_result = $this->createTransaction(
            $data,
            $transfer,
        );

        $to_account->credit($data->amount);

        if (!$credit_result->is_latest) {
            RecalculateRunningBalances::dispatch($credit_result->transaction, $credit_result->delta())->afterCommit();
        }
    }

    private function createTransaction(TransactionData $data, ?Transfer $transfer = null): CreateTransactionResult
    {
        $is_latest = $data->source_account->isTransactionDateLatest($data->transacted_at);
        $is_debit = $data->type === TransactionType::EXPENSE || $transfer?->from_account_id === $data->source_account->id;
        $running_balance = $data->source_account->current_balance;

        if (!$is_latest) {
            $previous_transaction = $data->source_account->getTransactionBeforeDatetime($data->transacted_at);
            $previous_running_balance = $previous_transaction?->running_balance ?? $data->source_account->initial_balance;
            $running_balance = $previous_running_balance;
        }

        $new_running_balance = $is_debit
            ? $running_balance - $data->amount
            : $running_balance + $data->amount;

        $transaction = Transaction::create([
            "user_id" => $data->user->id,
            "account_id" => $data->source_account->id,
            "amount" => $data->amount,
            "type" => $data->type,
            "transacted_at" => $data->transacted_at,
            "note" => $data->note,
            "running_balance" => $new_running_balance,
            "transfer_id" => $transfer?->id,
            "category_id" => $data->category_id,
        ]);

        return new CreateTransactionResult(
            $transaction,
            $is_latest,
            $data->old_transaction?->running_balance ?? $running_balance,
            $new_running_balance
        );
    }

    public function create(TransactionData $data): void
    {
        match ($data->type) {
            TransactionType::EXPENSE => $this->createExpense($data),
            TransactionType::INCOME => $this->createIncome($data),
            TransactionType::TRANSFER => $this->createTransfer($data),
            default => throw new Exception("Unsupported transaction.")
        };
    }

    public function update(TransactionData $data): void
    {
        $transaction = $data->old_transaction;

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
