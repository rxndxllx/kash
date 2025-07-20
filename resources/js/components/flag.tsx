import * as Flags from "country-flag-icons/react/3x2";

export default function Flag({ countryCode }: { countryCode: string }) {
    const _Flags: Record<string, Flags.FlagComponent> = Flags;
    const FlagIcon = _Flags[countryCode]
    
    return (
         <FlagIcon className="w-5 rounded-sm"/>
    );
}
