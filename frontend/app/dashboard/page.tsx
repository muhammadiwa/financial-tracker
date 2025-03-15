"use client"

import { useState, useEffect } from "react"
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
  TrendingDown,
  TrendingUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionCard } from "@/components/transaction-card"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import axios from '@/lib/axios'
import Link from "next/link"
import { format } from "date-fns"
import { id } from 'date-fns/locale'

interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: string
  color: string
}

interface DashboardData {
  transactions: Transaction[]
  summary: {
    income: number
    expense: number
    balance: number
    comparison: {
      income: number
      expense: number
      balance: number
    }
  }
}

const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const date = transaction.date.split('T')[0] // Get date part only
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    transactions: [],
    summary: {
      income: 0,
      expense: 0,
      balance: 0,
      comparison: {
        income: 0,
        expense: 0,
        balance: 0
      }
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard')
      if (response.data.status === 'success') {
        setData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data dashboard",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionClick = (transaction: Transaction) => {
    router.push(`/transactions?month=${new Date(transaction.date).getMonth() + 1}&year=${new Date(transaction.date).getFullYear()}`)
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium opacity-80">Saldo Bulan Ini</h2>
                <p className="text-3xl font-bold mt-1">{formatCurrency(data.summary.balance)}</p>
              </div>
              <div className="flex items-center space-x-2">
                {data.summary.comparison.balance > 0 ? (
                  <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm text-green-500">
                      {Math.abs(data.summary.comparison.balance)}%
                    </span>
                  </div>
                ) : data.summary.comparison.balance < 0 ? (
                  <div className="flex items-center bg-red-500/20 px-3 py-1 rounded-full">
                    <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                    <span className="text-sm text-red-500">
                      {Math.abs(data.summary.comparison.balance)}%
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-foreground/10">
                <div className="space-y-1">
                  <p className="text-xs opacity-80">Pemasukan</p>
                  <p className="font-medium">{formatCurrency(data.summary.income)}</p>
                </div>
                <div className="flex items-center">
                  {data.summary.comparison.income > 0 ? (
                    <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-sm text-green-500">
                        {Math.abs(data.summary.comparison.income)}%
                      </span>
                    </div>
                  ) : data.summary.comparison.income < 0 ? (
                    <div className="flex items-center bg-red-500/20 px-3 py-1 rounded-full">
                      <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm text-red-500">
                        {Math.abs(data.summary.comparison.income)}%
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-foreground/10">
                <div className="space-y-1">
                  <p className="text-xs opacity-80">Pengeluaran</p>
                  <p className="font-medium">{formatCurrency(data.summary.expense)}</p>
                </div>
                <div className="flex items-center">
                  {data.summary.comparison.expense > 0 ? (
                    <div className="flex items-center bg-red-500/20 px-3 py-1 rounded-full">
                      <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm text-red-500">
                        {Math.abs(data.summary.comparison.expense)}%
                      </span>
                    </div>
                  ) : data.summary.comparison.expense < 0 ? (
                    <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                      <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-sm text-green-500">
                        {Math.abs(data.summary.comparison.expense)}%
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Transaksi Terbaru</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8" 
            onClick={() => router.push("/transactions")}
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          ) : data.transactions.length > 0 ? (
            Object.entries(groupTransactionsByDate(data.transactions)).map(([date, transactions]) => (
              <div key={date} className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {format(new Date(date), 'EEEE, d MMMM yyyy', { locale: id })}
                </p>
                {transactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction.id}
                    {...transaction} 
                    onClick={() => handleTransactionClick(transaction)}
                  />
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada transaksi</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

