"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">120</p>
          <p className="text-muted-foreground text-sm">Total en ambas clínicas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Turnos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">15</p>
          <p className="text-muted-foreground text-sm">Hoy y mañana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">8</p>
          <p className="text-muted-foreground text-sm">Activas en el sistema</p>
        </CardContent>
      </Card>
    </div>
  )
}
