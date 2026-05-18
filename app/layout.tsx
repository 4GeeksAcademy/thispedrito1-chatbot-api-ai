import './globals.css'

export const metadata = {
  title: 'Nexus Groq Console',
  description: 'Consola de chat con Groq',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-transparent text-gray-900 antialiased">
        {children}
      </body>
      
    </html>
  )
}