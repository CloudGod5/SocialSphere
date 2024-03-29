"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

const AdminPage = () => {
    const onApiRouteClick = () => [
        fetch("/api/admin")
            .then((response) => {
                if (response.ok) {
                    toast.success("Allowed API Route!")
                } else {
                    toast.error("Forbidden API Route!")
                }
            })
    ]

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🔑 Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={"ADMIN" || "COACH"}>
                    <FormSuccess message="You are an admin!"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between
                rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-md">
                        Admin-only API Route
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminPage;