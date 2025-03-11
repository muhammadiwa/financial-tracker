"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Breadcrumb } from "@/components/breadcrumb"
import { useToast } from "@/components/ui/use-toast"

// Sample categories
const sampleCategories = [
  { id: "1", name: "Makanan", type: "expense", color: "#ef4444" },
  { id: "2", name: "Transportasi", type: "expense", color: "#3b82f6" },
  { id: "3", name: "Hiburan", type: "expense", color: "#8b5cf6" },
  { id: "4", name: "Tagihan", type: "expense", color: "#f97316" },
  { id: "5", name: "Belanja", type: "expense", color: "#10b981" },
  { id: "6", name: "Gaji", type: "income", color: "#22c55e" },
  { id: "7", name: "Freelance", type: "income", color: "#06b6d4" },
  { id: "8", name: "Hadiah", type: "income", color: "#ec4899" },
  { id: "9", name: "Investasi", type: "income", color: "#f59e0b" },
]

// Available colors
const colorOptions = [
  { value: "#ef4444", label: "Merah" },
  { value: "#f97316", label: "Oranye" },
  { value: "#f59e0b", label: "Kuning" },
  { value: "#22c55e", label: "Hijau" },
  { value: "#10b981", label: "Emerald" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#3b82f6", label: "Biru" },
  { value: "#8b5cf6", label: "Ungu" },
  { value: "#ec4899", label: "Pink" },
  { value: "#6b7280", label: "Abu-abu" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(sampleCategories)
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense",
    color: "#ef4444",
  })
  const [editingCategory, setEditingCategory] = useState<{
    id: string
    name: string
    type: string
    color: string
  } | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  // Filter categories based on active tab
  const filteredCategories = categories.filter((category) => activeTab === "all" || category.type === activeTab)

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Nama kategori diperlukan",
        description: "Silakan masukkan nama kategori",
        variant: "destructive",
      })
      return
    }

    const id = (categories.length + 1).toString()
    setCategories([...categories, { id, ...newCategory }])
    setNewCategory({
      name: "",
      type: "expense",
      color: "#ef4444",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Kategori ditambahkan",
      description: `Kategori ${newCategory.name} berhasil ditambahkan`,
    })
  }

  const handleEditCategory = () => {
    if (!editingCategory) return

    if (!editingCategory.name.trim()) {
      toast({
        title: "Nama kategori diperlukan",
        description: "Silakan masukkan nama kategori",
        variant: "destructive",
      })
      return
    }

    setCategories(categories.map((category) => (category.id === editingCategory.id ? editingCategory : category)))
    setIsEditDialogOpen(false)

    toast({
      title: "Kategori diperbarui",
      description: `Kategori ${editingCategory.name} berhasil diperbarui`,
    })
  }

  const handleDeleteCategory = () => {
    if (!deletingCategoryId) return

    const categoryToDelete = categories.find((c) => c.id === deletingCategoryId)
    setCategories(categories.filter((category) => category.id !== deletingCategoryId))
    setDeletingCategoryId(null)

    toast({
      title: "Kategori dihapus",
      description: `Kategori ${categoryToDelete?.name} berhasil dihapus`,
    })
  }

  const openEditDialog = (category: (typeof categories)[0]) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Kategori</h1>
          <div className="ml-auto">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Tambah Kategori</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kategori Baru</DialogTitle>
                  <DialogDescription>Buat kategori baru untuk transaksi Anda</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nama Kategori
                    </label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Masukkan nama kategori"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Tipe Kategori
                    </label>
                    <Select
                      value={newCategory.type}
                      onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Pengeluaran</SelectItem>
                        <SelectItem value="income">Pemasukan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="color" className="text-sm font-medium">
                      Warna
                    </label>
                    <Select
                      value={newCategory.color}
                      onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih warna">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: newCategory.color }} />
                            <span>{colorOptions.find((c) => c.value === newCategory.color)?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }} />
                              <span>{color.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleAddCategory}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="income">Pemasukan</TabsTrigger>
            <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: category.color }}
                    >
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingCategoryId(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteCategory}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada kategori yang ditemukan</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent>{/* Dialog content same as above */}</DialogContent>
            </Dialog>
          </div>
        )}
      </main>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>Ubah detail kategori</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nama Kategori
                </label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Masukkan nama kategori"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-type" className="text-sm font-medium">
                  Tipe Kategori
                </label>
                <Select
                  value={editingCategory.type}
                  onValueChange={(value) => setEditingCategory({ ...editingCategory, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                    <SelectItem value="income">Pemasukan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-color" className="text-sm font-medium">
                  Warna
                </label>
                <Select
                  value={editingCategory.color}
                  onValueChange={(value) => setEditingCategory({ ...editingCategory, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: editingCategory.color }} />
                        <span>{colorOptions.find((c) => c.value === editingCategory.color)?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }} />
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditCategory}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

