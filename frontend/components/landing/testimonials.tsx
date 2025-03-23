"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TestimonialCard } from '@/components/ui/testimonial-card'

const testimonials = [
  {
    id: 1,
    content: "Money Record telah mengubah cara saya mengelola keuangan. Wawasan yang saya dapatkan telah membantu saya menghemat tambahan Rp 400.000 setiap bulan!",
    author: "Sarah Johnson",
    title: "Marketing Manager",
    avatar: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    content: "Saya telah mencoba banyak aplikasi keuangan, tapi Money Record menonjol dengan antarmuka intuitif dan fitur canggihnya. Penganggaran menjadi benar-benar menyenangkan.",
    author: "Michael Chen",
    title: "Software Developer",
    avatar: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    content: "Sebagai seseorang yang tidak pernah melacak pengeluaran sebelumnya, Money Record membuatnya mudah untuk memulai. Sekarang saya memiliki visibilitas lengkap ke mana uang saya mengalir.",
    author: "Emily Rodriguez",
    title: "Desainer Freelance",
    avatar: "/images/testimonial-3.jpg"
  }
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const next = () => {
    setCurrent(current === testimonials.length - 1 ? 0 : current + 1)
  }
  
  const prev = () => {
    setCurrent(current === 0 ? testimonials.length - 1 : current - 1)
  }
  
  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [current])

  return (
    <section id="testimonials" ref={ref} className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="heading-lg mb-4">
            Testimoni Pengguna Kami
          </h2>
          <p className="text-lg text-slate-600">
            Bergabunglah dengan ribuan pelanggan puas yang telah mengubah kebiasaan keuangan mereka
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Menambahkan height yang cukup untuk menampung testimonial */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl relative" style={{ minHeight: "250px" }}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                content={testimonial.content}
                author={testimonial.author}
                title={testimonial.title}
                avatar={testimonial.avatar}
                isActive={current === index}
                index={index}
              />
            ))}
          </div>
          
          <div className="absolute -bottom-5 left-0 right-0 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  current === index ? 'bg-teal-500 w-6' : 'bg-slate-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-navy-800 hidden md:block hover:bg-slate-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={next}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-navy-800 hidden md:block hover:bg-slate-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}