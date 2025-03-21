"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post('/forgot-password', { email })

      toast({
        title: "Email terkirim",
        description: "Link reset password telah dikirim ke email Anda",
        duration: 5000,
      })
      
      router.push("/login")
    } catch (error: any) {
      console.error('Forgot password error:', error)
      
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.response?.data?.message || "Gagal mengirim email reset password",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
          <CardDescription>
            Masukkan email Anda untuk menerima link reset password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => router.push("/login")}
            className="text-sm"
          >
            Kembali ke halaman login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}