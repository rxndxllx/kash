import InputError from "@/components/input-error";
import SelectCurrency from "@/components/select-currency";
import TextLink from "@/components/text-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useInitials } from "@/hooks/use-initials";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import AuthLayout from "@/layouts/auth-layout";
import { Currency } from "@/lib/enums";
import { SharedData } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { SelectValue } from "@radix-ui/react-select";
import { FormEventHandler, useState } from "react";

type OnboardingForm = {
    gender: string;
    birthdate: string;
    country: string;
    base_currency: Currency;
}

/**
 * @todo
 * 1. Cleanup
 */
export default function Onboarding() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    const [step, setStep] = useState(1);

    const cleanup = useMobileNavigation();
    
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    }

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
                        { step === 1 && (
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
                                            <RadioGroupItem value="male" id="r1" />
                                            <Label htmlFor="r1">Male</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="female" id="r2" />
                                            <Label htmlFor="r2">Female</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="other" id="r3" />
                                            <Label htmlFor="r3">Other</Label>
                                        </div>
                                    </RadioGroup>
                                    <InputError message={errors.gender}/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="type">When is your birthday?</Label>
                                    <Input value={data.birthdate} onChange={(e) => setData("birthdate", e.target.value)}/>
                                    <InputError message={errors.birthdate}/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="type">Where are you from?</Label>
                                    <Select value={data.country} onValueChange={(value) => setData("country", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Country"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PH">
                                                Philippines
                                            </SelectItem>
                                            <SelectItem value="US">
                                                United States
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.country}/>
                                </div>
                            </>
                        )}

                        { step === 2 && (
                            <div className="grid gap-3">
                                <Label htmlFor="type">Select your primary currency</Label>
                                <SelectCurrency value={data.base_currency} onValueChange={(value) => setData("base_currency", value as Currency)} className="w-full"/>
                                <small>This will be your default currency when using Kash. You can change this later in your settings.</small>
                                <InputError message={errors.base_currency}/>
                            </div>
                        )}

                        { step === 3 && (
                            <>
                                <div className="flex flex-col gap-3 items-center">
                                    <Avatar className="h-30 w-30 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.full_name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white text-4xl">
                                            {getInitials(auth.user.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="grid gap-3">
                                    <Label>Set a Profile Picture</Label>
                                    <Input type="file" />
                                </div>
                            </>
                        )}
                    </div>
                    { step < 3 ? (
                        <Button className="mt-4 w-full" type="button" onClick={() => validateStep(step)}>Next</Button>
                    ) : (
                        <Button className="mt-4 w-full" type="submit">Let's go!</Button>
                    )}
                    <Button className="mt-4 w-full" type="button" onClick={() => setStep(v => v-1)} variant="outline" disabled={step === 1}>Back</Button>
                </form>
                <TextLink method="post" href={route("logout")} tabIndex={6} onClick={handleLogout} className="text-sm text-center">
                    Log out
                </TextLink>
            </AuthLayout>
    );
}
