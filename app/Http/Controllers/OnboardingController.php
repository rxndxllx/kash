<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CompleteOnboardingRequest;
use App\Http\Requests\ValidateOnboardingStepRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render("onboarding");
    }

    /**
     * @todo
     * 1. Add validation for profile picture in step 3
     */
    public function validate(ValidateOnboardingStepRequest $request)
    {
        return back();
    }

    public function complete(CompleteOnboardingRequest $request)
    {
        $user = $request->user();
        $inputs = $request->safe();

        $user->onboarded = true;
        $user->gender = $inputs->gender;
        $user->birthdate = $inputs->birthdate;
        $user->country = $inputs->country;
        $user->base_currency = $inputs->base_currency;
        $user->save();

        return redirect()->intended(route("dashboard", absolute: false));
    }
}
