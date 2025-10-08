import { SharedData } from "@/types";
import { User } from "@/types/models";
import { usePage } from "@inertiajs/react";

export default function useAuth(): User {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    return auth.user;
}
