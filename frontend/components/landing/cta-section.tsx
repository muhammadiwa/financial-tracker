"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Mengubah Kehidupan Keuangan Anda?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Bergabunglah dengan ribuan pengguna yang telah mengambil kendali atas keuangan mereka
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/register"
              className="bg-white text-teal-600 font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
            >
              Mulai Uji Coba Gratis Hari Ini
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}