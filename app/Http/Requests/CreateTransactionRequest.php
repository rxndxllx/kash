<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TransactionType;
use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            "account_id" => [
                "bail",
                "required_unless:type,".TransactionType::TRANSFER->value,
                "nullable",
                "exists:accounts,id",
            ],
            "category_id" => [
                "bail",
                "required_unless:type,".TransactionType::TRANSFER->value,
                "nullable",
                "exists:categories,id",
            ],
            "from_account_id" => [
                "bail",
                "required_if:type,".TransactionType::TRANSFER->value,
                "exists:accounts,id",
                "nullable",
            ],
            "to_account_id" => [
                "bail",
                "required_if:type,".TransactionType::TRANSFER->value,
                "nullable",
                "exists:accounts,id",
                "different:from_account_id",
            ],
            "transfer_fee" => ["bail", "numeric", "gte:0"],
            "amount" => ["bail", "required", "gt:0", "numeric"],
            "type" => ["bail", "required", Rule::enum(TransactionType::class)],
            "transacted_at" => ["bail", "sometimes", "nullable", "date"],
            "note" => ["bail", "nullable", "string", "max:255"],
        ];
    }

    public function after(): array
    {
        return [
            /**
             * Backend handles the validation for different currencies right now
             * Ideally, the component should only show valid receiving accounts
             * upon selection of origin account
             */
            function (Validator $v) {
                if (
                    $v->errors()->isEmpty()
                    && $this->type === TransactionType::TRANSFER->value
                ) {
                    $from = Account::find($this->from_account_id);
                    $to = Account::find($this->to_account_id);

                    if ($from->currency !== $to->currency) {
                        $v->errors()->add("to_account_id", "Receiving account must be of same currency");
                    }
                }
            },
        ];
    }

    public function passedValidation(): void
    {
        $this->merge([
            "account" => Account::find($this->account_id),
            "from_account" => Account::find($this->from_account_id),
            "to_account" => Account::find($this->to_account_id),
        ]);
    }
}
