"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from '@/lib/axios'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { 
  AtSign, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  Send,
  CheckCircle2,
  ChevronRight,
  Globe,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Nama wajib diisi minimal 2 karakter' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  subject: z.string().min(5, { message: 'Subjek wajib diisi minimal 5 karakter' }),
  message: z.string().min(10, { message: 'Pesan wajib diisi minimal 10 karakter' }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/contact', data)
      
      if (response.data.status === 'success') {
        toast({
          title: "Pesan Terkirim",
          description: "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
        })
        form.reset()
        setIsSuccess(true)
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim Pesan",
        description: error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi nanti",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
          </svg>
          <defs>
            <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="text-5xl font-bold mb-6">Hubungi Kami</h1>
            <p className="text-xl text-white/90 mb-8">
              Punya pertanyaan atau saran? Tim kami siap mendengarkan dan membantu Anda
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/#faq" 
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Lihat FAQ
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              <a 
                href="#contact-form" 
                className="bg-white text-teal-700 hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Kirim Pesan
                <Send className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Wave Shape Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 relative z-10 -mt-20">
        {/* Contact cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 shadow-xl border border-slate-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="rounded-full bg-gradient-to-br from-teal-400 to-teal-600 w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-navy-800">Email Kami</h3>
            <p className="text-slate-600 mb-3">Respon cepat dalam 24 jam</p>
            <a 
              href="mailto:support@moneyrecord.id" 
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center group-hover:translate-x-1 transition-transform"
            >
              support@catatankeuangan.web.id
              <ChevronRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="bg-white rounded-xl p-6 shadow-xl border border-slate-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-navy-800">Telepon</h3>
            <p className="text-slate-600 mb-3">Senin - Jumat, 09:00 - 17:00 WIB</p>
            <a 
              href="tel:+628" 
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center group-hover:translate-x-1 transition-transform"
            >
              +62 878 175 0971
              <ChevronRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="bg-white rounded-xl p-6 shadow-xl border border-slate-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-navy-800">Kantor</h3>
            <p className="text-slate-600 mb-3">Jl. Teknologi No. 12, Jakarta Selatan</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center group-hover:translate-x-1 transition-transform"
            >
              Lihat di Google Maps
              <ChevronRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start mb-20">
          {/* Contact Form Column */}
          <motion.div
            variants={fadeIn}
            initial="hidden" 
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-7"
            id="contact-form"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="p-8 bg-gradient-to-r from-teal-500 to-teal-600">
                <h2 className="text-3xl font-bold mb-2 text-white">Kirim Pesan</h2>
                <p className="text-teal-50">
                  Isi formulir di bawah ini dan tim kami akan menghubungi Anda segera
                </p>
              </div>
              
              <div className="p-8">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-teal-100">
                      <CheckCircle2 className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-navy-800">Pesan Terkirim!</h3>
                    <p className="text-slate-600 mb-6">
                      Terima kasih telah menghubungi kami. Tim kami akan merespons secepatnya.
                    </p>
                    <Button 
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                    >
                      Kirim Pesan Lain
                    </Button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-navy-800">Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Masukkan nama lengkap" 
                                  {...field} 
                                  className="rounded-lg border-slate-200 focus:border-teal-500 focus:ring-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-navy-800">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="nama@email.com" 
                                  {...field}
                                  className="rounded-lg border-slate-200 focus:border-teal-500 focus:ring-teal-500 bg-white text-slate-800 placeholder:text-slate-400" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-navy-800">Subjek</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Subjek pesan" 
                                {...field}
                                className="rounded-lg border-slate-200 focus:border-teal-500 focus:ring-teal-500 bg-white text-slate-800 placeholder:text-slate-400" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-navy-800">Pesan</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tuliskan pesan Anda di sini..." 
                                className="min-h-[150px] rounded-lg border-slate-200 focus:border-teal-500 focus:ring-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg py-3 px-6 font-medium text-base shadow-md hover:shadow-lg transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="mr-2 h-5 w-5" />
                            Kirim Pesan
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Info Column */}
          <motion.div
            variants={fadeIn}
            initial="hidden" 
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="md:col-span-5 space-y-6"
          >
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image 
                  src="/images/map.jpg" 
                  alt="Lokasi Kantor" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="font-bold text-xl">Kantor Jakarta</h3>
                    <p className="text-white/80">Jl. Teknologi No. 12, Jakarta Selatan</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="flex items-center font-semibold text-lg mb-3 text-navy-800">
                  <Clock className="mr-2 h-5 w-5 text-teal-500" />
                  Jam Operasional
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Senin - Jumat</span>
                    <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium">
                      09:00 - 17:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Sabtu</span>
                    <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium">
                      09:00 - 14:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-medium">Minggu & Hari Libur</span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                      Tutup
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="flex items-center font-semibold text-lg mb-1 text-navy-800">
                  <MessageSquare className="mr-2 h-5 w-5 text-teal-500" />
                  FAQ Populer
                </h3>
                <p className="text-sm text-slate-500">
                  Pertanyaan yang sering ditanyakan
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="group">
                  <h4 className="font-medium mb-2 flex items-center text-navy-800 group-hover:text-teal-600 transition-colors">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                    Berapa lama waktu respon?
                  </h4>
                  <p className="text-sm text-slate-600 ml-3.5">
                    Kami merespon semua pertanyaan dalam waktu 24 jam pada hari kerja.
                  </p>
                </div>
                <div className="group">
                  <h4 className="font-medium mb-2 flex items-center text-navy-800 group-hover:text-teal-600 transition-colors">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                    Apakah ada biaya berlangganan?
                  </h4>
                  <p className="text-sm text-slate-600 ml-3.5">
                    Money Record menawarkan paket gratis dan berbayar. Anda dapat melihat detail lengkap di halaman Harga.
                  </p>
                </div>
                <div className="group">
                  <h4 className="font-medium mb-2 flex items-center text-navy-800 group-hover:text-teal-600 transition-colors">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                    Bagaimana cara membatalkan akun?
                  </h4>
                  <p className="text-sm text-slate-600 ml-3.5">
                    Anda dapat membatalkan akun kapan saja melalui pengaturan akun tanpa biaya penalti.
                  </p>
                </div>
                <Link
                  href="/#faq"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 mt-2 hover:underline"
                >
                  Lihat semua FAQ
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="flex items-center font-semibold text-lg mb-1 text-navy-800">
                  <Globe className="mr-2 h-5 w-5 text-teal-500" />
                  Media Sosial
                </h3>
                <p className="text-sm text-slate-500">
                  Ikuti kami untuk berita dan update terbaru
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-teal-50 transition-colors group">
                    <svg className="h-6 w-6 text-slate-600 group-hover:text-teal-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-xs mt-2 text-slate-600 group-hover:text-teal-600 transition-colors">Facebook</span>
                  </a>
                  <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-teal-50 transition-colors group">
                    <svg className="h-6 w-6 text-slate-600 group-hover:text-teal-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span className="text-xs mt-2 text-slate-600 group-hover:text-teal-600 transition-colors">Twitter</span>
                  </a>
                  <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-teal-50 transition-colors group">
                    <svg className="h-6 w-6 text-slate-600 group-hover:text-teal-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                    <span className="text-xs mt-2 text-slate-600 group-hover:text-teal-600 transition-colors">Instagram</span>
                  </a>
                  <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-teal-50 transition-colors group">
                    <svg className="h-6 w-6 text-slate-600 group-hover:text-teal-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs mt-2 text-slate-600 group-hover:text-teal-600 transition-colors">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* CTA Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-800 to-navy-900 rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 relative mt-24"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="dots-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-pattern)" />
            </svg>
          </div>
          
          <div className="relative z-10 md:flex items-center justify-between">
            <div className="md:pr-12 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap untuk memulai dengan Money Record?
              </h2>
              <p className="text-slate-300 text-lg mb-6 max-w-xl">
                Dapatkan kontrol penuh atas keuangan Anda hari ini. Mulai gratis, tanpa kartu kredit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Daftar Gratis
                </Link>
                <Link href="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Login
                </Link>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="p-1 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl">
                <div className="bg-navy-800 p-1 rounded-xl">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-teal-500/20 p-3 rounded-lg flex items-center justify-center">
                      <Heart className="h-8 w-8 text-teal-500" />
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="bg-yellow-500/20 p-3 rounded-lg flex items-center justify-center">
                      <Globe className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}