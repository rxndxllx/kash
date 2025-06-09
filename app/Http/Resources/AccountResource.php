<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "type" => $this->type,
            "name" => $this->name,
            "balance" => $this->balance,
            "currency" => $this->currency,
            "currency_country" => $this->currency->countryName(),
            "currency_country_code" => $this->currency->countryCode(),
        ];
    }
}
