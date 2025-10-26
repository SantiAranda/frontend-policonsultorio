"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function EditarObraSocialPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { id } = params
  const [nombre, setNombre] = useState("")
  const [estado, setEstado] = useState("")

  useEffect(() => {
    if (id) {
      const fetchObraSocial = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/obras-sociales/${id}`)
          const data = await response.json()
          if (data.status === 'success') {
            setNombre(data.data.nombre)
            setEstado(data.data.estado)
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: data.message || "Error al cargar la obra social.",
            })
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Error de red al cargar la obra social.",
          })
        }
      }
      fetchObraSocial()
    }
  }, [id, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:8000/api/obras-sociales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, estado }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        toast({
          title: "Éxito",
          description: "Obra social actualizada con éxito.",
        })
        router.push("/dashboard/obras-sociales")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Error al actualizar la obra social.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error de red al actualizar la obra social.",
      })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Obra Social</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}