<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AccountType;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    public function definition(): array
    {
        $balance = fake()->randomNumber(5, true);

        return [
            "type" => fake()->randomElement(AccountType::cases()),
            "initial_balance" => $balance,
            "current_balance" => $balance,
            "currency" => fake()->randomElement(Currency::cases()),
            "name" => str(fake()->word())->title(),
        ];
    }
}
