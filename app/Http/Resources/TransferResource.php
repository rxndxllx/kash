<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransferResource extends JsonResource
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
            "from_account" => new AccountResource($this->fromAccount),
            "to_account" => new AccountResource($this->toAccount),
            "transfer_fee" => $this->feeTransaction()?->amount,
        ];
    }
}
