import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { useState } from "react";

type DatePickerProps = {
    value: string;
    onValueChange: (value: string) => void;
    align?: PopoverContentProps["align"];
    withTime?: boolean;
    className?: string;
    required?: boolean;
}
export default function DatePicker({
    value,
    onValueChange,
    align = "start",
    withTime = false,
    className,
}: DatePickerProps ) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(value ? format(new Date(value), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    const [time, setTime] = useState(value ? format(new Date(value), "HH:mm:ss") : format(new Date(), "HH:mm:ss"));

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Popover open={open} onOpenChange={setOpen} modal>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!value}
                        className={cn("data-[empty=true]:text-muted-foreground flex-2 justify-start text-left font-normal bg-none dark:bg-transparent dark:hover:bg-transparent hover:bg-transparent dark:hover:text-white", className)}
                    >
                        <CalendarIcon />
                        {value ? format(value, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={align}>
                    <Calendar
                        className="w-[250px]"
                        mode="single"
                        selected={new Date(date)}
                        onSelect={(value) => {
                            const formattedDate = format(value, "yyyy-MM-dd");
                            setDate(formattedDate);
                            onValueChange(`${formattedDate} ${time}`);
                        }}
                        required
                        captionLayout="dropdown"
                        onDayClick={() => setOpen(false)}
                    />
                </PopoverContent>
            </Popover>
            { withTime && (
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                        onValueChange(`${date} ${e.target.value}`);
                    }}
                    className="bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none flex-1 text-sm"
                />
            )}
        </div>
    );
}
