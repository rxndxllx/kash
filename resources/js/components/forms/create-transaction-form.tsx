import { Button } from "@/components/ui/button";
import { Category } from "@/types/models";
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
import SelectAccount from "@/components/select-account";

type CreateTransactionForm = {
    note: string;
    transacted_at: string;
    amount: number;
    account_id: string;
    category_id: string;
    type: TransactionType;
};

export default function CreateTransactionFormSheet({ categories }: { categories: Category[] }) {
    const { data, setData, post, errors, reset, processing } = useForm<Required<CreateTransactionForm>>({
            note: "",
            transacted_at: "",
            amount: 0,
            account_id: "",
            category_id: "",
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
                                placeholder="0"
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
                                    <RadioGroupItem value={TransactionType.TRANSFER} id="r3" />
                                    <Label htmlFor="r3">Transfer</Label>
                                </div>
                            </RadioGroup>
                            <InputError message={errors.type}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Account</Label>
                            <SelectAccount
                                required
                                value={data.account_id ?? undefined}
                                onValueChange={(value) => setData("account_id", value)}
                            />
                            <InputError message={errors.account_id}/>
                        </div>
                        {/* @todo create a CategorySelect component */}
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Category</Label>
                            <Select
                                value={data.category_id ?? undefined}
                                onValueChange={(value) => setData("category_id", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem value={`${category.id}`} key={category.id}>
                                            {category.title}
                                        </SelectItem>
                                    ))}
                                    
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Note</Label>
                            <Textarea
                                id="sheet-demo-name"
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
