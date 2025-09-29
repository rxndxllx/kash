import { Account } from "@/types/models";
import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { formatAmount } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { Currency } from "@/lib/enums";
import { isEmpty } from "lodash";

type SelectAccountProps = SelectProps & { id?: string; showBalance?: boolean; readableValue?: boolean; className?: string; currency?: Currency };

export default function SelectAccount({
    id,
    value,
    onValueChange,
    disabled,
    className,
    currency,
    showBalance = false,
    readableValue = false,
    ...props
}: SelectAccountProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        (async () => {
            try {
                const response = await fetch(route("data.accounts", { currency }));

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
    }, [currency]);

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            required
            disabled={loading || disabled}
            {...props}
        >
            <SelectTrigger className={className} id={id}>
                <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
                {!isEmpty(accounts) ? (
                    accounts.map((account) => {
                        const Icon = ACCOUNT_TYPE_ICON_MAP[account.type];

                        return (
                            <SelectItem
                                value={readableValue ? account.name : account.id.toString()}
                                key={account.id}
                            >
                                <Icon className="bg-sidebar-accent rounded-xl p-1 h-6 w-6" />
                                <p className="ml-0.5">
                                    {account.name}
                                    {showBalance && (
                                        <span className="ml-2 text-muted-foreground text-xs">
                                            {formatAmount(account.balance, account.currency)}
                                        </span>
                                    )}
                                </p>
                            </SelectItem>
                        );
                    })
                ) : (
                    <SelectItem value="none" disabled>
                        No accounts found.
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
}
