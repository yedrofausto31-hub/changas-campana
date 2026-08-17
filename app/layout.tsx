import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Changas Campana',
  description: 'Plataforma comunitaria de trabajos y servicios en Campana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  )
}
