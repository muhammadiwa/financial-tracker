"use client"

import { useState, useEffect, useMemo } from "react"
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
import { groupTransactionsByDate } from "@/lib/utils"
import { HeaderMenu } from "@/components/header-menu"
import axios from '@/lib/axios'
import { TransactionDialog } from "@/components/transaction-dialog"
import { TransactionDetailDialog } from "@/components/transaction-detail-dialog"
import { MonthYearPicker } from "@/components/month-year-picker"
import * as XLSX from 'xlsx'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

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
  const [sortOrder, setSortOrder] = useState("newest")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [displayTransactions, setDisplayTransactions] = useState<Transaction[]>([])

  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date()
    return {
      month: (now.getMonth() + 1).toString().padStart(2, '0'),
      year: now.getFullYear().toString()
    }
  })

  const router = useRouter()
  const { toast } = useToast()

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/transactions', {
        params: {
          month: monthYear.month,
          year: monthYear.year
        }
      })
      
      if (response.data.status === 'success') {
        console.log('Fetched transactions:', response.data.data) // Debug log
        setTransactions(response.data.data)
        setFilteredTransactions(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
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

  // Fetch data on component mount
  useEffect(() => {
    const init = async () => {
      await fetchCategories()
      await fetchTransactions()
    }
    init()
  }, [])

  // Refetch transactions when monthYear changes
  useEffect(() => {
    fetchTransactions()
  }, [monthYear])

  // Calculate summary from all transactions, not filtered ones
  const summaryTotals = useMemo(() => {
    const income = transactions.filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = transactions.filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      income,
      expense,
      balance: income - expense
    }
  }, [transactions]) // Only recalculate when all transactions change

  // Filter transactions for display
  useEffect(() => {
    let result = [...transactions]

    // Filter by type
    if (activeTab !== "all") {
      result = result.filter((t) => t.type === activeTab)
    }

    // Apply other filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) => t.description?.toLowerCase().includes(query) || 
               t.category.toLowerCase().includes(query)
      )
    }

    if (categoryFilter) {
      result = result.filter((t) => t.category === categoryFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      switch (sortOrder) {
        case "newest": return dateB.getTime() - dateA.getTime()
        case "oldest": return dateA.getTime() - dateB.getTime()
        case "highest": return b.amount - a.amount
        case "lowest": return a.amount - b.amount
        default: return 0
      }
    })

    setDisplayTransactions(result)
  }, [transactions, activeTab, searchQuery, categoryFilter, sortOrder])

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
    try {
      const startDate = startOfMonth(new Date(Number(monthYear.year), Number(monthYear.month) - 1))
      const endDate = endOfMonth(startDate)
      const wb = XLSX.utils.book_new()
  
      // Format currency for Excel
      const formatExcelCurrency = (amount: number) => {
        return amount || 0
      }
  
      // Create header data
      const headerData = [
        ['Data Transaksi'],
        [],
        ['Periode', `${format(startDate, "d MMMM", { locale: id })} - ${format(endDate, "d MMMM yyyy", { locale: id })}`],
        ['Pemasukan', formatExcelCurrency(summaryTotals.income)],
        ['Pengeluaran', formatExcelCurrency(summaryTotals.expense)],
        ['Saldo', formatExcelCurrency(summaryTotals.balance)],
        ['Saldo bawaan', 0],
        [],
        ['Rincian Transaksi:'],
        []
      ]
  
      // Create table headers
      const tableHeaders = ['No', 'Tanggal', 'Keterangan', 'Pengeluaran', 'Pemasukan', 'Kategori']
  
      // Prepare transaction data
      const transactionData = displayTransactions
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((transaction, index) => [
          index + 1,
          format(parseISO(transaction.date), "d MMMM yyyy", { locale: id }),
          transaction.description || '-',
          transaction.type === 'expense' ? transaction.amount : 0,
          transaction.type === 'income' ? transaction.amount : 0,
          transaction.category
        ])
  
      // Combine all data
      const wsData = [
        ...headerData,
        tableHeaders,
        ...transactionData
      ]
  
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData)
  
      // Calculate max width for columns
      const maxWidths = {
        A: Math.max(...wsData.map(row => String(row[0] || '').length)),
        B: Math.max(...wsData.map(row => String(row[1] || '').length)),
        C: Math.max(...wsData.map(row => String(row[2] || '').length)),
        D: Math.max(...wsData.map(row => String(row[3] || '').length)),
        E: Math.max(...wsData.map(row => String(row[4] || '').length)),
        F: Math.max(...wsData.map(row => String(row[5] || '').length))
      }
  
      // Set column widths with padding
      ws['!cols'] = [
        { wch: maxWidths.A + 2 },  // No
        { wch: maxWidths.B + 2 },  // Tanggal
        { wch: maxWidths.C + 5 },  // Keterangan
        { wch: maxWidths.D + 5 },  // Pengeluaran
        { wch: maxWidths.E + 5 },  // Pemasukan
        { wch: maxWidths.F + 2 }   // Kategori
      ]
  
      // Get the range of cells
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  
      const defaultStyle = {
        font: { name: 'Arial', sz: 10 },
        alignment: { vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }
  
      // Style all cells
      for (let R = 0; R <= range.e.r; R++) {
        for (let C = 0; C <= range.e.c; C++) {
          const cell = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[cell]) ws[cell] = {}
  
          // Style title
          if (R === 0) {
            ws[cell].s = {
              font: { bold: true, sz: 14 },
              alignment: { horizontal: 'left', vertical: 'center' }
            }
          }
          // Style summary section headers
          else if (R >= 3 && R <= 6 && C === 0) {
            ws[cell].s = {
              font: { bold: true, sz: 10 },
              alignment: { horizontal: 'left', vertical: 'center' }
            }
          }
          // Style summary section values
          else if (R >= 3 && R <= 6 && C === 1) {
            ws[cell].s = {
              font: { sz: 10 },
              alignment: { horizontal: 'right', vertical: 'center' },
              numFmt: '#,##0'
            }
          }
          // Style "Rincian Transaksi" header
          else if (R === 8) {
            ws[cell].s = {
              font: { bold: true, sz: 10 },
              alignment: { horizontal: 'left', vertical: 'center' }
            }
          }
          // Style table headers
          else if (R === headerData.length) {
            ws[cell].s = {
              ...defaultStyle,
              font: { ...defaultStyle.font, bold: true },
              fill: { fgColor: { rgb: 'EEEEEE' } },
              alignment: { horizontal: 'center', vertical: 'center' }
            }
          }
          // Style table data
          else if (R > headerData.length) {
            ws[cell].s = {
              ...defaultStyle,
              alignment: {
                horizontal: C === 3 || C === 4 ? 'right' : 'left',
                vertical: 'center'
              }
            }
  
            // Format currency columns
            if (C === 3 || C === 4) {
              ws[cell].z = '#,##0'
            }
          }
        }
      }
  
      // Merge title cell
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } } // Merge first row across all columns
      ]
  
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transaksi')
  
      // Generate Excel file
      const fileName = `transaksi_${format(startDate, "MMMM_yyyy", { locale: id })}.xlsx`
      XLSX.writeFile(wb, fileName)
  
      toast({
        title: "Data diekspor",
        description: "Data transaksi berhasil diekspor ke Excel",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengekspor data",
        duration: 3000,
      })
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("")
    const now = new Date()
    setMonthYear({
      month: (now.getMonth() + 1).toString().padStart(2, '0'),
      year: now.getFullYear().toString()
    })
    setActiveTab("all")
    setSortOrder("newest")
  }

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailDialogOpen(true)
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
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(summaryTotals.income)}</p>
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
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(summaryTotals.expense)}</p>
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
                      summaryTotals.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(summaryTotals.balance)}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${
                    summaryTotals.balance >= 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {summaryTotals.balance >= 0 ? (
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
                <DropdownMenuContent align="end" className="w-[280px]">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Periode</p>
                    <MonthYearPicker 
                      value={monthYear}
                      onChange={(value) => {
                        setMonthYear(value)
                      }}
                    />
                  </div>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => {
                        const now = new Date()
                        setMonthYear({
                          month: (now.getMonth() + 1).toString().padStart(2, '0'),
                          year: now.getFullYear().toString()
                        })
                        setCategoryFilter("")
                      }}
                    >
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
          ) : displayTransactions.length > 0 ? (
            Object.entries(groupTransactionsByDate(displayTransactions)).map(([date, transactions]) => (
              <div key={date} className="space-y-4">
                <div className="sticky top-14 z-20 -mx-4 px-4 py-2 bg-muted/50 backdrop-blur-sm">
                  <h2 className="text-sm font-medium text-muted-foreground">{date}</h2>
                </div>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      {...transaction}
                      onClick={() => handleTransactionClick(transaction)}
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
      <TransactionDetailDialog 
        transaction={selectedTransaction}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        categories={categories}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}

