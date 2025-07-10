import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormEventHandler } from "react";
import { Input } from "@/components/ui/input";
import { isEqual } from "lodash";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TransactionType } from "@/lib/enums";
import { useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";

type CreateTransactionForm = {
    note: string;
    transactedAt: string;
    amount: number;
    accountId: string | null;
    categoryId: string | null;
    type: TransactionType;
};

export default function CreateTransactionFormSheet() {
    const { data, setData, post, errors, reset, processing } = useForm<Required<CreateTransactionForm>>({
            note: "",
            transactedAt: "",
            amount: 0,
            accountId: null,
            categoryId: null,
            type: TransactionType.EXPENSE,
        });
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("create-transaction"), {
            onSuccess: () => {
                reset();
                toast("Transaction created", {
                    closeButton: true,
                    position: "top-center",
                    description: `Successfully created a new transaction.`
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
                <SheetHeader><SheetTitle>Create Transaction</SheetTitle></SheetHeader>
                <form onSubmit={submit} className="grid flex-1">
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div className="grid gap-3">
                            <Input
                                id="sheet-amount"
                                placeholder="Amount"
                                className={cn(
                                    isEqual(data.type, TransactionType.EXPENSE) ? "text-red-600" : "text-green-600",
                                    "border-none shadow-none focus-visible:ring-0 text-4xl font-extrabold resize-none dark:bg-input/0 text-right")}
                                autoFocus
                                value={data.amount}
                                onChange={(e) => setData("amount", parseFloat(e.target.value))}
                                required
                                type="number"
                            />
                            <InputError message={errors.amount}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Type</Label>
                            <RadioGroup
                                defaultValue={TransactionType.EXPENSE}
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
                                    <RadioGroupItem value={TransactionType.TRANSFER} id="r2" />
                                    <Label htmlFor="r2">Transfer</Label>
                                </div>
                            </RadioGroup>
                            <InputError message={errors.type}/>
                        </div>
                         {/* @todo create an AccountSelect component */}
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Account</Label>
                            <Select
                                value={data.accountId ?? undefined}
                                onValueChange={(value) => setData("accountId", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Account
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.accountId}/>
                        </div>
                        {/* @todo create a CategorySelect component */}
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Category</Label>
                            <Select
                                value={data.categoryId ?? undefined}
                                onValueChange={(value) => setData("categoryId", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Category
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.accountId}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Note</Label>
                            <Textarea
                                id="sheet-demo-name"
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
