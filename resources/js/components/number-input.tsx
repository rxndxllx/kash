import { amountToFloat, formatAmount } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { REGEX } from "@/lib/constants";
import { isEmpty, isEqual } from "lodash";

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function NumberInput({ value, onChange, ...props }: Omit<InputProps, "onChange" | "value" | "type"> & {
    value: number;
    onChange: (val: number) => void;
}) {
    const [display, setDisplay] = useState("0");

    const handleChange = (input: string) => {
        /**
         * Remove amount formatting from the input before validating.
         * If the input is empty, update the form value to 0.
         * If the input is invalid, skip the change.
         */
        const sanitized = input.replaceAll(",", "");

        if (isEmpty(sanitized)) {
            onChange(0);
            return;
        }

        /**
         * @todo Fix the length checking here. It should be based on amount and not string length.
         */
        if (!REGEX.POSITIVE_DECIMAL.test(sanitized) || sanitized.length > 12) {
            return;
        }

        /**
         * If the input currently ends with a decimal point,
         * it means the user is preparing to add a decimal value
         * so it should be temporarily displayed as is without updating
         * the form value.
         */
        if (sanitized.endsWith(".")) {
            setDisplay(input);
            return;
        }

        /**
         * If the input is a valid amount string,
         * convert it into float and update the form value.
         */
        onChange(amountToFloat(sanitized));

    };

    /**
     * Auto-format the amount displayed as inputted.
     */
    useEffect(() => setDisplay(isEqual(value, 0) ? "0" : formatAmount(value)), [value]);

    return (
        <Input
            value={display}
            onChange={(e) => handleChange(e.target.value)}
            type="text"
            {...props}
        />
    );
}
