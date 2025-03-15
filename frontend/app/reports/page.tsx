"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Breadcrumb } from "@/components/breadcrumb"
import axios from '@/lib/axios'

export default function ReportsPage() {
  const currentYear = new Date().getFullYear()
  const years = useMemo(() => {
    return Array.from({length: 5}, (_, i) => currentYear - i)
  }, [currentYear])

  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchReports()
  }, [selectedYear])

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/reports/monthly', {
        params: { year: selectedYear }
      })
      if (response.data.status === 'success') {
        setReports(response.data.data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data laporan",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (id: string, month: string) => {
    try {
      // Convert month name to month number
      const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;
      
      const response = await axios.get(`/reports/download/${monthNumber}`, {
        params: { year: selectedYear },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report-${month}-${selectedYear}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast({
        title: "Laporan diunduh",
        description: `Laporan bulan ${month} berhasil diunduh`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengunduh laporan",
        duration: 3000,
      })
    }
  }

  const handleViewDetail = (id: string, month: string) => {
    try {
      // Convert month name to month number
      const date = new Date(`${month} 1, ${selectedYear}`);
      const monthNumber = (date.getMonth() + 1).toString().padStart(2, '0');
      
      // Use router.push with a URL string instead of object
      router.push(`/transactions?month=${monthNumber}&year=${selectedYear}`);
    } catch (error) {
      console.error('Error navigating to transactions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal membuka detail transaksi",
      });
    }
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
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
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
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.month}</TableCell>
                      <TableCell className="text-right text-green-600 dark:text-green-400">
                        {formatCurrency(report.income)}
                      </TableCell>
                      <TableCell className="text-right text-red-600 dark:text-red-400">
                        {formatCurrency(report.expense)}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(report.balance)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewDetail(report.id, report.month)}
                          >
                            <Calendar className="h-4 w-4" />
                            <span className="sr-only">Detail</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownload(report.id, report.month)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Unduh</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

