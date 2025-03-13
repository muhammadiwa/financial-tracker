"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ArrowUpDown, Download, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionCard } from "@/components/transaction-card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Breadcrumb } from "@/components/breadcrumb"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { groupTransactionsByDate } from "@/lib/utils"
import { HeaderMenu } from "@/components/header-menu"
import axios from '@/lib/axios'
import { TransactionDialog } from "@/components/transaction-dialog"

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  category_id: string;
  color: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [sortOrder, setSortOrder] = useState("newest")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const init = async () => {
      await fetchCategories()
      await fetchTransactions()
    }
    init()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/transactions')
      if (response.data.status === 'success') {
        setTransactions(response.data.data)
        setFilteredTransactions(response.data.data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat transaksi",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories')
      if (response.data.status === 'success') {
        setCategories(response.data.data)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat kategori",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat kategori",
        duration: 3000,
      })
    }
  }

  // Filter and sort transactions
  useEffect(() => {
    let result = [...transactions]

    // Filter by type
    if (activeTab !== "all") {
      result = result.filter((t) => t.type === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) => t.description.toLowerCase().includes(query) || t.category.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (categoryFilter) {
      result = result.filter((t) => t.category === categoryFilter)
    }

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      result = result.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate >= fromDate && transactionDate <= toDate
      })
    }

    // Sort transactions
    result.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime()
      } else if (sortOrder === "oldest") {
        return dateA.getTime() - dateB.getTime()
      } else if (sortOrder === "highest") {
        return b.amount - a.amount
      } else if (sortOrder === "lowest") {
        return a.amount - b.amount
      }

      return 0
    })

    setFilteredTransactions(result)
  }, [transactions, activeTab, searchQuery, categoryFilter, dateRange, sortOrder])

  const handleEdit = (id: string) => {
    router.push(`/edit-transaction/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/transactions/${id}`)
      
      toast({
        title: "Transaksi dihapus",
        description: "Transaksi berhasil dihapus",
        duration: 3000,
      })
      
      fetchTransactions() // Refresh data
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus transaksi",
        duration: 3000,
      })
    }
  }

  const handleExport = () => {
    toast({
      title: "Data diekspor",
      description: "Data transaksi berhasil diekspor ke CSV",
    })
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("")
    setDateRange({ from: null, to: null })
    setActiveTab("all")
    setSortOrder("newest")
  }

  // Calculate summary
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Transaksi</h1>
          <HeaderMenu />
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                  <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p
                    className={`text-2xl font-bold ${
                      balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${
                    balance >= 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {balance >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {/* Added Export button here */}
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Ekspor</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Kategori</p>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua kategori</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2 border-t">
                    <p className="text-sm font-medium mb-2">Rentang Tanggal</p>
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleClearFilters}>
                      Reset Filter
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("newest")}>Terbaru</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("oldest")}>Terlama</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("highest")}>Nominal Tertinggi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("lowest")}>Nominal Terendah</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transaction List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat transaksi...</p>
            </div>
          ) : Object.keys(groupedTransactions).length > 0 ? (
              Object.entries(groupedTransactions as Record<string, Transaction[]>).map(([date, transactions]) => (
                <div key={date} className="space-y-4">
                  <div className="sticky top-14 z-20 -mx-4 px-4 py-2 bg-muted/50 backdrop-blur-sm">
                    <h2 className="text-sm font-medium text-muted-foreground">{date}</h2>
                  </div>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        {...transaction}
                        onClick={() => router.push(`/transactions/${transaction.id}`)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada transaksi yang ditemukan</p>
            </div>
          )}
        </div>
      </main>
      <TransactionDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        categories={categories}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}

