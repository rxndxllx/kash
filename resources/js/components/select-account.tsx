import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Account } from "@/types/models";
import { SelectProps } from "@radix-ui/react-select";
import * as Flags from "country-flag-icons/react/3x2";

export default function SelectAccount({ accounts, value, onValueChange }: { accounts: Account[] } & SelectProps ) {
    const _Flags: Record<string, Flags.FlagComponent> = Flags;

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            required
        >
            <SelectTrigger>
                <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => {
                    const countryCode = (account.currency_country_code || "PH");
                    const Flag = _Flags[countryCode];

                    return (
                        <SelectItem value={`${account.id}`} key={account.id}>
                            <Flag className="w-5 rounded-sm"/>
                            {account.name}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
