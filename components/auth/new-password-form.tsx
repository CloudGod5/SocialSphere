'use client';

import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react";
import * as z from "zod"
import { NewPasswordSchema } from "@/schemas"
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormField,
    FormMessage
} from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");
    
        startTransition(() => {
            newPassword(values, token)
            .then((data) => {
                if (typeof data.success === 'string') {
                    setSuccess(data.success);
                } else {
                    setSuccess(undefined);
                }
    
                if (typeof data.error === 'string') {
                    setError(data.error);
                } else {
                    setError(undefined);
                }
            });
        });
    };    

    return (
        <CardWrapper
        headerLabel="Enter a new password"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    disabled={isPending || !!success}
                                    placeholder="********"
                                    type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    disabled={isPending || !!success}
                                    placeholder="******"
                                    type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormError message ={error}/>
                    <FormSuccess message ={success}/>
                    <Button
                    disabled={isPending || !!success}
                    type='submit'
                    className="w-full"
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
};