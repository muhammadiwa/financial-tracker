import Link from 'next/link'
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-navy-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                Money<span className="text-teal-400">Record</span>
              </span>
            </Link>
            <p className="text-slate-300 mb-6 max-w-md">
              Money Record membantu Anda mengambil alih kendali keuangan dengan pelacakan intuitif, 
              alat penganggaran, dan wawasan yang dapat ditindaklanjuti.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-teal-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Produk</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-slate-300 hover:text-teal-400 transition-colors">Fitur</Link></li>
              <li><Link href="#pricing" className="text-slate-300 hover:text-teal-400 transition-colors">Harga</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Integrasi</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Pembaruan</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sumber Daya</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Panduan</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Dokumentasi API</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Tentang</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Karir</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Kontak</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-teal-400 transition-colors">Partner</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Money Record. Seluruh hak cipta dilindungi.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-teal-400 transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">Syarat dan Ketentuan</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">Kebijakan Cookie</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}