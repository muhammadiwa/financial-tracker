"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send } from 'lucide-react'

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-teal-500 text-white p-4 rounded-full shadow-lg z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={24} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-30"
          >
            <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Chat dengan kami</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="h-80 p-4 overflow-y-auto bg-slate-50">
              <div className="bg-teal-100 p-3 rounded-lg rounded-tl-none max-w-xs mb-4">
                👋 Hai! Bagaimana kami dapat membantu Anda hari ini dengan Money Record?
              </div>
              
              <div className="flex justify-end mb-4">
                <div className="bg-white p-3 rounded-lg rounded-tr-none max-w-xs shadow-sm">
                  Saya tertarik dengan paket Pro. Fitur apa saja yang disertakan?
                </div>
              </div>
              
              <div className="bg-teal-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                Paket Pro mencakup analitik lanjutan, kategori kustom tak terbatas, pelacakan tujuan, dan peringatan pengeluaran berulang. Apakah Anda ingin saya menjelaskan fitur-fitur ini secara lebih rinci?
              </div>
            </div>
            
            <div className="p-3 border-t">
              <form className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="bg-teal-500 text-white p-2 rounded-lg"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}