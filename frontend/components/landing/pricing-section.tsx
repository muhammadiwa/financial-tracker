"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { PricingCard } from '@/components/ui/pricing-card'

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="pricing" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="heading-lg mb-4">
            Harga Sederhana dan Transparan
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Pilih paket yang sesuai dengan perjalanan keuangan Anda
          </p>
          
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${!isYearly ? 'text-navy-800 font-medium' : 'text-slate-500'}`}>
              Bulanan
            </span>
            <div 
              className="relative w-14 h-7 bg-slate-200 rounded-full cursor-pointer"
              onClick={() => setIsYearly(!isYearly)}
            >
              <div 
                className={`absolute top-1 w-5 h-5 rounded-full bg-teal-500 transition-all duration-300 ${isYearly ? 'left-8' : 'left-1'}`}
              />
            </div>
            <span className={`ml-3 ${isYearly ? 'text-navy-800 font-medium' : 'text-slate-500'}`}>
              Tahunan <span className="text-teal-500 text-sm font-medium ml-1">Hemat 20%</span>
            </span>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Dasar"
            price={isYearly ? 49 : 5}
            period={isYearly ? "/tahun" : "/bulan"}
            description="Sempurna untuk individu yang baru memulai perjalanan keuangan"
            features={[
              "Pelacakan pengeluaran",
              "Alat anggaran dasar",
              "Laporan bulanan",
              "Hingga 5 kategori kustom",
            ]}
            cta="Mulai Uji Coba Gratis"
            isPopular={false}
            delay={0.1}
            inView={inView}
          />
          
          <PricingCard
            title="Pro"
            price={isYearly ? 99 : 10}
            period={isYearly ? "/tahun" : "/bulan"}
            description="Ideal untuk mereka yang serius mengelola keuangan"
            features={[
              "Semua fitur Dasar",
              "Analitik lanjutan",
              "Kategori kustom tak terbatas",
              "Pelacakan tujuan",
              "Peringatan pengeluaran berulang",
            ]}
            cta="Mulai Uji Coba Gratis"
            isPopular={true}
            delay={0.2}
            inView={inView}
          />
          
          <PricingCard
            title="Keluarga"
            price={isYearly ? 149 : 15}
            period={isYearly ? "/tahun" : "/bulan"}
            description="Untuk rumah tangga yang mengelola keuangan bersama"
            features={[
              "Semua fitur Pro",
              "Hingga 5 akun pengguna",
              "Perencanaan anggaran bersama",
              "Pelacakan pengeluaran keluarga",
              "Kolaborasi tujuan keuangan",
              "Dukungan prioritas",
            ]}
            cta="Mulai Uji Coba Gratis"
            isPopular={false}
            delay={0.3}
            inView={inView}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 mb-6">
            Semua paket termasuk uji coba gratis 14 hari. Tidak diperlukan kartu kredit.
          </p>
          {/* <Link 
            href="#faq"
            className="text-teal-500 font-medium hover:underline"
          >
            Lihat FAQ untuk detail lebih lanjut
          </Link> */}
        </motion.div>
      </div>
    </section>
  )
}