"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Bell, Moon, Sun, Shield, HelpCircle, Info, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProfileDialog } from "@/components/profile-dialog"
import { PasswordDialog } from "@/components/password-dialog"
import axios from "@/lib/axios"
import { Input } from "@/components/ui/input"

interface Profile {
  name: string
  email: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({ name: '', email: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [notificationTime, setNotificationTime] = useState("20:00")
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
    fetchNotificationSettings()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile')
      if (response.data.status === 'success') {
        setProfile(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat profil",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the fetchNotificationSettings function to format time correctly
  const fetchNotificationSettings = async () => {
    try {
      const response = await axios.get('/notifications/settings')
      if (response.data.status === 'success') {
        setNotifications(response.data.data.enabled)
        // Format time to HH:mm for input element
        const time = response.data.data.time
        setNotificationTime(time.substring(0, 5)) // Get only HH:mm part
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
    }
  }

  const handleNotificationChange = async (enabled: boolean) => {
    try {
      const response = await axios.put('/notifications/settings', {
        enabled,
        time: notificationTime
      })

      if (response.data.status === 'success') {
        setNotifications(enabled)
        toast({
          title: "Pengaturan diperbarui",
          description: "Pengaturan notifikasi berhasil diperbarui",
        })
      }
    } catch (error) {
      console.error('Error updating notification settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui pengaturan notifikasi",
      })
    }
  }

  // Update the handleTimeChange function
  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setNotificationTime(newTime) // Update local state with HH:mm format
    
    try {
      const timeWithSeconds = `${newTime}:00` // Add seconds for backend
      
      const response = await axios.put('/notifications/settings', {
        enabled: notifications,
        time: timeWithSeconds
      })

      if (response.data.status === 'success') {
        toast({
          title: "Pengaturan diperbarui",
          description: "Waktu notifikasi berhasil diperbarui",
        })
      }
    } catch (error: any) {
      console.error('Error updating notification time:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Gagal memperbarui waktu notifikasi",
      })
      
      // Revert to previous value on error
      const response = await axios.get('/notifications/settings')
      if (response.data.status === 'success') {
        setNotificationTime(response.data.data.time.substring(0, 5))
      }
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast({
        title: "Berhasil keluar",
        description: "Anda telah keluar dari akun",
      })
      router.push("/login")
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal keluar dari akun",
      })
    }
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
            {isLoading ? (
              <div className="flex items-center justify-center h-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  className="ml-auto"
                  onClick={() => setIsProfileDialogOpen(true)}
                >
                  Edit
                </Button>
              </div>
            )}
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
                  <p className="text-sm text-muted-foreground">
                    Dapatkan pengingat untuk mencatat transaksi harian
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  type="time"
                  value={notificationTime}
                  onChange={handleTimeChange}
                  className="w-32"
                  disabled={!notifications}
                />
                <Switch 
                  checked={notifications} 
                  onCheckedChange={handleNotificationChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Keamanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Ganti password akun Anda
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Ubah
              </Button>
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

        <ProfileDialog
          open={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
          profile={profile}
          onSuccess={fetchProfile}
        />

        <PasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
        />
      </main>
    </div>
  )
}

