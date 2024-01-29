"use client";

import { Card, CardHeader } from "@/components/ui/card";

const SettingsPage = () => {

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️ Settings
                </p>
            </CardHeader>
        </Card>
    );
};

export default SettingsPage;