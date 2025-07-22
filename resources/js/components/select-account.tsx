import { Account } from "@/types/models";
import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { useEffect, useState } from "react";

export default function SelectAccount({ value, onValueChange, disabled, className, readableValue = false, ...props }: SelectProps & { readableValue?: boolean, className?: string }) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        (async () => {
            try {
                const response = await fetch(route("data.accounts"));

                if (!response.ok) {
                    throw new Error("Failed to fetch accounts.");
                }

                const data = await response.json();
                setAccounts(data);

            } catch (e) {
                console.error(e);
            }

        })();

        setLoading(false);
    }, []);

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            required
            disabled={loading || disabled}
            {...props}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => {
                    const Icon = ACCOUNT_TYPE_ICON_MAP[account.type];

                    return (
                        <SelectItem
                            value={readableValue ? account.name : account.id.toString()}
                            key={account.id}
                        >
                            <Icon className="bg-sidebar-accent rounded-xl p-1 h-6 w-6"/>
                            <p className="ml-0.5">{account.name}
                                <span className="ml-2 text-muted-foreground text-xs">{account.currency}</span>
                            </p>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
