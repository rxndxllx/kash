<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Currency;
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
}
