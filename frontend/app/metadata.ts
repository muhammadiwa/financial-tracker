import { Metadata } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const APP_NAME = 'Money Record'
const APP_DESCRIPTION = 'Catat dan kelola keuangan Anda dengan mudah menggunakan Money Record. Fitur lengkap untuk tracking pengeluaran, pemasukan, dan analisis keuangan.'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Aplikasi Pencatat Keuangan`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: [
    'aplikasi keuangan',
    'pencatat keuangan',
    'manajemen keuangan', 
    'tracking pengeluaran',
    'catatan keuangan',
    'money management',
    'expense tracker'
  ],
  authors: [{ name: 'Muhammad Iwa' }],
  creator: 'Muhammad Iwa',
  publisher: 'Technova Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Aplikasi Pencatat Keuangan`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Aplikasi Pencatat Keuangan`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: '@yourusername'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5'
      }
    ]
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#2b5797',
    'theme-color': '#ffffff'
  }
}