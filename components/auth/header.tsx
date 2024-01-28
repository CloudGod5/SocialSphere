import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
    label: string;
}

export const Header = ({
    label,
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <h1 className={cn(
                "text-3xl font-semibold text-center mb-0",
                font.className
            )}>
                {process.env.NEXT_PUBLIC_CLUB_NAME}
            </h1>
            <p className="text-center text-sm mt-0">
                ~ SocialSphere ~
            </p>
            <p className="text-muted-foreground text-sm mt-4">
                {label}
            </p>
        </div>
    );
};