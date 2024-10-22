import type { Metadata } from "next"
import { Work_Sans as WorkSans, Source_Serif_4 as SourceSerif4, Inter } from "next/font/google"
import SessionProvider from "~/providers/SessionProvider"
import { cn } from "~/shared/lib"
import { Toaster } from "~/shared/ui-kit/sonner"
import "~/styles/globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | Blogify",
    default: "Blogify",
  },
  description: "Create your own blog using AI tools and share it with others",
}

const workSans = WorkSans({ subsets: ["latin"], variable: "--font-work-sans" })
const sourceSerif4 = SourceSerif4({ subsets: ["latin", "cyrillic"], variable: "--font-source-serif-4" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", workSans.variable, sourceSerif4.variable, inter.variable)}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
