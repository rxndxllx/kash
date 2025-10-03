import { isEmpty } from "lodash";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import Flag from "@/components/flag";

type SelectCountryProps = SelectProps & { id?: string; showFlag?: boolean; className?: string; };

export default function SelectCountry({
    id,
    value,
    onValueChange,
    disabled,
    className,
    showFlag = true,
    ...props
}: SelectCountryProps) {
    const [countries, setCountries] = useState<{ code: string; name: string; }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        (async () => {
            try {
                const response = await fetch(route("data.countries"));

                if (!response.ok) {
                    throw new Error("Failed to fetch countries.");
                }

                const data = await response.json();
                setCountries(data);

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
            <SelectTrigger className={className} id={id}>
                <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
                {!isEmpty(countries) ? (
                    countries.map((country) => {
                        return (
                            <SelectItem
                                value={country.code}
                                key={country.code}
                            >
                                { showFlag && <Flag countryCode={country.code} />}
                                <p className="ml-0.5">{country.name}</p>
                            </SelectItem>
                        );
                    })
                ) : (
                    <SelectItem value="none" disabled>
                        No countries found.
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
}
