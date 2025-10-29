<?php

declare(strict_types=1);

namespace App\Enums;

enum TrendType: string
{
    case NO_ACTIVITY = "no_activity";
    case POSITIVE = "positive";
    case NEGATIVE = "negative";
    case NEW_POSITIVE = "new_positive";
    case NEW_NEGATIVE = "new_negative";
}
