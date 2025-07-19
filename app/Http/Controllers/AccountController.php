<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AccountRequest;
use App\Http\Requests\CreateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(AccountRequest $request)
    {
        $filters = $request->safe();

        $accounts = $request->user()->accounts()
            ->when(
                $filters->search,
                fn (Builder $q, string $search) => $q->where("name", "LIKE", "%$search%")
            )
            ->when(
                $filters->currency,
                fn (Builder $q, string $currency) => $q->whereCurrency($currency)
            )
            ->when(
                $filters->type,
                fn (Builder $q, string $type) => $q->whereType($type)
            );

        return Inertia::render("accounts", [
            "accounts" => AccountResource::collection($accounts->paginate(20)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateAccountRequest $request)
    {
        Account::create([
            "name" => $request->name,
            "currency" => $request->currency,
            "type" => $request->type,
            "balance" => $request->balance,
            "user_id" => $request->user()->id,
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account): RedirectResponse
    {
        $account->update([
            "name" => $request->name,
            "balance" => $request->balance,
            "type" => $request->type,
            "currency" => $request->currency,
        ]);

        return to_route("accounts");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
