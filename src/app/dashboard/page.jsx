"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Stethoscope } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary"
        onClick={() => router.push('/dashboard/pacientes')}
      >
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pacientes Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">120</p>
          <p className="text-muted-foreground text-sm">Total en ambas clínicas</p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary"
        onClick={() => router.push('/dashboard/turnos')}
      >
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Turnos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">15</p>
          <p className="text-muted-foreground text-sm">Hoy y mañana</p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary"
        onClick={() => router.push('/dashboard/especialidades')}
      >
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Especialidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">8</p>
          <p className="text-muted-foreground text-sm">Activas en el sistema</p>
        </CardContent>
      </Card>
    </div>
  )
}