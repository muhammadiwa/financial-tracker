"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

declare global {
  interface Window {
    google?: any;
    googleAuthInitialized?: boolean;
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      if (typeof window === 'undefined') return;
      
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }

    loadGoogleScript()
  }, [])

  const initializeGoogleSignIn = () => {
    if (typeof window === 'undefined' || !window.google) return;

    try {
        window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            context: 'signin',
            use_fedcm_for_prompt: true // Add this
        });

        window.google.accounts.id.renderButton(
            document.getElementById('googleButton')!,
            {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                shape: 'rectangular',
                width: '100%',
                locale: 'id_ID'
            }
        );

        setGoogleLoaded(true);
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
    }
};

  const handleGoogleCallback = async (response: any) => {
    if (!response?.credential) {
        console.error("No credential received");
        return;
    }

    setIsLoading(true);
    try {

        const result = await axios.post('/login/google', {
            credential: response.credential
        });

        if (result.data.status === 'success') {
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            
            toast({
                title: "Login berhasil",
                description: "Selamat datang!",
                duration: 3000,
            });
            
            router.push("/dashboard");
        }
    } catch (error: any) {
        console.error('Full error:', error);
        console.error('Error response:', error.response?.data);
        
        toast({
            variant: "destructive",
            title: "Login gagal",
            description: error.response?.data?.message || "Gagal terhubung ke server",
            duration: 3000,
        });

    } finally {
        setIsLoading(false);
    }
};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post('/login', {
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
          duration: 3000,
        })
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Terjadi kesalahan")
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        {/* Card content remains the same */}
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Money Record</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form content remains the same */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email and password fields remain the same */}
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
          {/* <div className="relative my-2 w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Atau masuk dengan</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-2 w-full">
            <div 
              id="googleButton" 
              className="w-full flex justify-center"
              aria-disabled={isLoading}
            />
          </div> */}
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
