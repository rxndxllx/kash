import { Category } from "@/types/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { useEffect, useState } from "react";

export default function SelectCategory({ value, onValueChange, disabled, className, readableValue = false }: SelectProps & { readableValue?: boolean; className?: string }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        (async () => {
            try {
                const response = await fetch(route("data.categories"));

                if (!response.ok) {
                    throw new Error("Failed to fetch categories.");
                }

                const data = await response.json();
                setCategories(data);

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
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((category) => {
                    return (
                        <SelectItem value={readableValue ? category.title : category.id.toString()} key={category.id}>
                            {category.title}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
