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
            name: undefined,
            userName: undefined,
            phoneNumber: undefined,
            email: undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
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
                    ⚙️ Account Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                            {...field}
                                            placeholder={user?.name || undefined}
                                            disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormField 
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input 
                                            {...field}
                                            placeholder={user?.phoneNumber || undefined}
                                            disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                            {...field}
                                            placeholder={user?.email || undefined}
                                            disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRoles.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={UserRoles.COACH}>Coach</SelectItem>
                                                <SelectItem value={UserRoles.PARENT}>Parent</SelectItem>
                                                <SelectItem value={UserRoles.USER}>User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {user?.isOAuth === false && (
                            <>
                                <FormItem className="items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <FormField 
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormDescription>Enter your current password</FormDescription>
                                            <FormControl>
                                            <Input 
                                                {...field}
                                                type="password"
                                                placeholder={"********" || undefined}
                                                disabled={isPending}
                                            />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                        <FormItem >
                                            <FormLabel></FormLabel>
                                            <FormDescription>Enter your new password</FormDescription>
                                            <FormControl>
                                            <Input 
                                                {...field}
                                                type="password"
                                                placeholder={"********" || undefined}
                                                disabled={isPending}
                                            />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </FormItem>
                                <FormField 
                                    control={form.control}
                                    name="isTwoFactorEnabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center
                                        justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Two Factor Authentication</FormLabel>
                                                <FormDescription>Enable two factor authentication for your account</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    disabled={isPending}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                            )}
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