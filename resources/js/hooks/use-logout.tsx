import { router } from "@inertiajs/react";
import { useMobileNavigation } from "./use-mobile-navigation";

export default function useLogout() {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    }

    return handleLogout;
}