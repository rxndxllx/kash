import { SelectProps } from "@radix-ui/react-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Month } from "@/lib/enums";
import { lowerCase, startCase } from "lodash";
import dayjs from "dayjs";

type BaseProps = SelectProps & { year?: string; showFuture?: true; }
type ShowFutureProps = SelectProps & { year: string; showFuture: false; }
type SelectMonthProps = BaseProps | ShowFutureProps;

export default function SelectMonth({
    value,
    onValueChange,
    disabled,
    year,
    showFuture = true,
    ...props
}: SelectMonthProps) {
    const months = Object.entries(Month)
        .filter(([, value]) => {
            if (showFuture || !year) {
                return true;
            }

            const currentYear = dayjs().year();
            const currentMonth = dayjs().month() + 1;

            if (parseInt(year) ===  currentYear && parseInt(value) > currentMonth) {
                return false;
            }

            return true;
        });

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            required
            disabled={disabled}
            {...props}
        >
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
                {months.map(([month, value]) => 
                    <SelectItem
                        value={value.toString()}
                        key={month}
                        disabled={disabled}
                    >
                        {startCase(lowerCase(month))}
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
}
