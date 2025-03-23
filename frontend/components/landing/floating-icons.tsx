"use client"

import { motion } from 'framer-motion'
import { 
  DollarSign, PieChart, BarChart2, TrendingUp, 
  CreditCard, Calendar, Shield, Star
} from 'lucide-react'

export function FloatingIcons() {
  const icons = [
    { Icon: DollarSign, x: '10%', y: '20%', size: 20, delay: 0 },
    { Icon: PieChart, x: '85%', y: '15%', size: 24, delay: 0.5 },
    { Icon: BarChart2, x: '70%', y: '80%', size: 28, delay: 1 },
    { Icon: TrendingUp, x: '20%', y: '70%', size: 22, delay: 1.5 },
    { Icon: CreditCard, x: '40%', y: '30%', size: 26, delay: 2 },
    { Icon: Calendar, x: '60%', y: '60%', size: 20, delay: 2.5 },
    { Icon: Shield, x: '25%', y: '45%', size: 18, delay: 3 },
    { Icon: Star, x: '80%', y: '40%', size: 16, delay: 3.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-teal-500/30"
          style={{ 
            left: item.x, 
            top: item.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            y: ["0%", "-20%", "-40%", "-60%"]
          }}
          transition={{ 
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  )
}