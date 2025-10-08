import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import { Currency, AccountType } from "@/lib/enums";
import { FormEventHandler } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { startCase } from "lodash";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";
import NumberInput from "@/components/number-input";
import SelectCurrency from "@/components/select-currency";
import useAuth from "@/hooks/use-auth";

type CreateAccountForm = {
    name: string;
    balance: number;
    currency: Currency;
    type: AccountType | "";
};

type CreateAccountFormSheetProps = { open: boolean; setOpen: (open: boolean) => void };

export default function CreateAccountFormSheet({ open, setOpen }: CreateAccountFormSheetProps) {
    const user = useAuth();
    const { data, setData, post, errors, reset, processing } = useForm<Required<CreateAccountForm>>({
            name: "",
            balance: 0,
            currency: user.base_currency,
            type: "",
        });
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("create-account"), {
            onSuccess: () => {
                reset();
                toast("Account created", {
                    closeButton: true,
                    position: "top-center",
                    description: `Successfully created new account ${data.name}.`
                });
            },
        });
    };
    return (
        <Sheet open={open} onOpenChange={setOpen}>
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
                                id="account-name"
                                placeholder="Name"
                                className="border-none shadow-none focus-visible:ring-0 text-2xl font-extrabold resize-none dark:bg-input/0"
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            <InputError message={errors.name}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="current-balance">Current Balance</Label>
                            <NumberInput
                                id="current-balance"
                                onChange={(value) => setData("balance", value)}
                                value={data.balance}
                                required
                            />
                            <InputError message={errors.balance}/>
                        </div>
                        <div className="grid gap-3">
                            <Label>Currency</Label>
                            <SelectCurrency
                                value={data.currency}
                                onValueChange={(value) => setData("currency", value as Currency)}
                                className="w-full"
                            />
                            <InputError message={errors.currency}/>
                        </div>
                        <div className="grid gap-3">
                            <Label>Type</Label>
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
                        <Button type="submit" disabled={processing}>Save</Button>
                        <SheetClose asChild>
                            <Button variant="outline" disabled={processing}>Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
