"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, AlertTriangle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Breadcrumb } from "@/components/breadcrumb"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Sample categories
const sampleCategories = [
  { id: "1", name: "Makanan", type: "expense", color: "#ef4444" },
  { id: "2", name: "Transportasi", type: "expense", color: "#3b82f6" },
  { id: "3", name: "Hiburan", type: "expense", color: "#8b5cf6" },
  { id: "4", name: "Tagihan", type: "expense", color: "#f97316" },
  { id: "5", name: "Belanja", type: "expense", color: "#10b981" },
]

// Sample budgets
const sampleBudgets = [
  {
    id: "1",
    category: "Makanan",
    amount: 1500000,
    spent: 1200000,
    period: "monthly",
    color: "#ef4444",
  },
  {
    id: "2",
    category: "Transportasi",
    amount: 800000,
    spent: 500000,
    period: "monthly",
    color: "#3b82f6",
  },
  {
    id: "3",
    category: "Hiburan",
    amount: 500000,
    spent: 600000,
    period: "monthly",
    color: "#8b5cf6",
  },
  {
    id: "4",
    category: "Tagihan",
    amount: 2000000,
    spent: 1800000,
    period: "monthly",
    color: "#f97316",
  },
]

export default function BudgetPage() {
  const [budgets, setBudgets] = useState(sampleBudgets)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "monthly",
  })
  const [editingBudget, setEditingBudget] = useState<{
    id: string
    category: string
    amount: string
    period: string
  } | null>(null)
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const handleAddBudget = () => {
    if (!newBudget.category) {
      toast({
        title: "Kategori diperlukan",
        description: "Silakan pilih kategori",
        variant: "destructive",
      })
      return
    }

    if (!newBudget.amount || Number.parseFloat(newBudget.amount) <= 0) {
      toast({
        title: "Jumlah anggaran tidak valid",
        description: "Silakan masukkan jumlah anggaran yang valid",
        variant: "destructive",
      })
      return
    }

    const id = (budgets.length + 1).toString()
    const category = sampleCategories.find((c) => c.name === newBudget.category)

    setBudgets([
      ...budgets,
      {
        id,
        category: newBudget.category,
        amount: Number.parseFloat(newBudget.amount),
        spent: 0,
        period: newBudget.period,
        color: category?.color || "#6b7280",
      },
    ])

    setNewBudget({
      category: "",
      amount: "",
      period: "monthly",
    })

    setIsAddDialogOpen(false)

    toast({
      title: "Anggaran ditambahkan",
      description: `Anggaran untuk ${newBudget.category} berhasil ditambahkan`,
    })
  }

  const handleEditBudget = () => {
    if (!editingBudget) return

    if (!editingBudget.category) {
      toast({
        title: "Kategori diperlukan",
        description: "Silakan pilih kategori",
        variant: "destructive",
      })
      return
    }

    if (!editingBudget.amount || Number.parseFloat(editingBudget.amount) <= 0) {
      toast({
        title: "Jumlah anggaran tidak valid",
        description: "Silakan masukkan jumlah anggaran yang valid",
        variant: "destructive",
      })
      return
    }

    const category = sampleCategories.find((c) => c.name === editingBudget.category)

    setBudgets(
      budgets.map((budget) =>
        budget.id === editingBudget.id
          ? {
              ...budget,
              category: editingBudget.category,
              amount: Number.parseFloat(editingBudget.amount),
              period: editingBudget.period,
              color: category?.color || budget.color,
            }
          : budget,
      ),
    )

    setIsEditDialogOpen(false)

    toast({
      title: "Anggaran diperbarui",
      description: `Anggaran untuk ${editingBudget.category} berhasil diperbarui`,
    })
  }

  const handleDeleteBudget = () => {
    if (!deletingBudgetId) return

    const budgetToDelete = budgets.find((b) => b.id === deletingBudgetId)
    setBudgets(budgets.filter((budget) => budget.id !== deletingBudgetId))
    setDeletingBudgetId(null)

    toast({
      title: "Anggaran dihapus",
      description: `Anggaran untuk ${budgetToDelete?.category} berhasil dihapus`,
    })
  }

  const openEditDialog = (budget: (typeof budgets)[0]) => {
    setEditingBudget({
      id: budget.id,
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    })
    setIsEditDialogOpen(true)
  }

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Anggaran</h1>
          <div className="ml-auto">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Tambah Anggaran</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Anggaran Baru</DialogTitle>
                  <DialogDescription>Buat anggaran baru untuk kategori pengeluaran Anda</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Kategori
                    </label>
                    <Select
                      value={newBudget.category}
                      onValueChange={(value) => setNewBudget({ ...newBudget, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Jumlah Anggaran
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">Rp</span>
                      <Input
                        id="amount"
                        type="number"
                        value={newBudget.amount}
                        onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                        className="pl-10"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="period" className="text-sm font-medium">
                      Periode
                    </label>
                    <Select
                      value={newBudget.period}
                      onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                        <SelectItem value="yearly">Tahunan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleAddBudget}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />

        {/* Total Budget Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Total Anggaran</h2>
                <p className="text-muted-foreground">Periode: Bulanan</p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                <p className="text-muted-foreground">
                  Terpakai: {formatCurrency(totalSpent)} ({totalPercentage.toFixed(0)}%)
                </p>
              </div>
            </div>

            <Progress
              value={totalPercentage > 100 ? 100 : totalPercentage}
              className={`h-3 ${totalPercentage > 90 ? "bg-red-500" : totalPercentage > 75 ? "bg-yellow-500" : "bg-green-500"}`}
            />

            {totalPercentage > 90 && (
              <div className="flex items-center mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Anda telah menggunakan {totalPercentage.toFixed(0)}% dari total anggaran Anda.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100
            const isOverBudget = percentage > 100

            return (
              <Card key={budget.id} className="overflow-hidden">
                <div
                  className="h-1"
                  style={{
                    backgroundColor: budget.color,
                    width: `${percentage > 100 ? 100 : percentage}%`,
                  }}
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: budget.color }}
                      >
                        <span className="text-white text-xs font-bold">{budget.category.substring(0, 1)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{budget.category}</h3>
                        <p className="text-xs text-muted-foreground">
                          {budget.period === "weekly"
                            ? "Mingguan"
                            : budget.period === "monthly"
                              ? "Bulanan"
                              : "Tahunan"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(budget)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setDeletingBudgetId(budget.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Anggaran</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus anggaran ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteBudget}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Terpakai</span>
                      <span className={isOverBudget ? "text-red-600 dark:text-red-400" : ""}>
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage > 100 ? 100 : percentage}
                      className={`h-2 ${
                        isOverBudget ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span
                        className={`${
                          isOverBudget
                            ? "text-red-600 dark:text-red-400"
                            : percentage > 75
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                      <span className="text-muted-foreground">
                        {isOverBudget
                          ? `Melebihi anggaran sebesar ${formatCurrency(budget.spent - budget.amount)}`
                          : `Tersisa ${formatCurrency(budget.amount - budget.spent)}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada anggaran yang dibuat</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Anggaran
                </Button>
              </DialogTrigger>
              <DialogContent>{/* Dialog content same as above */}</DialogContent>
            </Dialog>
          </div>
        )}
      </main>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Anggaran</DialogTitle>
            <DialogDescription>Ubah detail anggaran</DialogDescription>
          </DialogHeader>
          {editingBudget && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Kategori
                </label>
                <Select
                  value={editingBudget.category}
                  onValueChange={(value) => setEditingBudget({ ...editingBudget, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-amount" className="text-sm font-medium">
                  Jumlah Anggaran
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">Rp</span>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={editingBudget.amount}
                    onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                    className="pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-period" className="text-sm font-medium">
                  Periode
                </label>
                <Select
                  value={editingBudget.period}
                  onValueChange={(value) => setEditingBudget({ ...editingBudget, period: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditBudget}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

