"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { FloatingIcons } from '@/components/landing/floating-icons'
import { AnimatedChart } from '@/components/charts/animated-chart'
import { ArrowRight, Check, ArrowDown, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

export function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  // Enhanced floating animation with multiple waves
  const [floatY, setFloatY] = useState(0)
  const [floatY2, setFloatY2] = useState(0) // Second wave for more variety
  const [floatY3, setFloatY3] = useState(0) // Third wave for more variety
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Subtle parallax and enhanced floating effect
  useEffect(() => {
    // Floating animation with multiple waves for more natural movement
    let animationFrame: number
    let startTime = Date.now()
    
    const animateFloat = () => {
      const elapsed = Date.now() - startTime
      // First wave - medium speed
      const newY = Math.sin(elapsed / 1000) * 8 
      // Second wave - slower, different phase
      const newY2 = Math.sin(elapsed / 1500) * 10 
      // Third wave - faster, different phase
      const newY3 = Math.sin(elapsed / 800) * 6 
      
      setFloatY(newY)
      setFloatY2(newY2)
      setFloatY3(newY3)
      
      animationFrame = requestAnimationFrame(animateFloat)
    }
    
    animateFloat()
    
    // Scroll effect
    const handleScroll = () => {
      const scrollValue = window.scrollY
      const heroImage = document.getElementById('hero-image')
      const heroContent = document.getElementById('hero-content')
      
      if (heroImage && heroContent) {
        heroImage.style.transform = `translateY(${scrollValue * 0.15}px)`
        heroContent.style.transform = `translateY(${scrollValue * 0.05}px)`
      }
    }
    
    // Mouse movement effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <section 
      ref={ref} 
      className="relative pt-28 pb-20 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50/70 to-white"
    >
      {/* FloatingIcons with lower z-index */}
      <div className="absolute inset-0 z-0">
        <FloatingIcons />
      </div>
      
      {/* Background decorative elements with enhanced animation */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-teal-50 to-blue-50 -z-10"></div>
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.05, 1],
          y: [0, -15, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl -z-10"
      ></motion.div>
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.05, 1],
          y: [0, 15, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 6,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl -z-10"
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero content */}
          <motion.div
            id="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left relative z-20"
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100/80 text-teal-700 text-sm font-medium mb-6 backdrop-blur-sm border border-teal-200/50">
                <motion.span 
                  animate={{ scale: [1, 1.5, 1] }} 
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="flex h-2 w-2 bg-teal-500 rounded-full mr-2"
                ></motion.span>
                Solusi keuangan terbaik untuk Anda
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 mb-6 leading-tight"
            >
              <span className="relative">
                Kelola Keuangan Anda 
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-400"
                />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500 block mt-2">
                Money Record
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Catat pengeluaran dan pemasukan dengan mudah, kelola anggaran, dan dapatkan
              wawasan berharga tentang kebiasaan keuangan Anda.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition-all duration-300"></div>
                <Link
                  href="/register"
                  className="relative bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium rounded-lg px-8 py-3.5 text-center inline-flex items-center shadow-lg shadow-teal-500/25 transition-all duration-300"
                >
                  Mulai Gratis
                  <motion.span
                    animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="#features"
                  className="text-navy-800 bg-white border border-slate-200 hover:border-slate-300 font-medium rounded-lg px-8 py-3.5 text-center inline-block transition-all duration-300"
                >
                  Lihat Fitur
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, staggerChildren: 0.1 }}
              className="hidden lg:flex flex-col"
            >
              <div className="text-sm font-medium text-slate-500 mb-3">Dipercaya oleh ratusan pengguna</div>
              <div className="flex space-x-6">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + (i * 0.1) }}
                    className="flex items-center space-x-1"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Check className="h-4 w-4 text-teal-500" />
                    </motion.div>
                    <span className="text-sm text-slate-700">
                      {i === 1 && "Gratis untuk memulai"}
                      {i === 2 && "Tidak perlu kartu kredit"}
                      {i === 3 && "Aman & terpercaya"}
                      {i === 4 && "Laporan mendalam"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Hero image - simplified animation */}
          <motion.div
            id="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.6
            }}
            className="relative z-20"
          >
            <div className="relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200/70 transform-gpu">
              <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="text-xs font-medium text-slate-500">Dashboard Keuangan</div>
                </div>
              </div>
              <div className="relative">
                <AnimatedChart />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"
                />
              </div>
            </div>
            
            {/* Decorative elements with enhanced animation */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: ['-12deg', '-8deg', '-12deg'],
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute top-1/3 left-0 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-teal-300 to-teal-400 rounded-2xl blur-xl opacity-30 z-10"
            ></motion.div>
            
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                y: [0, 15, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-10 right-0 transform translate-x-1/3 w-32 h-32 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full blur-xl opacity-30 z-10"
            ></motion.div>
            
            {/* Savings card with simplified animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ 
                y: [0, -8, 0] 
              }}
              transition={{ 
                duration: 0.5,
                delay: 1,
                y: { 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror"
                }
              }}
              className="absolute -bottom-6 -left-12 bg-white rounded-xl shadow-xl p-4 border border-slate-200 z-30"
            >
              <div className="flex items-center">
                <motion.div 
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-3 shadow-inner"
                >
                  <Wallet className="h-5 w-5 text-green-500" />
                </motion.div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Total Tabungan</div>
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="font-bold text-lg text-navy-800"
                  >
                    Rp2.450.000
                  </motion.div>
                </div>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1.5 }}
                className="w-full h-1 mt-2 bg-slate-100 rounded-full overflow-hidden"
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: 1.7 }}
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                />
              </motion.div>
            </motion.div>
            
            {/* Income card with TrendingUp icon and enhanced animation */}
            <motion.div 
              initial={{ opacity: 0, y: -20, x: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ 
                y: [0, -10, 0] 
              }}
              transition={{ 
                duration: 0.5,
                delay: 1.2,
                y: { 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5 
                }
              }}
              className="absolute -top-4 -right-8 bg-white rounded-xl shadow-xl p-4 border border-slate-200 z-30 backdrop-blur-sm"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center">
                {/* Replaced blue circle with TrendingUp icon */}
                <motion.div 
                  animate={{ 
                    y: [0, -3, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3 shadow-inner"
                >
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </motion.div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Pemasukan</div>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="font-bold text-lg text-navy-800"
                  >
                    Rp4.850.000
                  </motion.div>
                </div>
              </div>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
                className="text-xs text-green-500 font-medium mt-1 flex items-center"
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                </motion.div>
                <span>+15% dari bulan lalu</span>
              </motion.div>
            </motion.div>
            
            {/* Expenses card with enhanced animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileInView={{ 
                y: [0, 8, 0] 
              }}
              transition={{ 
                duration: 0.5,
                delay: 1.4,
                y: { 
                  duration: 3.5, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="absolute bottom-12 -right-10 bg-white rounded-xl shadow-xl p-4 border border-slate-200 z-30 backdrop-blur-sm"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center">
                <motion.div 
                  animate={{ 
                    y: [0, 3, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mr-3 shadow-inner"
                >
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </motion.div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Pengeluaran</div>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="font-bold text-lg text-navy-800"
                  >
                    Rp2.350.000
                  </motion.div>
                </div>
              </div>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.5, delay: 2 }}
                className="text-xs text-red-500 font-medium mt-1 flex items-center"
              >
                <motion.div
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown className="h-3 w-3 mr-1" />
                </motion.div>
                <span>-8% dari bulan lalu</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}