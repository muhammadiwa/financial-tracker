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
  {
    id: "6",
    amount: 75000,
    type: "expense",
    category: "Makanan",
    description: "Belanja bulanan",
    date: "2023-03-30",
  },
  {
    id: "7",
    amount: 250000,
    type: "expense",
    category: "Tagihan",
    description: "Tagihan internet",
    date: "2023-03-31",
  },
  {
    id: "8",
    amount: 500000,
    type: "income",
    category: "Hadiah",
    description: "Bonus kerja",
    date: "2023-04-01",
  },
]

// Sample categories
const categories = [
  { id: "1", name: "Makanan", type: "expense" },
  { id: "2", name: "Transportasi", type: "expense" },
  { id: "3", name: "Hiburan", type: "expense" },
  { id: "4", name: "Tagihan", type: "expense" },
  { id: "5", name: "Belanja", type: "expense" },
  { id: "6", name: "Gaji", type: "income" },
  { id: "7", name: "Freelance", type: "income" },
  { id: "8", name: "Hadiah", type: "income" },
  { id: "9", name: "Investasi", type: "income" },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(sampleTransactions)
  const [filteredTransactions, setFilteredTransactions] = useState(sampleTransactions)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [sortOrder, setSortOrder] = useState("newest")

  const router = useRouter()
  const { toast } = useToast()

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

  const handleDelete = (id: string) => {
    toast({
      title: "Transaksi dihapus",
      description: "Transaksi berhasil dihapus",
    })
    setTransactions(transactions.filter((t) => t.id !== id))
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
          {Object.keys(groupedTransactions).length > 0 ? (
              Object.entries(groupedTransactions as Record<string, typeof sampleTransactions>).map(([date, transactions]) => (
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
              <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

