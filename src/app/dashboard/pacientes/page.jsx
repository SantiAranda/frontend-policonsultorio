"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { usePacientesStore } from "@/store/pacientes"
import { DataTable } from "@/components/ui/data-table"
import { columns as baseColumns } from "./columns"
import PacienteModal from "@/components/molecules/PacienteModal"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"

export default function PacientesPage() {
  const { pacientes, loading, error, fetchPacientes, eliminarPaciente } = usePacientesStore()
  const [openModal, setOpenModal] = useState(false)
  const [pacienteAEditar, setPacienteAEditar] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [pacienteAEliminar, setPacienteAEliminar] = useState(null)

  useEffect(() => {
    fetchPacientes()
  }, [fetchPacientes])

  const handleNuevo = () => {
    setPacienteAEditar(null)
    setOpenModal(true)
  }

  const handleEditar = (paciente) => {
    setPacienteAEditar(paciente)
    setOpenModal(true)
  }

  const handleCerrar = () => {
    setOpenModal(false)
    setPacienteAEditar(null)
    // No refrescar automáticamente - el modal lo hará si se guardó algo
  }

  const handleEliminar = (paciente) => {
    setPacienteAEliminar(paciente)
    setOpenConfirm(true)
  }

  const confirmarEliminacion = async () => {
    await eliminarPaciente(pacienteAEliminar.idPacientes)
    setOpenConfirm(false)
    setPacienteAEliminar(null)
    fetchPacientes() // Refrescar la tabla después de eliminar
  }

  // Columnas con acciones usando iconos
  const columns = baseColumns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => (
          <div className="flex gap-2 justify-start">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditar(row.original)}
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Editar paciente"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEliminar(row.original)}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Eliminar paciente"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }
    }
    return col
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Button onClick={handleNuevo}>+ Nuevo Paciente</Button>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={pacientes}
          loading={loading}
          error={error}
        />
      </div>

      {/* Modal de crear/editar paciente */}
      <PacienteModal
        open={openModal}
        onClose={(seGuardo) => {
          handleCerrar()
          // Solo refrescar si se guardó algo
          if (seGuardo) {
            fetchPacientes()
          }
        }}
        pacienteAEditar={pacienteAEditar}
      />

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar paciente?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Esta acción no se puede deshacer. El paciente será eliminado permanentemente.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenConfirm(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEliminacion}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}