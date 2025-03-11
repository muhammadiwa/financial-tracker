"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [content, setContent] = useState(children)

  useEffect(() => {
    setIsTransitioning(true)
    const timeout = setTimeout(() => {
      setContent(children)
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [pathname, children])

  return (
    <div className={cn("transition-opacity duration-300", isTransitioning ? "opacity-0" : "opacity-100")}>
      {content}
    </div>
  )
}

