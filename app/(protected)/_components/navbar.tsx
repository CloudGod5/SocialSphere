"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();
    const user = useCurrentUser();

    return (
        <nav className="bg-secondary flex justify-between 
        items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                <Button
                    asChild
                    variant={pathname === "/client" ? "default" : "outline"}
                >
                    <Link href="/client">
                        Client
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === "/server" ? "default" : "outline"}
                >
                    <Link href="/server">
                        Server
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === "/admin" ? "default" : "outline"}
                >
                    <Link href="/admin">
                        Admin
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === "/settings/account" ? "default" : "outline"}
                >
                    <Link href="/settings/account">
                        Account Settings
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === "/settings/profile" ? "default" : "outline"}
                >
                    <Link href="/settings/profile">
                        Profile Settings
                    </Link>
                </Button>
            </div>
            <UserButton />
        </nav>
    );
};