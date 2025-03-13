"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Transaction, Category } from "@/types/transaction"
import { Trash2 } from "lucide-react"
import axios from '@/lib/axios'
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface TransactionDetailDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess: () => void
}

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
  categories,
  onSuccess
}: TransactionDetailDialogProps) {
  // Add state for delete confirmation dialog
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  // Set form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setAmount(String(transaction.amount))
      setCategory(String(transaction.category_id))
      setDescription(transaction.description || '')
      setDate(transaction.date)
    }
  }, [transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transaction) return

    setIsLoading(true)

    try {
      await axios.put(`/transactions/${transaction.id}`, {
        type,
        amount: Number(amount),
        category_id: category,
        description,
        date,
      })

      toast({
        title: "Transaksi berhasil diperbarui",
        description: `${type === "income" ? "Pemasukan" : "Pengeluaran"} sebesar Rp${amount} telah diperbarui.`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui transaksi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add delete handler
  const handleDelete = async () => {
    if (!transaction) return
    
    setIsLoading(true)
    try {
      await axios.delete(`/transactions/${transaction.id}`)
      
      toast({
        title: "Transaksi dihapus",
        description: "Transaksi berhasil dihapus",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus transaksi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter categories based on type
  const filteredCategories = categories.filter(cat => cat.type === type)

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('id-ID').format(amount ?? 0)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    return format(new Date(dateString), "d MMMM yyyy", { locale: id })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              {transaction?.type === "income" 
                ? `Pemasukan sebesar Rp ${formatCurrency(transaction?.amount)} pada ${formatDate(transaction?.date)}`
                : `Pengeluaran sebesar Rp ${formatCurrency(transaction?.amount)} pada ${formatDate(transaction?.date)}`
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Transaksi</label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={type === "income" ? "default" : "outline"}
                  onClick={() => setType("income")}
                  className={cn(
                    "w-full",
                    type === "income" 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "hover:bg-green-50"
                  )}
                >
                  Pemasukan
                </Button>
                <Button
                  type="button"
                  variant={type === "expense" ? "default" : "outline"}
                  onClick={() => setType("expense")}
                  className={cn(
                    "w-full",
                    type === "expense" 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "hover:bg-red-50"
                  )}
                >
                  Pengeluaran
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jumlah</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">Rp</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue>
                    {categories.find(cat => String(cat.id) === category)?.name || "Pilih kategori"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: cat.color }} 
                        />
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                placeholder="Tambahkan deskripsi (opsional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setIsDeleteAlertOpen(true)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
              
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  aria-label="Simpan perubahan transaksi"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}