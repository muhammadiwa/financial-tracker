"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

export function StatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    {
      value: 50000,
      label: "Pengguna Aktif",
      suffix: "+",
      delay: 0.1
    },
    {
      value: 10,
      label: "Juta Transaksi Tercatat",
      suffix: "M+",
      delay: 0.2
    },
    {
      value: 98,
      label: "Kepuasan Pelanggan",
      suffix: "%",
      delay: 0.3
    },
    {
      value: 120,
      label: "Negara Terlayani",
      suffix: "+",
      delay: 0.4
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-navy-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: stat.delay }}
              className="p-6"
            >
              <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                {inView && (
                  <CountUp 
                    end={stat.value} 
                    separator="," 
                    duration={2.5} 
                    suffix={stat.suffix} 
                  />
                )}
              </div>
              <p className="text-slate-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}