"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  ChevronRight,
  Filter,
  Settings,
  Tag,
  FileText,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionCard } from "@/components/transaction-card"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Sample data
const sampleTransactions = [
  {
    id: "1",
    amount: 1500000,
    type: "income",
    category: "Gaji",
    description: "Gaji bulan Maret",
    date: "2023-03-25",
  },
  {
    id: "2",
    amount: 50000,
    type: "expense",
    category: "Makanan",
    description: "Makan siang",
    date: "2023-03-26",
  },
  {
    id: "3",
    amount: 200000,
    type: "expense",
    category: "Transportasi",
    description: "Bensin",
    date: "2023-03-27",
  },
  {
    id: "4",
    amount: 300000,
    type: "income",
    category: "Freelance",
    description: "Proyek desain",
    date: "2023-03-28",
  },
  {
    id: "5",
    amount: 100000,
    type: "expense",
    category: "Hiburan",
    description: "Nonton bioskop",
    date: "2023-03-29",
  },
]

export default function DashboardPage() {
  const [transactions, setTransactions] = useState(sampleTransactions)
  const router = useRouter()
  const { toast } = useToast()

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const handleEdit = (id: string) => {
    router.push(`/edit-transaction/${id}`)
  }

  const handleDelete = (id: string) => {
    toast({
      title: "Transaksi dihapus",
      description: "Transaksi berhasil dihapus",
    })
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-xl font-bold lg:hidden">Money Record</h1>
          <div className="lg:ml-auto flex items-center gap-2">
            <Link href="/categories">
              <Button variant="ghost" size="icon">
                <Tag className="h-5 w-5" />
                <span className="sr-only">Kategori</span>
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" size="icon">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Laporan</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifikasi</span>
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Pengaturan</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Card className="bg-primary text-primary-foreground mb-6">
          <CardContent className="p-6">
            <h2 className="text-sm font-medium opacity-80">Saldo Saat Ini</h2>
            <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-green-500/20">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs opacity-80">Pemasukan</p>
                  <p className="font-medium">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-red-500/20">
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs opacity-80">Pengeluaran</p>
                  <p className="font-medium">{formatCurrency(totalExpense)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Transaksi Terbaru</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => router.push("/transactions")}>
              Lihat Semua
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div>
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} {...transaction} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </div>
  )
}

