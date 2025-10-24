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

    public function store(CreateAccountRequest $request)
    {
        Account::create([
            "name" => $request->name,
            "currency" => $request->currency,
            "type" => $request->type,
            "current_balance" => $request->balance,
            "initial_balance" => $request->balance,
            "user_id" => $request->user()->id,
        ]);

        return back();
    }

    /**
     * @todo
     * 1. Add a FormRequest to authorize this action.
     * 2. Add the side effects of edge cases (e.g. changing the balance and currency).
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
     * @todo Add a FormRequest to authorize this action.
     */
    public function destroy(Request $request, Account $account): RedirectResponse
    {
        $account->delete();

        return to_route("accounts");
    }
}
