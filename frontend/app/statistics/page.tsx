"use client"

import { useState } from "react"
import { cn, formatCurrency, getRandomColor } from "@/lib/utils" // Add cn import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Sector,
} from "recharts"
import { Breadcrumb } from "@/components/breadcrumb"
import { HeaderMenu } from "@/components/header-menu"

// Sample data
const expenseByCategory = [
  { name: "Makanan", value: 1200000 },
  { name: "Transportasi", value: 500000 },
  { name: "Hiburan", value: 300000 },
  { name: "Belanja", value: 450000 },
  { name: "Tagihan", value: 800000 },
]

const monthlyData = [
  { name: "Jan", income: 3000000, expense: 2500000 },
  { name: "Feb", income: 3200000, expense: 2700000 },
  { name: "Mar", income: 3500000, expense: 2900000 },
  { name: "Apr", income: 3300000, expense: 2600000 },
  { name: "Mei", income: 3700000, expense: 3100000 },
  { name: "Jun", income: 3900000, expense: 3300000 },
]

export default function StatisticsPage() {
  const [period, setPeriod] = useState("month")
  const router = useRouter()

  const totalExpense = expenseByCategory.reduce((sum, item) => sum + item.value, 0)

  const COLORS = [
    'hsl(var(--success))', // green
    'hsl(var(--warning))', // yellow
    'hsl(var(--destructive))', // red
    'hsl(var(--primary))', // primary
    'hsl(var(--secondary))', // secondary
  ]

  const [activeIndex, setActiveIndex] = useState(-1)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(-1)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm font-medium">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round((payload[0].value / totalExpense) * 100)}% dari total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Statistik</h1>
          <HeaderMenu />
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />
        <div className="flex justify-end mb-6">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-3">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={({ active }) => active ? 110 : 100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                        activeShape={(props) => {
                          const RADIAN = Math.PI / 180
                          const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
                          const sin = Math.sin(-RADIAN * midAngle)
                          const cos = Math.cos(-RADIAN * midAngle)
                          const mx = cx + (outerRadius + 30) * cos
                          const my = cy + (outerRadius + 30) * sin
                          
                          return (
                            <g>
                              <text x={cx} y={cy} dy={-4} textAnchor="middle" fill={fill} className="text-base font-medium">
                                {payload.name}
                              </text>
                              <text x={cx} y={cy} dy={20} textAnchor="middle" fill="text-muted-foreground" className="text-sm">
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                              <Sector
                                cx={cx}
                                cy={cy}
                                innerRadius={innerRadius}
                                outerRadius={outerRadius}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                fill={fill}
                              />
                              <Sector
                                cx={cx}
                                cy={cy}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                innerRadius={outerRadius + 6}
                                outerRadius={outerRadius + 10}
                                fill={fill}
                              />
                            </g>
                          )
                        }}
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            className={cn(
                              "transition-all duration-200",
                              activeIndex === index ? "filter brightness-110 scale-105" : "hover:opacity-80"
                            )}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalExpense)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Pengeluaran
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {expenseByCategory.map((item, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-sm mr-2 group-hover:scale-110 transition-transform" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <span className="font-medium">{Math.round((item.value / totalExpense) * 100)}%</span>
                        </div>
                        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full transition-all duration-500 ease-out group-hover:opacity-80"
                            style={{ 
                              width: `${(item.value / totalExpense) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(item.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pemasukan vs Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="income" name="Pemasukan" fill="#4ade80" />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

