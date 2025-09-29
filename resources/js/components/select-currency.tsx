import { Currency } from "@/lib/enums";
import { CURRENCY_COUNTRY_CODE_MAP, CURRENCY_SYMBOL_MAP } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectProps } from "@radix-ui/react-select";
import Flag from "@/components/flag";
import { cn } from "@/lib/utils";

export default function SelectCurrency({
    value,
    onValueChange,
    disabled,
    className,
    symbolMode = false,
    showFlag = true,
    ...props
}: SelectProps & { className?: string; symbolMode?: boolean; showFlag?: boolean }) {
    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            required
            disabled={disabled}
            {...props}
        >
            <SelectTrigger className={cn("w-[120px]", className)}>
                {symbolMode ? (
                    <div className="flex items-center gap-2 font-bold">
                        {showFlag && <Flag countryCode={CURRENCY_COUNTRY_CODE_MAP[value as Currency]} />}
                        <span>{CURRENCY_SYMBOL_MAP[value as Currency]}</span>
                    </div>
                ) : (
                    <SelectValue placeholder="Currency" />
                )}
            </SelectTrigger>
            <SelectContent>
                {Object.values(Currency).map((currency) => {
                    const countryCode = CURRENCY_COUNTRY_CODE_MAP[currency];

                    return (
                        <SelectItem value={currency} key={currency}>
                            { showFlag && <Flag countryCode={countryCode} />}
                            <span>
                                {currency}
                                <span className="ml-1 text-muted-foreground text-xs">{CURRENCY_SYMBOL_MAP[currency]}</span>
                            </span>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
