<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(TransactionRequest $request)
    {
        $user = $request->user();
        $filters = $request->safe();

        $transactions = $user->transactions()
            ->with(["account", "category"])
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
        $account = $request->account;
        $type = TransactionType::from($request->type);

        if ($type === TransactionType::EXPENSE) {
            $account->debit($request->amount);
        } elseif ($type === TransactionType::INCOME) {
            $account->credit($request->amount);
        }
        Transaction::create([
            "user_id" => $request->user()->id,
            "account_id" => $request->account_id,
            "category_id" => $request->category_id,
            "amount" => $request->amount,
            "type" => $request->type,
            "transacted_at" => now(),
            "note" => $request->note,
            "running_balance" => $account->balance,
        ]);

        return back();
    }
}
