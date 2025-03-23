"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'

type PricingCardProps = {
  title: string
  price: number
  period: string
  description: string
  features: string[]
  cta: string
  isPopular: boolean
  delay: number
  inView: boolean
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  cta,
  isPopular,
  delay,
  inView
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        isPopular 
          ? 'bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-xl scale-105' 
          : 'bg-white border border-slate-200 text-slate-600 shadow-lg'
      }`}
    >
      {isPopular && (
        <div className="bg-teal-600 py-2 text-center text-sm font-medium">
          Paling Populer
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <h3 className={`text-xl font-bold mb-4 ${isPopular ? 'text-white' : 'text-navy-800'}`}>
          {title}
        </h3>
        
        <div className="mb-6">
          <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-navy-800'}`}>
            Rp{price}k
          </span>
          <span className={isPopular ? 'text-white/80' : 'text-slate-500'}>
            {period}
          </span>
        </div>
        
        <p className={`mb-6 ${isPopular ? 'text-white/90' : 'text-slate-600'}`}>
          {description}
        </p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check 
                className={`mt-1 mr-2 flex-shrink-0 ${isPopular ? 'text-teal-300' : 'text-teal-500'}`} 
                size={18}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/register"
            className={`block w-full py-3 rounded-lg font-medium text-center transition-colors ${
              isPopular 
                ? 'bg-white text-teal-600 hover:bg-slate-100' 
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {cta}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}