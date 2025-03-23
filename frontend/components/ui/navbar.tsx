"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      
      // Determine active section for highlighting
      const sections = ['features', 'pricing', 'testimonials', 'faq']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      } else if (window.scrollY < 200) { 
        setActiveSection('')
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "#features", label: "Fitur" },
    { href: "#pricing", label: "Harga" },
    { href: "#testimonials", label: "Testimoni" },
    { href: "#faq", label: "FAQ" }
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center">
                <span className="text-teal-500 font-bold text-xl">M</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-navy-800">
              Money<span className="text-teal-500">Record</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeSection === item.href.substring(1)
                      ? 'text-teal-600 bg-teal-50/80'
                      : 'text-slate-700 hover:text-teal-500 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                href="/contact" 
                className="text-slate-700 hover:text-teal-500 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
              >
                Kontak
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="text-navy-800 font-medium hover:text-teal-500 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
              >
                Masuk
              </Link>
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center"
              >
                Daftar <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <button
            className="md:hidden text-navy-800 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 md:hidden"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-navy-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center p-8 h-full space-y-6">
              <Link href="/" className="flex items-center mb-12" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="relative h-12 w-12 mr-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg transform rotate-6"></div>
                  <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-teal-500 font-bold text-2xl">M</span>
                  </div>
                </div>
                <span className="text-3xl font-bold text-navy-800">
                  Money<span className="text-teal-500">Record</span>
                </span>
              </Link>
              
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="text-xl text-navy-800 hover:text-teal-500 transition-colors w-full text-center py-3 border-b border-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <Link 
                href="/contact" 
                className="text-xl text-navy-800 hover:text-teal-500 transition-colors w-full text-center py-3 border-b border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontak
              </Link>
              
              <div className="flex flex-col space-y-4 mt-auto w-full">
                <Link 
                  href="/login" 
                  className="bg-slate-100 text-navy-800 px-8 py-3.5 rounded-xl text-center font-medium hover:bg-slate-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3.5 rounded-xl text-center font-medium hover:from-teal-600 hover:to-teal-700 transition-colors flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daftar Sekarang
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}