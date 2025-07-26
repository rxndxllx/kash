<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;

class EditTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "amount" => ["bail", "required", "gt:0", "numeric"],
            "category_id" => [
                "bail",
                "required_unless:type,".TransactionType::TRANSFER->value,
                "nullable",
                "exists:categories,id",
            ],
            "note" => ["bail", "nullable", "string", "max:255"],
            "transfer_fee" => ["bail", "numeric", "gte:0"],
        ];
    }
}
