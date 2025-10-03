<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Country;

class DataCountryController extends Controller
{
    public function __invoke()
    {
        return collect(Country::cases())->map(fn (Country $country) => [
            "code" => $country->value,
            "name" => $country->name()]
        );
    }
}
