"use client";

import { logout } from "@/actions/logout"
import { Card, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
    const user = useCurrentUser();

    const onClick = () => {
        logout();
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    📆 Events
                </p>
            </CardHeader>
        </Card>
    );
};

export default SettingsPage;