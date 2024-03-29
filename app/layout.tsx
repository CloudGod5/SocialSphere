import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
const inter = Inter({ subsets: ['latin'] })
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: 'SocialSphere',
  description: 'SocialSphere is a social media platform for developers.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
