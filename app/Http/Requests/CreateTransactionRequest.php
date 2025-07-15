<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTransactionRequest extends FormRequest
{
    /**
     * @todo
     * 1. Validate that the owner of the account is the authenticated user
     * 2. Improve error messages
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "account_id" => ["bail", "required", "exists:accounts,id"],
            "category_id" => ["bail", "required", "exists:categories,id"],
            "amount" => ["bail", "required", "gt:0", "numeric"],
            "type" => ["bail", "required", Rule::enum(TransactionType::class)],
            "transacted_at" => ["bail", "sometimes", "nullable", "date"],
            "note" => ["bail", "nullable", "string", "max:255"],
        ];
    }
}
