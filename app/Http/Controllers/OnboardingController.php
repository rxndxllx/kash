<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Currency;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render("onboarding");
    }

    /**
     * @todo
     * 1. Cleanup
     * 2. Add validation for birthdate and country
     * 3. Add validation for profile picture in step 3
     */
    public function validate(Request $request, int $step)
    {
        $rules = [];

        if ($step === 1) {
            $rules = [
                "gender" => ["bail", "required", "in:male,female,other"],
                "birthdate" => ["bail", "required"],
                "country" => ["bail", "required"],
            ];
        } elseif ($step === 2) {
            $rules = [
                "base_currency" => ["bail", "required", Rule::enum(Currency::class)],
            ];
        } else {
            $rules = [];
        }

        $request->validate($rules);

        return back();
    }

    /**
     * @todo
     * 1. Cleanup
     * 2. Validate inputs
     * 3. Accept birthdate
     */
    public function complete(Request $request)
    {
        $user = $request->user();

        $user->onboarded = true;
        $user->gender = $request->gender;
        $user->birthdate = now();
        $user->country = $request->country;
        $user->base_currency = $request->base_currency;
        $user->save();

        return redirect()->intended(route("dashboard", absolute: false));
    }
}
