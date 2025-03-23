import { Metadata } from 'next'

const APP_NAME = 'Money Record'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: `Hubungi Kami | ${APP_NAME}`,
  description: 'Punya pertanyaan atau masukan? Hubungi tim Money Record untuk bantuan dan dukungan.',
  openGraph: {
    title: `Hubungi Kami | ${APP_NAME}`,
    description: 'Punya pertanyaan atau masukan? Hubungi tim Money Record untuk bantuan dan dukungan.',
    url: `${APP_URL}/contact`
  }
}