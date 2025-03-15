"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
import { Chrome, Facebook } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            name,
            email,
            password,
        })

        if (response.data.status === 'success') {
            toast({
                title: "Pendaftaran berhasil",
                description: "Silakan masuk dengan akun baru Anda",
                duration: 3000,
            })
            router.push("/login")
        }
    } catch (error: any) {
        const message = error.response?.data?.message
        const errorMessage = typeof message === 'object' 
            ? Object.values(message).flat()[0] 
            : message || "Terjadi kesalahan saat mendaftar"
        
        setError(errorMessage)
        toast({
            variant: "destructive",
            title: "Pendaftaran gagal",
            description: errorMessage,
            duration: 3000,
        })
    } finally {
        setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const googleAuth = await google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'email profile',
        callback: async (response) => {
          try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/google`, {
              access_token: response.access_token
            })

            if (result.data.status === 'success') {
              localStorage.setItem('token', result.data.token)
              localStorage.setItem('user', JSON.stringify(result.data.user))
              toast({
                title: "Pendaftaran berhasil",
                description: "Selamat datang!",
              })
              router.push("/dashboard")
            }
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Pendaftaran gagal",
              description: error.response?.data?.message || "Terjadi kesalahan",
            })
          }
        },
      })

      googleAuth.requestAccessToken()
    } catch (error) {
      console.error('Google registration failed:', error)
    }
  }

  const handleFacebookRegister = async () => {
    try {
      FB.login(async function(response) {
        if (response.authResponse) {
          try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/facebook`, {
              access_token: response.authResponse.accessToken
            })

            if (result.data.status === 'success') {
              localStorage.setItem('token', result.data.token)
              localStorage.setItem('user', JSON.stringify(result.data.user))
              toast({
                title: "Pendaftaran berhasil",
                description: "Selamat datang!",
              })
              router.push("/dashboard")
            }
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Pendaftaran gagal",
              description: error.response?.data?.message || "Terjadi kesalahan",
            })
          }
        }
      }, {scope: 'email'})
    } catch (error) {
      console.error('Facebook registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Buat Akun</CardTitle>
          <CardDescription>Daftar untuk mulai mencatat keuangan Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Sembunyikan password" : "Tampilkan password"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

