import "./globals.css"

export const metadata = {
  title: "Policonsultorio",
  description: "Sistema de gestión para clínicas",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
