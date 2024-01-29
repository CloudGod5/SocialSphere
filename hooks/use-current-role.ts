import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
    const sesson = useSession();
    return sesson.data?.user?.role;
};