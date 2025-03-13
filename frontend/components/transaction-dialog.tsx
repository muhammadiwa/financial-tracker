"use client"

import { cn } from "@/lib/utils"
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
  DialogDescription 
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import axios from '@/lib/axios'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Array<{
    id: string
    name: string
    type: "income" | "expense"
    color: string
  }>
  onSuccess?: () => void
}

export function TransactionDialog({
  open,
  onOpenChange,
  categories,
  onSuccess
}: TransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setType("expense")
      setAmount("")
      setCategory("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
    }
  }, [open])

  // Reset category when type changes
  useEffect(() => {
    setCategory("")
  }, [type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post('/transactions', {
        type,
        amount: Number(amount),
        category_id: category,
        description,
        date,
      })

      toast({
        title: "Transaksi berhasil ditambahkan",
        description: `${type === "income" ? "Pemasukan" : "Pengeluaran"} sebesar Rp${amount} telah dicatat.`,
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan transaksi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter categories based on type
  const filteredCategories = categories.filter(cat => cat.type === type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
          <DialogDescription>
            Tambahkan transaksi baru dengan mengisi form di bawah ini.
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
            <Select 
              value={category} 
              onValueChange={setCategory} 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori">
                  {category ? categories.find(cat => String(cat.id) === category)?.name : "Pilih kategori"}
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

          <div className="flex justify-end gap-4">
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
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

