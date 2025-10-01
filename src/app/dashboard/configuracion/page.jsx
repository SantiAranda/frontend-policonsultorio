"use client"

import ThemeSelector from "@/components/molecules/ThemeSelector"

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configuración</h2>
      <p className="text-muted-foreground">
        Personaliza la apariencia del sistema según la clínica.
      </p>
      <ThemeSelector />
    </div>
  )
}
