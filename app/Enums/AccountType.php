<?php

declare(strict_types=1);

namespace App\Enums;

enum AccountType: string
{
    case CASH = "cash";
    case SAVINGS_ACCOUNT = "savings_account";
    case CHECKING_ACCOUNT = "checking_account";
    case E_WALLET = "e_wallet";
}
