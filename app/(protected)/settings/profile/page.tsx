"use client";

import * as z from "zod";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRoles } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
    const user = useCurrentUser();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            userName: undefined,
        }
    });

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((data) => {
                    if (data.error) {
                    setError(data.error);
                    }

                    if (data.success) {
                    update();
                    setSuccess(data.success);
                    }
                })
                .catch(() => setError("Something went wrong"));
        });
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️ Profile Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField 
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input 
                                            {...field}
                                            placeholder={user?.userName || undefined}
                                            disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormSuccess message={success}/>
                        <FormError message={error}/>
                        <Button
                            disabled={isPending}
                            type="submit"
                        >
                            Update Settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SettingsPage;