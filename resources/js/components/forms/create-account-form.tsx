import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import { Currency, AccountType } from "@/lib/enums";
import { FormEventHandler } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { toUpper, startCase } from "lodash";
import { useForm } from "@inertiajs/react";
import * as Flags from "country-flag-icons/react/3x2";
import InputError from "@/components/input-error";

type CreateAccountForm = {
    name: string;
    initial_balance: number;
    currency: Currency | "";
    type: AccountType | "";
};

export default function CreateAccountFormTrigger() {
    const { data, setData, post, errors, reset } = useForm<Required<CreateAccountForm>>({
            name: "",
            initial_balance: 0,
            currency: "",
            type: "",
        });
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("create-account"), {
            onFinish: () => {
                reset();
                toast("Account created", {
                    position: "top-center",
                    description: `Successfully created new account ${data.name}.`
                })
            },
        });
    };
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="lg">
                    Create New
                    <CircleFadingPlus height={8} width={8}/>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader><SheetTitle>Create Account</SheetTitle></SheetHeader>
                <form onSubmit={submit} className="grid flex-1">
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div className="grid gap-3">
                            <Textarea
                                id="sheet-demo-name"
                                placeholder="Name"
                                className="border-none shadow-none focus-visible:ring-0 text-2xl font-extrabold resize-none"
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            <InputError message={errors.name}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Initial Balance</Label>
                            <Input
                                id="sheet-demo-name"
                                type="number"
                                value={data.initial_balance}
                                onChange={(e) => setData("initial_balance",parseFloat(e.target.value))}
                                required
                            />
                            <InputError message={errors.initial_balance}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Currency</Label>
                            <Select
                                value={data.currency}
                                onValueChange={(value) => setData("currency", value as Currency)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Currency).map((currency) =>
                                        <SelectItem value={currency} key={currency}>
                                            <Flags.PH className="w-5 rounded-sm"/>
                                            {toUpper(currency)}
                                        </SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.currency}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Type</Label>
                            <Select value={data.type} onValueChange={(value) => setData("type", value as AccountType)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(AccountType).map((type) =>
                                        <SelectItem value={type} key={type}>
                                            <CircleFadingPlus className="bg-sidebar-accent p-0.5 rounded-sm"/>
                                            {startCase(type)}
                                        </SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type}/>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="submit">Save</Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
