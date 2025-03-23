"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, Search, HelpCircle } from 'lucide-react'

type FaqItemProps = {
  question: string
  answer: string
  index: number
  isOpen: boolean
  onToggle: () => void
}

function FaqItem({ question, answer, index, isOpen, onToggle }: FaqItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`mb-4 overflow-hidden rounded-xl border ${
        isOpen ? 'border-teal-200 bg-teal-50/30' : 'border-slate-200 bg-white'
      } transition-all duration-300 hover:shadow-md`}
    >
      <button
        className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-navy-800 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-lg flex items-center gap-3">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${
            isOpen ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
          } transition-colors`}>
            {index + 1}
          </span>
          {question}
        </span>
        <ChevronDown 
          className={`h-5 w-5 flex-shrink-0 text-teal-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5"
          >
            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-600 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "Bagaimana cara memulai dengan Money Record?",
      answer: "Untuk memulai, cukup daftar akun gratis dan Anda langsung bisa mulai mencatat transaksi keuangan Anda. Kami menawarkan panduan cepat yang akan membantu Anda menyiapkan anggaran pertama dan mulai melacak pengeluaran. Semua fitur dasar tersedia dalam akun gratis Anda, sehingga Anda bisa merasakan manfaat dari platform kami tanpa biaya apapun."
    },
    {
      question: "Apakah data saya aman?",
      answer: "Keamanan data Anda adalah prioritas utama kami. Kami menggunakan enkripsi standar industri untuk melindungi semua informasi pribadi dan keuangan Anda. Kami tidak pernah menjual data pengguna ke pihak ketiga. Selain itu, kami melakukan audit keamanan secara berkala dan mengikuti praktik terbaik dalam industri untuk menjaga keamanan infrastruktur kami."
    },
    {
      question: "Dapatkah saya mengimpor data dari aplikasi keuangan lain?",
      answer: "Ya, Money Record mendukung impor data dari format CSV standar dan dari beberapa aplikasi keuangan populer. Anda dapat mengimpor transaksi, kategori, dan bahkan anggaran dari platform lain. Proses impor dirancang agar mudah digunakan, dengan petunjuk langkah demi langkah untuk membantu Anda memindahkan data keuangan Anda dengan lancar."
    },
    {
      question: "Apa perbedaan antara paket Dasar dan Pro?",
      answer: "Paket Dasar mencakup fitur pelacakan pengeluaran dasar, alat anggaran sederhana, dan laporan bulanan. Paket Pro menambahkan analitik lanjutan, kategori tak terbatas, pelacakan tujuan keuangan, dan peringatan pengeluaran berulang. Dengan Pro, Anda juga mendapatkan akses ke visualisasi data yang lebih canggih dan kemampuan untuk membuat laporan keuangan yang dapat disesuaikan."
    },
    {
      question: "Bisakah saya mencoba fitur premium sebelum berlangganan?",
      answer: "Tentu! Semua paket berbayar kami dilengkapi dengan uji coba gratis 14 hari. Anda dapat mengakses semua fitur paket yang Anda pilih tanpa batasan selama masa uji coba. Tidak diperlukan kartu kredit untuk memulai uji coba, dan Anda akan menerima pengingat sebelum masa uji coba berakhir sehingga Anda dapat memutuskan apakah akan melanjutkan langganan."
    },
    {
      question: "Bagaimana cara membatalkan langganan saya?",
      answer: "Anda dapat membatalkan langganan kapan saja dari pengaturan akun Anda. Setelah dibatalkan, Anda masih dapat mengakses fitur premium hingga akhir periode penagihan saat ini. Tidak ada biaya penalti untuk pembatalan, dan data Anda tetap tersimpan sehingga Anda dapat mengakses catatan historis kapan saja. Jika Anda memutuskan untuk berlangganan kembali di masa depan, semua data Anda akan tetap tersedia."
    },
  ]

  const filteredFaqs = searchQuery.trim() === "" 
    ? faqs 
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" ref={ref} className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="mb-2 inline-flex items-center justify-center rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-600">
            <HelpCircle className="mr-1 h-4 w-4" />
            Bantuan
          </div>
          <h2 className="text-4xl font-bold mb-4 text-navy-800">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-slate-600">
            Jawaban untuk pertanyaan umum tentang Money Record dan fitur-fiturnya
          </p>
          
          <div className="mt-8 relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full block w-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
              placeholder="Cari pertanyaan atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                <Search className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-slate-500 mb-4">
                Tidak ditemukan pertanyaan yang cocok dengan pencarian Anda
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-teal-500 font-medium hover:underline"
              >
                Hapus pencarian
              </button>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">
              Masih punya pertanyaan lain? Kami siap membantu Anda.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contact"
              className="inline-flex items-center bg-white border border-slate-200 text-navy-800 hover:border-teal-500 px-5 py-3 rounded-lg shadow-sm font-medium transition-colors"
            >
              Hubungi Kami
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}