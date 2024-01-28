import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const sesson = useSession();
    return sesson.data?.user;
};