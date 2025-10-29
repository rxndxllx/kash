<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Currency;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class DashboardStats extends Model
{
    protected $fillable = [
        "currency",
        "month",
        "year",
        "total_balance",
        "total_expense",
        "total_income",
        "user_id",
    ];

    protected function casts(): array
    {
        return [
            "currency" => Currency::class,
            "total_balance" => "float",
            "total_expense" => "float",
            "total_income" => "float",
        ];
    }

    protected function cashFlow(): Attribute
    {
        return new Attribute(fn () => ($this->total_income ?? 0) - ($this->total_expense ?? 0));
    }

    public function decrementBalance(float $amount): void
    {
        $this->decrement("total_balance", $amount);
    }

    public function incrementBalance(float $amount): void
    {
        $this->increment("total_balance", $amount);
    }

    public function applyExpense(float $amount): void
    {
        $this->decrementBalance($amount);
        $this->increment("total_expense", $amount);
    }

    public function applyIncome(float $amount): void
    {
        $this->incrementBalance($amount);
        $this->increment("total_income", $amount);
    }

    public function reverseIncome(float $amount): void
    {
        $this->decrementBalance($amount);
        $this->decrement("total_income", $amount);
    }

    public function reverseExpense(float $amount): void
    {
        $this->incrementBalance($amount);
        $this->decrement("total_expense", $amount);
    }

    #[Scope]
    protected function afterMonth(Builder $query, int $month, int $year): void
    {
        $query->whereRaw(
            "(year > ? OR (year = ? AND month > ?))",
            [$year, $year, $month]
        );
    }

    #[Scope]
    protected function beforeMonth(Builder $query, int $month, int $year): void
    {
        $query->whereRaw(
            "(year < ? OR (year = ? AND month < ?))",
            [$year, $year, $month]
        );
    }

    public static function lastKnownStats(
        int $user_id,
        Currency $currency,
        int $month,
        int $year
    ): ?self {
        return self::select("total_balance")
            ->where("user_id", $user_id)
            ->where("currency", $currency)
            ->beforeMonth($month, $year)
            ->orderByDesc("year")
            ->orderByDesc("month")
            ->first();
    }

    public static function findOrCreateWithLastKnownBalance(int $user_id, Currency $currency, int $year, int $month): self
    {
        $last_known_stats = self::lastKnownStats($user_id, $currency, $month, $year);

        return self::firstOrCreate(
            [
                "user_id" => $user_id,
                "currency" => $currency,
                "month" => $month,
                "year" => $year,
            ],
            [
                "total_balance" => ($last_known_stats?->total_balance ?? 0),
            ]
        );
    }
}
