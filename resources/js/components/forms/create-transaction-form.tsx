import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import { cn, parseIntOrSelf } from "@/lib/utils";
import { Currency, TransactionType } from "@/lib/enums";
import { format } from "date-fns";
import { FormEventHandler } from "react";
import { isEqual } from "lodash";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TRANSACTION_TYPE_COLOR_MAP } from "@/lib/constants";
import { useForm } from "@inertiajs/react";
import DatePicker from "@/components/datepicker";
import InputError from "@/components/input-error";
import NumberInput from "@/components/number-input";
import SelectAccount from "@/components/select-account";
import SelectCategory from "@/components/select-category";
import SelectCurrency from "@/components/select-currency";
import useAuth from "@/hooks/use-auth";

type CreateTransactionForm = {
    currency: Currency;
    note: string;
    transacted_at: string;
    amount: number;
    account_id: string;
    from_account_id: string;
    to_account_id: string;
    transfer_fee: number;
    category_id: string;
    type: TransactionType;
};

export default function CreateTransactionFormSheet({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void; }) {
    const user = useAuth();
    const { data, setData, post, errors, reset, processing, transform } = useForm<Required<CreateTransactionForm>>({
            currency: user.base_currency,
            note: "",
            transacted_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            amount: 0,
            account_id: "",
            from_account_id: "",
            to_account_id: "",
            category_id: "",
            transfer_fee: 0,
            type: TransactionType.EXPENSE,
        });
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        /**
         * @todo
         * Maybe remove this?? Don't remember the purpose but it seems useless
         */
        transform((data) => ({
            ...data,
            account_id: parseIntOrSelf(data.account_id),
            category_id: parseIntOrSelf(data.category_id),
            from_account_id: parseIntOrSelf(data.from_account_id),
            to_account_id: parseIntOrSelf(data.to_account_id),
        }));

        post(route("create-transaction"), {
            onSuccess: () => {
                reset();
                toast("Transaction created", {
                    closeButton: true,
                    position: "top-center",
                    description: `Successfully created a new transaction.`
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
                <SheetHeader><SheetTitle>Create Transaction</SheetTitle></SheetHeader>
                <form onSubmit={submit} className="grid flex-1">
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <SelectCurrency
                                    value={data.currency}
                                    onValueChange={(value) => setData("currency", value as Currency)}
                                    className="w-[100px] text-xl border-none shadow-none"
                                    symbolMode
                                />
                                <NumberInput
                                    value={data.amount}
                                    className={
                                        cn(
                                            TRANSACTION_TYPE_COLOR_MAP[data.type],
                                            /**
                                             * @todo Fix the length checking here. It should be based on amount and not string length.
                                             */
                                            data.amount.toString().length >= 10 ? "text-3xl" : "text-4xl",
                                            "border-none shadow-none focus-visible:ring-0 font-extrabold resize-none dark:bg-input/0 text-right"
                                        )
                                    }
                                    autoFocus
                                    onChange={(value: number) => setData("amount", value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.amount}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="type">Type</Label>
                            <RadioGroup
                                id="type"
                                value={data.type}
                                className="flex"
                                onValueChange={(value) => setData("type", value as TransactionType)}
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value={TransactionType.EXPENSE} id="r1" />
                                    <Label htmlFor="r1">Expense</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value={TransactionType.INCOME} id="r2" />
                                    <Label htmlFor="r2">Income</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value={TransactionType.TRANSFER} id="r3" />
                                    <Label htmlFor="r3">Transfer</Label>
                                </div>
                            </RadioGroup>
                            <InputError message={errors.type}/>
                        </div>
                        {
                            isEqual(data.type, TransactionType.TRANSFER)
                            ? (
                                <>
                                    <div className="grid gap-3">
                                        <Label>Origin Account</Label>
                                        <SelectAccount
                                            required
                                            value={data.from_account_id}
                                            onValueChange={(value) => setData("from_account_id", value)}
                                            showBalance
                                            currency={data.currency}
                                        />
                                        <InputError message={errors.from_account_id}/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>To Account</Label>
                                        <SelectAccount
                                            required
                                            value={data.to_account_id}
                                            onValueChange={(value) => setData("to_account_id", value)}
                                            showBalance
                                            currency={data.currency}
                                        />
                                        <InputError message={errors.to_account_id}/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="transfer-fee">Transfer Fee</Label>
                                        <NumberInput
                                            id="transfer-fee"
                                            onChange={(value) => setData("transfer_fee", value)}
                                            value={data.transfer_fee}
                                            required
                                            placeholder="0"
                                        />
                                        <InputError message={errors.transfer_fee}/>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid gap-3">
                                        <Label htmlFor="account-id">Account</Label>
                                        <SelectAccount
                                            id="account-id"
                                            required
                                            value={data.account_id}
                                            onValueChange={(value) => setData("account_id", value)}
                                            showBalance
                                            currency={data.currency}
                                        />
                                        <InputError message={errors.account_id}/>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Category</Label>
                                        <SelectCategory
                                            required
                                            value={data.category_id}
                                            onValueChange={(value) => setData("category_id", value)}
                                        />
                                        <InputError message={errors.category_id}/>
                                    </div>
                                </>   
                            )
                        }
                        <div className="grid gap-3">
                            <Label htmlFor="note">Transaction Date</Label>
                            <DatePicker
                                value={data.transacted_at}
                                onValueChange={(value) => setData("transacted_at", value)}
                                withTime
                            />
                            <InputError message={errors.note}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                name="note"
                                className="resize-none"
                                value={data.note}
                                onChange={(e) => setData("note", e.target.value)}
                            />
                            <InputError message={errors.note}/>
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
