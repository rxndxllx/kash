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
        return [
            "type" => fake()->randomElement(AccountType::cases()),
            "balance" => fake()->randomNumber(5, true),
            "currency" => fake()->randomElement(Currency::cases()),
            "name" => str(fake()->word())->title(),
        ];
    }
}
