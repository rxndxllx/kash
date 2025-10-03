import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { useState } from "react";

type DatePickerProps = {
    value: string;
    onValueChange: (value: Date) => void;
    align?: PopoverContentProps["align"];
    className?: string;
    required?: boolean;
}
export default function DatePicker({
    value,
    onValueChange,
    align = "start",
    className,
}: DatePickerProps ) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className={cn("data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal bg-none dark:bg-transparent dark:hover:bg-transparent hover:bg-transparent hover:text-white", className)}
                >
                    <CalendarIcon />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={align}>
                <Calendar
                    className="w-[250px]"
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={onValueChange}
                    required
                    captionLayout="dropdown"
                    onDayClick={() => setOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}
