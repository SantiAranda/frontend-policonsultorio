import DarkModeToggle from "@/components/atoms/DarkModeToggle"

export const metadata = {
  title: "Iniciar sesión - Policonsultorio",
  description: "Acceso al sistema del policonsultorio",
}

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Botón de modo oscuro/claro */}
      <DarkModeToggle />

      {/* Columna izquierda decorativa */}
      <div className="hidden md:flex md:w-5/12 bg-primary text-primary-foreground items-center justify-center relative">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="none">
            <path
              d="M0,100 L100,50 L200,80 L300,20 L400,100 L500,0"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <path
              d="M0,200 L100,150 L200,180 L300,120 L400,200 L500,100"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h2 className="z-10 text-3xl font-bold">Bienvenido</h2>
      </div>

      {/* Columna derecha con el login */}
      <div className="flex-1 flex items-center justify-center bg-background theme-transition">
        {children}
      </div>
    </div>
  )
}