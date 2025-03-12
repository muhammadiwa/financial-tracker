"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      })

      if (response.data.status === 'success') {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        })
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Terjadi kesalahan")
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google OAuth
      const googleAuth = await google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'email profile',
        callback: async (response) => {
          const result = await axios.post('http://localhost:8000/api/login/google', {
            access_token: response.access_token
          })

          if (result.data.status === 'success') {
            localStorage.setItem('token', result.data.token)
            localStorage.setItem('user', JSON.stringify(result.data.user))
            router.push("/dashboard")
          }
        },
      })

      googleAuth.requestAccessToken()
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      FB.login(async function(response) {
        if (response.authResponse) {
          const result = await axios.post('http://localhost:8000/api/login/facebook', {
            access_token: response.authResponse.accessToken
          })

          if (result.data.status === 'success') {
            localStorage.setItem('token', result.data.token)
            localStorage.setItem('user', JSON.stringify(result.data.user))
            router.push("/dashboard")
          }
        }
      }, {scope: 'email'})
    } catch (error) {
      console.error('Facebook login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Money Record</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="relative my-2 w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Atau masuk dengan</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              Facebook
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Daftar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

