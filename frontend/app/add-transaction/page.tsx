"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Breadcrumb } from "@/components/breadcrumb"

// Sample categories
const incomeCategories = ["Gaji", "Freelance", "Investasi", "Hadiah", "Lainnya"]

const expenseCategories = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Tagihan",
  "Lainnya",
]

export default function AddTransactionPage() {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate saving transaction
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Transaksi berhasil ditambahkan",
        description: `${type === "income" ? "Pemasukan" : "Pengeluaran"} sebesar Rp${amount} telah dicatat.`,
      })
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Tambah Transaksi</h1>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />
        <Tabs
          defaultValue="expense"
          className="w-full"
          onValueChange={(value) => setType(value as "income" | "expense")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
            <TabsTrigger value="income">Pemasukan</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </form>
        </Tabs>
      </main>
    </div>
  )
}

