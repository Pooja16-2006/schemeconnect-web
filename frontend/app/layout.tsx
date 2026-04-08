import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ChatbotWidget from "@/components/chatbot-widget";
import { LanguageProvider } from "@/components/language-provider";

export const metadata: Metadata = {
  title: 'SchemeConnect - Government Welfare Scheme Portal',
  description: 'Check your eligibility for government welfare schemes and track your applications. A digital initiative for citizen empowerment.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <Analytics />
          <ChatbotWidget />
        </LanguageProvider>
      </body>
    </html>
  )
}