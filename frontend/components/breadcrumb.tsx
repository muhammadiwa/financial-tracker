"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Buda } from "next/font/google"
import { tr } from "date-fns/locale"

const routeNameMap: Record<string, string> = {
  dashboard: "Beranda",
  statistics: "Statistik",
  "add-transaction": "Tambah Transaksi",
  reports: "Laporan",
  settings: "Pengaturan",
  categories: "Kategori",
  budget: "Anggaran",
  transactions: "Transaksi",
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Skip rendering for dashboard
  if (pathname === "/dashboard") {
    return null
  }

  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <Link href="/dashboard" className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Beranda</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`
        const isLast = index === pathSegments.length - 1

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground">{routeNameMap[segment] || segment}</span>
            ) : (
              <Link href={path} className={cn("hover:text-foreground", isLast && "text-foreground font-medium")}>
                {routeNameMap[segment] || segment}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

