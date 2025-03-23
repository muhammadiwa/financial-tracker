"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

type TestimonialCardProps = {
  content: string
  author: string
  title: string
  avatar: string
  isActive: boolean
  index: number
}

export function TestimonialCard({
  content,
  author,
  title,
  avatar,
  isActive,
  index
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : 100,
        // Menggunakan position absolute untuk semua card, dan z-index untuk mengontrol tampilan
        position: 'absolute',
        zIndex: isActive ? 1 : 0
      }}
      transition={{ 
        duration: 0.5,
        // Menambahkan easings untuk transisi yang lebih halus
        ease: "easeInOut"
      }}
      className="p-8 md:p-12 inset-0 w-full"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="shrink-0">
          <Image
            src={avatar}
            alt={author}
            width={100}
            height={100}
            className="rounded-full object-cover h-24 w-24 border-4 border-teal-50"
          />
        </div>
        <div>
          <blockquote className="text-slate-600 text-lg mb-4">
            "{content}"
          </blockquote>
          <div>
            <p className="font-semibold text-navy-800">{author}</p>
            <p className="text-sm text-slate-500">{title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}