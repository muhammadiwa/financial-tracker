"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, PieChart, Plus, CreditCard, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { TransactionDialog } from "@/components/transaction-dialog"
import axios from '@/lib/axios'

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
}

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories')
      if (response.data.status === 'success') {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = item.href ? (pathname === item.href || 
              (pathname.startsWith(item.href) && item.href !== "/dashboard")) : false

            if (item.isAction) {
              return (
                <button
                  key="add-transaction"
                  onClick={() => setIsAddDialogOpen(true)}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full text-xs relative -top-4"
                  )}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg">
                    <item.icon className="h-6 w-6" />
                  </div>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full text-xs",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <TransactionDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        categories={categories}
        onSuccess={() => {
          setIsAddDialogOpen(false)
          window.location.reload() // Refresh data after adding transaction
        }}
      />
    </>
  )
}

