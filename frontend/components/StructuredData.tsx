export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Money Record",
    "url": process.env.NEXT_PUBLIC_APP_URL,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "description": "Aplikasi pencatat keuangan yang membantu Anda mengelola pemasukan dan pengeluaran dengan mudah",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    },
    "author": {
      "@type": "Organization",
      "name": "Your Company Name",
      "url": process.env.NEXT_PUBLIC_APP_URL
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}