<?php

declare(strict_types=1);

namespace App\Enums;

use Illuminate\Support\Collection;

enum Currency: string
{
    case USD = "USD";
    case PHP = "PHP";

    public function fullName(): string
    {
        return match ($this) {
            self::USD => "US Dollar",
            self::PHP => "Philippine Peso",
            default => $this->value,
        };
    }

    public function countryCode(): string
    {
        return match ($this) {
            self::USD => "US",
            self::PHP => "PH",
            default => "Unknown country code",
        };
    }

    public function countryName(): string
    {
        return match ($this) {
            self::USD => "United States of America",
            self::PHP => "Philippines",
            default => "Unknown entity"
        };
    }

    public function details(): Collection
    {
        return collect([
            "code" => $this->value,
            "name" => $this->fullName(),
            "country_code" => $this->countryCode(),
            "country" => $this->countryName(),
        ]);
    }
}
