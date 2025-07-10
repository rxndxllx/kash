<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render("transactions", [
            "transactions" => TransactionResource::collection(request()->user()->transactions()->paginate(20)),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Transaction::create([
            "user_id" => $request->user()->id,
            "account_id" => $request->user()->accounts()->first()->id,
            "category_id" => 1,
            "amount" => $request->amount,
            "type" => $request->type,
            "transacted_at" => now(),
            "note" => $request->note,
            "name" => $request->name,
        ]);

        return to_route("transactions");
    }
}
