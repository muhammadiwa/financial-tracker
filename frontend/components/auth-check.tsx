"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password']
    
    if (!publicPaths.includes(pathname)) {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
      }
    }
  }, [router, pathname])

  return <>{children}</>
}