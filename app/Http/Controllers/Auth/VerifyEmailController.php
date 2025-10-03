<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $user->onboarded
                ? redirect()->intended(route("dashboard", absolute: false)."?verified=1")
                : to_route("onboarding");
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return to_route("onboarding");
    }
}
