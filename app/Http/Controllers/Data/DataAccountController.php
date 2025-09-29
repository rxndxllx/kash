<?php

declare(strict_types=1);

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAccountRequest;
use App\Http\Requests\DataAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DataAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(DataAccountRequest $request)
    {
        $filters = $request->safe();

        $accounts = $request->user()->accounts()
            ->when(
                $filters->currency,
                fn (Builder $q, string $currency) => $q->whereCurrency($currency)
            );

        return AccountResource::collection($accounts->get());
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
        //
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
    public function update(Request $request, Account $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
