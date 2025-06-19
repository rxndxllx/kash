import { debounce } from "lodash";
import { useMemo, useEffect } from "react";

export default function useDebounce() {
     const debounceMemo = useMemo(() => {
        return debounce((cb: () => void) => cb(), 3000);
    }, []);
    
    useEffect(() => {
        return () => debounceMemo.cancel();
    }, [debounceMemo]);

    return debounceMemo;
}