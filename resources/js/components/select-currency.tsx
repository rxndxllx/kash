import { Currency } from "@/lib/enums";
import { CURRENCY_COUNTRY_CODE_MAP } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectProps } from "@radix-ui/react-select";
import Flag from "@/components/flag";

export default function SelectCurrency({ value, onValueChange, disabled }: SelectProps) {
    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            required
            disabled={disabled}
        >
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
                {Object.values(Currency).map((currency) => {
                    const countryCode = CURRENCY_COUNTRY_CODE_MAP[currency];

                    return (
                        <SelectItem value={currency} key={currency}>
                            <Flag countryCode={countryCode} />
                            <span>{currency}</span>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
