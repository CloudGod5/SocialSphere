'use client';

import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react";
import * as z from "zod"
import {LoginSchema} from "@/schemas"
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
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked"
        ? "Email already registered with an account!"
        : "";
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
    
        startTransition(() => {
            login(values, callbackUrl)
            .then((data) => {
                if (data?.error) {
                    form.reset();
                    if (typeof data.error === 'string') {
                        setError(data.error);
                    } else {
                        setError(undefined);
                    }
                }
                if (data?.success) {
                    form.reset();
                    if (typeof data.success === 'string') {
                        setSuccess(data.success);
                    } else {
                        setSuccess(undefined);
                    }
                }
                if (data?.twoFactor) {
                    setShowTwoFactor(true);
                }
            })
            .catch((error) => {"Something went wrong!"});
        });
    };    

    return (
        <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/auth/register"
        showSocial={process.env.NEXT_PUBLIC_SOCIAL_SSO === 'true'}
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField 
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isPending}
                                        placeholder="123456"
                                        pattern="[0-9]*"
                                        onInput={(event) => {
                                            let input = event.target as HTMLInputElement;
                                            if (input.value.length > 6) {
                                            input.value = input.value.slice(0, 6);
                                            }
                                        }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            )}
                    {!showTwoFactor && (
                        <>
                            <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isPending}
                                        placeholder="john.doe@example.com"
                                        type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField  
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isPending}
                                        placeholder="********"
                                        type="password"
                                        />
                                    </FormControl>
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/auth/reset">
                                            Forgot password?
                                        </Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </> 
                    )}  
                    </div>
                    <FormError message ={error || urlError}/>
                    <FormSuccess message ={success}/>
                    <Button
                    disabled={isPending}
                    type='submit'
                    className="w-full"
                    >
                        {showTwoFactor ? "Verify" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
};