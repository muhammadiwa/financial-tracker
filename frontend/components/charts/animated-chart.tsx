"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data untuk grafik dalam format bahasa Indonesia
const initialData = [
  { name: 'Jan', pengeluaran: 0, pemasukan: 0 },
  { name: 'Feb', pengeluaran: 0, pemasukan: 0 },
  { name: 'Mar', pengeluaran: 0, pemasukan: 0 },
  { name: 'Apr', pengeluaran: 0, pemasukan: 0 },
  { name: 'Mei', pengeluaran: 0, pemasukan: 0 },
  { name: 'Jun', pengeluaran: 0, pemasukan: 0 },
]

const finalData = [
  { name: 'Jan', pengeluaran: 1400000, pemasukan: 2400000 },
  { name: 'Feb', pengeluaran: 1100000, pemasukan: 1800000 },
  { name: 'Mar', pengeluaran: 1200000, pemasukan: 2900000 },
  { name: 'Apr', pengeluaran: 900000, pemasukan: 2200000 },
  { name: 'Mei', pengeluaran: 1500000, pemasukan: 2500000 },
  { name: 'Jun', pengeluaran: 1000000, pemasukan: 2800000 },
]

// Formatter untuk format mata uang Rupiah
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function AnimatedChart() {
  const [data, setData] = useState(initialData)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(finalData)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F766E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
          <XAxis dataKey="name" />
          <YAxis 
            tickFormatter={(value) => value === 0 ? '0' : `${value / 1000000}Jt`} 
          />
          <Tooltip 
            formatter={(value) => formatRupiah(Number(value))}
            labelFormatter={(label) => `Bulan: ${label}`}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }} 
          />
          <Area 
            type="monotone" 
            name="Pengeluaran"
            dataKey="pengeluaran" 
            stroke="#0F766E" 
            fillOpacity={1} 
            fill="url(#colorPengeluaran)" 
          />
          <Area 
            type="monotone" 
            name="Pemasukan"
            dataKey="pemasukan" 
            stroke="#0284C7" 
            fillOpacity={1} 
            fill="url(#colorPemasukan)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}