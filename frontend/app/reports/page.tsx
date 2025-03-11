"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Breadcrumb } from "@/components/breadcrumb"

// Sample data
const monthlyReports = [
  { id: "1", month: "Januari", year: "2023", income: 5000000, expense: 4200000 },
  { id: "2", month: "Februari", year: "2023", income: 5200000, expense: 4500000 },
  { id: "3", month: "Maret", year: "2023", income: 5500000, expense: 4800000 },
  { id: "4", month: "April", year: "2023", income: 5300000, expense: 4600000 },
  { id: "5", month: "Mei", year: "2023", income: 5700000, expense: 5000000 },
  { id: "6", month: "Juni", year: "2023", income: 5900000, expense: 5200000 },
]

export default function ReportsPage() {
  // Get current year
  const currentYear = new Date().getFullYear()
  
  // Generate last 5 years automatically
  const years = useMemo(() => {
    return Array.from({length: 5}, (_, i) => currentYear - i)
  }, [currentYear])

  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const router = useRouter()
  const { toast } = useToast()

  const handleDownload = (id: string, month: string) => {
    toast({
      title: "Laporan diunduh",
      description: `Laporan bulan ${month} berhasil diunduh`,
    })
  }

  const handleViewDetail = (id: string) => {
    router.push(`/reports/${id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center h-14 px-4">
          <h1 className="text-lg font-bold lg:hidden">Laporan</h1>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Breadcrumb />
        <div className="flex justify-end mb-6">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laporan Bulanan {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead className="text-right">Pemasukan</TableHead>
                  <TableHead className="text-right">Pengeluaran</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.month}</TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400">
                      {formatCurrency(report.income)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-400">
                      {formatCurrency(report.expense)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(report.income - report.expense)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetail(report.id)}>
                          <Calendar className="h-4 w-4" />
                          <span className="sr-only">Detail</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(report.id, report.month)}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Unduh</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

