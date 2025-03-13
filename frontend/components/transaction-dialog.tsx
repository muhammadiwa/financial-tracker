"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Array<{
    id: string
    name: string
    type: "income" | "expense"
    color: string
  }> | null
  onSuccess?: () => void
}

export function TransactionDialog({
  open,
  onOpenChange,
  categories = [], // Add default empty array
  onSuccess,
}: TransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  // Reset category when type changes
  useEffect(() => {
    setCategory("")
  }, [type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        {
          type: type,
          amount: Number(amount),
          category_id: category,
          description: description,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      toast({
        title: "Transaksi berhasil ditambahkan",
        description: `${type === "income" ? "Pemasukan" : "Pengeluaran"} sebesar Rp${amount} telah dicatat.`,
      })

      onSuccess?.()
      onOpenChange(false)
      setType("expense")
      setAmount("")
      setCategory("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
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

  const filteredCategories = useMemo(() => {
    if (!categories) return [] // Ensure categories is an array
    return categories.filter((cat) => cat.type === type)
  }, [categories, type])

  // Find the selected category object
  const selectedCategory = useMemo(() => {
    if (!category || !categories) return null
    return categories.find((cat) => cat.id === category)
  }, [category, categories])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaksi Baru</DialogTitle>
          <DialogDescription>Isi detail transaksi di bawah ini.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs
            value={type}
            defaultValue="expense"
            className="w-full"
            onValueChange={(value) => {
              setType(value as "income" | "expense")
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
            </TabsList>
          </Tabs>

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
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    Tidak ada kategori
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

