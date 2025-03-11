"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PieChart, Plus, FileText, Settings, Menu, X, LogOut, CreditCard, Tag, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
  {
    name: "Beranda",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Transaksi",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    name: "Kategori",
    href: "/categories",
    icon: Tag,
  },
  {
    name: "Anggaran",
    href: "/budget",
    icon: DollarSign,
  },
  {
    name: "Statistik",
    href: "/statistics",
    icon: PieChart,
  },
  {
    name: "Tambah Transaksi",
    href: "/add-transaction",
    icon: Plus,
    highlight: true,
  },
  {
    name: "Laporan",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
        setIsMobileOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari akun",
    })
    router.push("/login")
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-background border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[240px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-14 flex items-center px-4 border-b">
            <h1
              className={cn(
                "font-bold transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
              )}
            >
              Money Record
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.highlight && !isCollapsed && "bg-primary/10",
                  isCollapsed && "justify-center",
                )}
              >
                <item.icon
                  className={cn("h-5 w-5 transition-all", item.highlight && pathname !== item.href && "text-primary")}
                />
                <span
                  className={cn(
                    "ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between">
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Keluar">
                <LogOut className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

