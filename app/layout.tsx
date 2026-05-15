import './globals.css'

export const metadata = {
  title: 'Llama 3.1 Chat',
  description: 'Prototipo de chat con IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-white min-h-screen">
        {children}
      </body>
    </html>
  )
}