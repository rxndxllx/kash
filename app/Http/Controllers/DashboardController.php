<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Currency;
use App\Http\Requests\DashboardStatsRequest;
use App\Http\Resources\TransactionResource;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private DashboardService $dashboard_service;

    public function __construct(DashboardService $dashboard_service)
    {
        $this->dashboard_service = $dashboard_service;
    }

    public function index(DashboardStatsRequest $request): Response
    {
        $inputs = $request->safe();
        $user = $request->user();

        $dashboard_data = $this->dashboard_service->generateDashboardData(
            $user,
            Currency::from($inputs->currency),
            (int) $inputs->year,
            (int) $inputs->month
        );

        return Inertia::render("dashboard", [
            "yearly_data" => $dashboard_data->get("yearly_data"),
            "monthly_data" => $dashboard_data->get("monthly_data"),
            "recent_transactions" => TransactionResource::collection($dashboard_data->get("recent_transactions")),
        ]);
    }
}
