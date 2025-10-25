<?php

declare(strict_types=1);

if (!function_exists("computePercentage")) {
    function computePercentage(float $part, float $whole, int $precision = 0): float
    {
        return round(($part / $whole) * 100, $precision);
    }
}
