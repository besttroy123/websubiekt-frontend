// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'

// Load font outside of component to ensure consistent loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-inter', // Use CSS variable approach
})

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'A comprehensive system for managing inventory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
