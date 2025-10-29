<?php

declare(strict_types=1);

if (!function_exists("computePercentage")) {
    function computePercentage(float $part, float $whole, int $precision = 0): float
    {
        return round(($part / $whole) * 100, $precision);
    }
}

/**
 * Checks if the number is below the smallest acceptable value to evaluate as zero.
 * This is a workaround for the problematic equality comparison of floats.
 *
 * @see https://www.php.net/manual/en/language.types.float.php
 */
if (!function_exists("isEpsilonZero")) {
    function isEpsilonZero(float $number, float $epsilon = 0.00001, bool $absolute = true): bool
    {
        return ($absolute ? abs($number) : $number) < $epsilon;
    }
}
