import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FirstTranslate - Nederlands ↔ Japans',
  description: 'Offline vertaalapp voor Nederlands en Japans - Perfect voor je Japan trip!',
  keywords: 'vertaling, nederlands, japans, offline, japan, reis, pwa',
  authors: [{ name: 'Aik' }],
  creator: 'Aik',
  publisher: 'FirstTranslate',
  robots: 'index, follow',
  openGraph: {
    title: 'FirstTranslate - Nederlands ↔ Japans',
    description: 'Offline vertaalapp voor Nederlands en Japans',
    type: 'website',
    locale: 'nl_NL',
    siteName: 'FirstTranslate'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FirstTranslate - Nederlands ↔ Japans',
    description: 'Offline vertaalapp voor Nederlands en Japans'
  }
}

export const viewport = {
  themeColor: '#0d9488',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FirstTranslate" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="FirstTranslate" />
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 