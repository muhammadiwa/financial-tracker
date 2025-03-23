"use client"

import { motion } from 'framer-motion'
import React from 'react'

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  inView: boolean
}

export function FeatureCard({ icon, title, description, delay, inView }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)' }}
      className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 transition-all duration-300"
    >
      <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-navy-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.div>
  )
}