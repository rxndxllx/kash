<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreateTransactionRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $user = request()->user();

        return Inertia::render("transactions", [
            "transactions" => TransactionResource::collection(
                $user->transactions()
                    ->with(["account", "category"])
                    ->orderByDesc("transacted_at")
                    ->paginate(20)
            ),
            "accounts" => AccountResource::collection($user->accounts),
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
        Transaction::create([
            "user_id" => $request->user()->id,
            "account_id" => $request->account_id,
            "category_id" => $request->category_id,
            "amount" => $request->amount,
            "type" => $request->type,
            "transacted_at" => now(),
            "note" => $request->note,
        ]);

        return to_route("transactions");
    }
}
