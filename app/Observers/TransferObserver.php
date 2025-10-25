<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Transfer;

class TransferObserver
{
    public function updating(Transfer $transfer): void
    {
        if (is_null($transfer->from_account_id) && is_null($transfer->to_account_id)) {
            $transfer->delete();
        }
    }

    public function deleting(Transfer $transfer): void
    {
        $transfer->transactions->each->delete();
    }
}
