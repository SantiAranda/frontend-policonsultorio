"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ObrasSocialesPage() {
  const [obrasSociales, setObrasSociales] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  const fetchObrasSociales = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/obras-sociales/all")
      const data = await response.json()
      if (data.status === 'success') {
        setObrasSociales(data.data)
      }
    } catch (error) {
      console.error("Error fetching obras sociales:", error)
    }
  }

  useEffect(() => {
    fetchObrasSociales()
  }, [])

  const handleEdit = (id) => {
    router.push(`/dashboard/obras-sociales/editar/${id}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta obra social?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/obras-sociales/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.status === 'success') {
          toast({
            title: "Éxito",
            description: "Obra social eliminada con éxito.",
          })
          // Refresh the list
          fetchObrasSociales()
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Error al eliminar la obra social.",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error de red al eliminar la obra social.",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Obras Sociales</CardTitle>
        <Button onClick={() => router.push("/dashboard/obras-sociales/crear")}>
          Crear Obra Social
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obrasSociales.map((obraSocial) => (
              <TableRow key={obraSocial.idObrasSociales}>
                <TableCell>{obraSocial.nombre}</TableCell>
                <TableCell>
                  <Badge variant={obraSocial.estado === "Activo" ? "default" : "destructive"}>
                    {obraSocial.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(obraSocial.idObrasSociales)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(obraSocial.idObrasSociales)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}