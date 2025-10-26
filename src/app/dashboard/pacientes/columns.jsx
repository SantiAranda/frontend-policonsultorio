"use client"

import { Button } from "@/components/ui/button"

export const columns = [
  {
    accessorKey: "idPacientes",
    header: "ID",
    enableHiding: true,
  },
  {
    accessorKey: "nombreCompleto",
    header: "Nombre Completo",
    cell: ({ row }) => {
      const datosPersonales = row.original.datos_personales
      return `${datosPersonales?.nombre || ''} ${datosPersonales?.apellido || ''}`
    },
  },
  {
    accessorKey: "numAfiliado",
    header: "Número de Afiliado",
  },
  {
    accessorKey: "obraSocial",
    header: "Obra Social",
    cell: ({ row }) => row.original.obra_social?.nombre || 'No especificada'
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const paciente = row.original

      return (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => console.log('Editar', paciente.idPacientes)}
          >
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600"
            onClick={() => console.log('Eliminar', paciente.idPacientes)}
          >
            Eliminar
          </Button>
        </div>
      )
    },
  },
]