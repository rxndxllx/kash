import { cn } from "@/lib/utils";
import * as Flags from "country-flag-icons/react/3x2";

export default function Flag({ countryCode, className }: { countryCode: string; className?: string }) {
    const _Flags: Record<string, Flags.FlagComponent> = Flags;
    const FlagIcon = _Flags[countryCode]
    
    return (
         <FlagIcon className={cn("w-5 rounded-sm", className)}/>
    );
}
