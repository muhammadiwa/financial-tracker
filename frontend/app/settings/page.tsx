"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Bell, Moon, Sun, Shield, HelpCircle, Info, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari akun",
    })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Pengaturan</h1>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
              <Button variant="ghost" className="ml-auto" onClick={() => router.push("/profile")}>
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Tampilan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <p className="font-medium">Tema Gelap</p>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan tema gelap untuk tampilan yang nyaman di malam hari
                  </p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="h-5 w-5" />
                <div>
                  <p className="font-medium">Pengingat Transaksi</p>
                  <p className="text-sm text-muted-foreground">Dapatkan pengingat untuk mencatat transaksi harian</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lainnya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5" />
                <p className="font-medium">Keamanan</p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <HelpCircle className="h-5 w-5" />
                <p className="font-medium">Bantuan</p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <Info className="h-5 w-5" />
                <p className="font-medium">Tentang Aplikasi</p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <LogOut className="h-5 w-5 text-destructive" />
                <p className="font-medium text-destructive">Keluar</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-destructive"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

