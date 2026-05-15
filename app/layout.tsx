import './globals.css'

export const metadata = {
  title: 'Groq Chat API',
  description: 'Prototipo de chat con IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}