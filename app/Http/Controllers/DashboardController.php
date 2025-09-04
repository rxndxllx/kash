<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Currency;
use App\Http\Requests\DashboardStatsRequest;
use App\Http\Resources\TransactionResource;
use App\Models\DashboardStats;
use App\Services\DashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private DashboardService $dashboard_service;

    public function __construct(DashboardService $dashboard_service)
    {
        $this->dashboard_service = $dashboard_service;
    }

    public function index(DashboardStatsRequest $request): Response|RedirectResponse
    {
        $inputs = $request->safe();
        $user = $request->user();

        $all = DashboardStats::where("year", $inputs->year)->get();
        $month = $all->firstWhere("month", $inputs->month);

        $yearly_data = $this->dashboard_service->generateYearlyData($all, $inputs);
        $monthly_data = $this->dashboard_service->generateMonthlyData($month, $inputs);
        $recent_transactions = $user->transactions()
            ->whereCurrency(Currency::from($inputs->currency))
            ->orderByDesc("transacted_at")
            ->orderByDesc("id")
            ->paginate(10);

        return Inertia::render("dashboard", [
            "yearly_data" => $yearly_data,
            "monthly_data" => $monthly_data,
            "recent_transactions" => TransactionResource::collection($recent_transactions),
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
    public function store(Request $request)
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
    public function update(Request $request, string $id)
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
