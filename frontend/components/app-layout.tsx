import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { PageTransition } from "@/components/page-transition"

interface AppLayoutProps {
  children: ReactNode
  showMobileNav?: boolean
}

export function AppLayout({ children, showMobileNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-[240px] transition-all duration-300 min-h-screen pb-16 lg:pb-0">
        <PageTransition>{children}</PageTransition>
      </div>
      {showMobileNav && <MobileNav />}
    </div>
  )
}

