"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { PieChart, DollarSign, BarChart2, CreditCard, Check, ArrowRight } from 'lucide-react'
import { FeatureCard } from '@/components/ui/feature-card'

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  return (
    <section id="features" ref={ref} className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="heading-lg mb-4">
            Fitur Lengkap untuk Kesuksesan Finansial
          </h2>
          <p className="text-lg text-slate-600">
            Alat komprehensif kami membantu Anda mengelola masa depan keuangan dengan mudah
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<PieChart className="text-teal-500" size={30} />}
            title="Pencatatan Pengeluaran"
            description="Lacak dan kategorikan seluruh pengeluaran Anda secara otomatis"
            delay={0.1}
            inView={inView}
          />
          <FeatureCard
            icon={<DollarSign className="text-teal-500" size={30} />}
            title="Pengelolaan Anggaran"
            description="Buat anggaran khusus dan dapatkan notifikasi saat mendekati batas"
            delay={0.2}
            inView={inView}
          />
          <FeatureCard
            icon={<BarChart2 className="text-teal-500" size={30} />}
            title="Laporan Keuangan"
            description="Analisis detail dan visualisasi kebiasaan pengeluaran Anda"
            delay={0.3}
            inView={inView}
          />
          <FeatureCard
            icon={<CreditCard className="text-teal-500" size={30} />}
            title="Kategori Kustom"
            description="Buat kategori yang sesuai dengan kebutuhan keuangan unik Anda"
            delay={0.4}
            inView={inView}
          />
        </div>
        
        {/* Detailed Feature with Animation */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className="heading-md mb-4">
              Perencanaan Anggaran Canggih
            </h3>
            <p className="text-slate-600 mb-6">
              Rencanakan masa depan Anda dengan alat perkiraan anggaran cerdas yang beradaptasi dengan pola pengeluaran dan membantu Anda mencapai tujuan keuangan.
            </p>
            <ul className="space-y-3">
              {[
                'Rekomendasi anggaran cerdas berdasarkan pendapatan Anda',
                'Pelacakan dan peringatan pengeluaran berulang',
                'Rencana tabungan berbasis tujuan',
                'Kategori pengeluaran yang dapat disesuaikan'
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start"
                >
                  <Check className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 flex items-center text-teal-500 font-medium"
            >
              Pelajari lebih lanjut tentang anggaran
              <ArrowRight className="ml-2" />
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
          >
            <Image 
              src="/budget-planning.jpg" 
              alt="Budget Planning" 
              width={500} 
              height={350}
              className="rounded-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}