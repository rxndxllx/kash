<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\TransactionType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            "amount" => $this->amount,
            "type" => $this->type,
            "transacted_at" => $this->transacted_at->format("Y-m-d H:i:s"),
            "note" => $this->note,
            "account" => new AccountResource($this->account),
            "category" => new CategoryResource($this->category),
            "running_balance" => $this->running_balance,
            $this->mergeWhen(
                $this->type === TransactionType::TRANSFER,
                ["transfer_details" => new TransferResource($this->transferDetails)]
            ),
        ];
    }
}
