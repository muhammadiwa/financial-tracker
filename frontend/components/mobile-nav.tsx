"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PieChart, Plus, CreditCard, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

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
    name: "Tambah",
    href: "/add-transaction",
    icon: Plus,
    isAction: true,
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
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (pathname.startsWith(item.href) && item.href !== "/dashboard")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                item.isAction && "relative -top-4",
              )}
            >
              {item.isAction ? (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg">
                  <item.icon className="h-6 w-6" />
                </div>
              ) : (
                <>
                  <item.icon className="h-5 w-5 mb-1" />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

