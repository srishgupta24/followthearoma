import type { Metadata }           from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Navbar }  from '@/components/layout/Navbar'
import { Footer }  from '@/components/layout/Footer'

// ── FONTS ─────────────────────────────────────────────────────
// Playfair Display — classic American editorial newspaper energy.
// Beautiful italic for the logo. Used for all display headings.
const playfair = Playfair_Display({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-playfair',
})

// Inter — clean, modern, highly readable at all sizes.
// Used for body copy, labels, nav, UI elements.
const inter = Inter({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default:  'Follow The Aroma — Home Cooking, Unmeasured',
    template: '%s | Follow The Aroma',
  },
  description:
    'A vegetarian family kitchen. Indian at heart, global at the table. ' +
    'Real food, cooked by feel, written down for you.',
  keywords: [
    'vegetarian recipes',
    'Indian home cooking',
    'family meals',
    'healthy breakfast',
    'follow the aroma',
  ],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://followthearoma.com',
    siteName:    'Follow The Aroma',
    description: 'Vegetarian home cooking. Indian roots. Global table.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@followthearoma',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
