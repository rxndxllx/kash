<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Currency;
use App\Http\Requests\DashboardStatsRequest;
use App\Http\Resources\TransactionResource;
use App\Services\DashboardService;
use Illuminate\Http\RedirectResponse;
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

        $stats = $user->dashboardStats()
            ->where("year", $inputs->year)
            ->where("currency", $inputs->currency)
            ->get();

        $month = $stats->firstWhere("month", $inputs->month);

        $yearly_data = $this->dashboard_service->generateYearlyData($stats, $inputs);
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
}
