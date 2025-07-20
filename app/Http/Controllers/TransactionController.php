<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Services\TransactionService;
use Illuminate\Database\Eloquent\Builder;
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
                fn (Builder $q, string $account_id) => $q->whereAccountId($account_id)
            )
            ->when(
                $filters->type,
                fn (Builder $q, string $type) => $q->whereType($type)
            )
            ->when(
                $filters->currency,
                fn (Builder $q, string $currency) => $q->whereRelation("account", "currency", $currency)
            )
            ->orderByDesc("transacted_at")
            ->orderByDesc("id")
            ->paginate(20);

        return Inertia::render("transactions", [
            "transactions" => TransactionResource::collection($transactions),
            "categories" => Category::generic()->get()->merge($user->categories),
        ]);
    }

    /**
     * @todo
     * 1. Credit/debit the transaction account
     * 2. Track running balance per transaction
     */
    public function store(CreateTransactionRequest $request)
    {
        $type = TransactionType::from($request->type);
        $user = $request->user();

        $amount = $request->amount;
        $note = $request->note;

        if ($type === TransactionType::TRANSFER) {
            $this->transaction_service->createTransfer(
                $user,
                $request->from_account,
                $request->to_account,
                $amount,
                $note,
                $request->transfer_fee,
            );
        } else {
            $method = "createExpense";

            if ($type === TransactionType::INCOME) {
                $method = "createIncome";
            }

            $this->transaction_service->$method(
                $user,
                $request->account,
                $request->category_id,
                $amount,
                $note
            );
        }

        return back();
    }
}
