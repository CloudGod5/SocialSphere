"use client";

import { Card, CardHeader } from "@/components/ui/card";

const HomePage = () => {

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🏠 Home Page
                </p>
            </CardHeader>
        </Card>
    );
};

export default HomePage;