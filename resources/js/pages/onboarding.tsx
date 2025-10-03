import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Currency } from "@/lib/enums";
import { format } from "date-fns";
import { FormEventHandler, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { isEqual } from "lodash";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SharedData } from "@/types";
import { useInitials } from "@/hooks/use-initials";
import AuthLayout from "@/layouts/auth-layout";
import DatePicker from "@/components/datepicker";
import InputError from "@/components/input-error";
import SelectCountry from "@/components/select-country";
import SelectCurrency from "@/components/select-currency";
import TextLink from "@/components/text-link";
import useLogout from "@/hooks/use-logout";

type OnboardingForm = {
    gender: string;
    birthdate: string;
    country: string;
    base_currency: Currency;
}

/**
 * @todo
 * 1. Add profile picture file upload functionality
 */
export default function Onboarding() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const [step, setStep] = useState(1);
    const getInitials = useInitials();
    const handleLogout = useLogout();

    const { data, setData, post, errors, reset, processing } = useForm<Required<OnboardingForm>>({
        gender: "male",
        birthdate: "",
        country: "",
        base_currency: Currency.PHP,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("onboarding.complete"), {
            onSuccess: () => reset()  
        });
    };

    const validateStep = (step: number) => {
        post(route("onboarding.validate", { step }), {
            preserveState: true,
            onSuccess: () => {
                setStep(v => v+1);
            }
        });
    };

    return (
        <AuthLayout title={`Welcome, ${auth.user.first_name}!`} description="Help us tailor your experience">
            <Head title="Onboarding" />
            <Progress value={(100 / 3) * step} className="h-1"/>
            <form onSubmit={submit}>
                <div className="flex flex-col gap-6 min-h-[250px] justify-center">
                    { isEqual(step, 1) && (
                        <>
                            <div className="grid gap-3">
                                <Label htmlFor="type">What's your gender?</Label>
                                <RadioGroup
                                    id="type"
                                    value={data.gender}
                                    className="flex"
                                    onValueChange={(value) => setData("gender", value)}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">Male</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">Female</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="other" id="other" />
                                        <Label htmlFor="other">Other</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.gender}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="type">When is your birthday?</Label>
                                <DatePicker
                                    value={data.birthdate}
                                    onValueChange={(value) => setData("birthdate", format(value, "yyyy-MM-dd"))}/>
                                <InputError message={errors.birthdate}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="type">Where are you from?</Label>
                                <SelectCountry value={data.country} onValueChange={(value) => setData("country", value)} />
                                <InputError message={errors.country}/>
                            </div>
                        </>
                    )}

                    { isEqual(step, 2) && (
                        <div className="grid gap-3">
                            <Label htmlFor="type">Select your primary currency</Label>
                            <SelectCurrency
                                value={data.base_currency}
                                onValueChange={(value) => setData("base_currency", value as Currency)}
                                className="w-full"
                            />
                            <small>This will be your default currency when using Kash. You can change this later in your settings.</small>
                            <InputError message={errors.base_currency}/>
                        </div>
                    )}

                    { isEqual(step, 3) && (
                        <>
                            <div className="flex flex-col gap-3 items-center">
                                <Avatar className="h-30 w-30 overflow-hidden rounded-full">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.full_name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white text-4xl">
                                        {getInitials(auth.user.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <small className="mt-3">This will be your default profile picture. You can change this later in your settings.</small>
                        </>
                    )}
                </div>
                { step < 3 ? (
                    <Button className="mt-4 w-full" type="button" onClick={() => validateStep(step)}>Next</Button>
                ) : (
                    <Button className="mt-4 w-full" type="submit" disabled={processing}>Let's go!</Button>
                )}
                <Button className="mt-4 w-full" type="button" onClick={() => setStep(v => v-1)} variant="outline" disabled={isEqual(step, 1)}>Back</Button>
            </form>
            <TextLink method="post" href={route("logout")} tabIndex={6} onClick={handleLogout} className="text-sm text-center">
                Log out
            </TextLink>
        </AuthLayout>
    );
}
