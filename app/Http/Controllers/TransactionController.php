<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTO\CreateTransactionData;
use App\Enums\TransactionType;
use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\EditTransactionRequest;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Jobs\RecalculateRunningBalances;
use App\Models\Transaction;
use App\Services\TransactionService;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class TransactionController extends Controller
{
    private $transaction_service;

    public function __construct(TransactionService $service)
    {
        $this->transaction_service = $service;
    }

    public function index(TransactionRequest $request)
    {
        $user = $request->user();
        $filters = $request->safe();

        $transactions = $user->transactions()
            ->with(["account", "category", "transferDetails.fromAccount", "transferDetails.toAccount"])
            ->when(
                $filters->account,
                fn (Builder $q, string $account) => $q->whereRelation("account", "name", $account)
            )
            ->when(
                $filters->type,
                fn (Builder $q, string $type) => $q->whereType($type)
            )
            ->when(
                $filters->currency,
                fn (Builder $q, string $currency) => $q->whereRelation("account", "currency", $currency)
            )
            ->when(
                $filters->category,
                fn (Builder $q, string $category) => $q->whereRelation("category", "title", $category)
            )
            ->orderByDesc("transacted_at")
            ->orderByDesc("id")
            ->paginate(20);

        return Inertia::render("transactions", [
            "transactions" => TransactionResource::collection($transactions),
        ]);
    }

    public function store(CreateTransactionRequest $request)
    {
        $inputs = $request->safe();

        $type = TransactionType::from($inputs->type);
        $user = $request->user();

        $data = new CreateTransactionData(
            $user,
            $request->from_account ?? $request->account,
            $request->to_account,
            $inputs->amount,
            Carbon::parse($inputs->transacted_at),
            $type,
            $inputs->category_id,
            $inputs->note,
            $inputs->transfer_fee,
        );

        match ($type) {
            TransactionType::EXPENSE => $this->transaction_service->createExpense($data),
            TransactionType::INCOME => $this->transaction_service->createIncome($data),
            TransactionType::TRANSFER => $this->transaction_service->createTransfer($data),
            default => throw new Exception("Unsupported transaction.")
        };

        return back();
    }

    /**
     * @todo
     * 1. Allow account_id update
     * 2. Allow transfer_fee update
     */
    public function update(EditTransactionRequest $request, Transaction $transaction)
    {
        if ($transaction->type === TransactionType::TRANSFER) {
            $transaction_pair = $transaction->transferPair();

            $this->transaction_service->updateTransaction($transaction_pair, $request->amount, $request->note);

            RecalculateRunningBalances::dispatch($transaction_pair);
        }

        $this->transaction_service->updateTransaction($transaction, $request->amount, $request->note, $request->category_id);
        RecalculateRunningBalances::dispatch($transaction);

        return back();
    }
}
