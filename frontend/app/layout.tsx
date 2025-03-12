import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthCheck } from '@/components/auth-check'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Money Record - Pencatatan Keuangan Pribadi",
  description: "Aplikasi pencatatan keuangan pribadi yang mudah digunakan",
    generator: 'muhammadiwa.web.id'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-y-auto">
        <AuthCheck>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthCheck>
      </body>
    </html>
  )
}