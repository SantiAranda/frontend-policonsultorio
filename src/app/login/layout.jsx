import { DarkModeToggle}  from "@/components/atoms/DarkModeToggle"

export const metadata = {
  title: "Iniciar sesión - Policonsultorio",
  description: "Acceso al sistema del policonsultorio",
}

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda decorativa */}
      <div className="hidden md:flex md:w-5/12 bg-primary text-primary-foreground items-center justify-center relative">
        <div className="absolute inset-0 opacity-20">
          {/* SVG de fondo */}
        </div>
        <h2 className="z-10 text-3xl font-bold">Bienvenido</h2>
      </div>

      {/* Columna derecha con el login */}
      <div className="flex-1 flex flex-col bg-background theme-transition">
        {/* Header chico con toggle */}
        <div className="flex justify-end p-4">
          <DarkModeToggle />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
