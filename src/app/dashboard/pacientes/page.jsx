"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
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
  const [selectedPaciente, setSelectedPaciente] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [pacienteAEliminar, setPacienteAEliminar] = useState(null)

  useEffect(() => {
    fetchPacientes()
  }, [fetchPacientes])

  // --- HANDLERS PRINCIPALES ---

  const handleNuevo = () => {
    setSelectedPaciente(null)
    setOpenModal(true)
  }

  const handleEditar = (paciente) => {
    setSelectedPaciente(paciente)
    setOpenModal(true)
  }

  const handleCerrar = () => {
    setOpenModal(false)
    setSelectedPaciente(null)
  }

  const handleGuardado = () => {
    fetchPacientes() // refresca la tabla al guardar nuevo paciente
    handleCerrar()
  }

  const handleEliminar = (paciente) => {
    setPacienteAEliminar(paciente)
    setOpenConfirm(true)
  }

  const confirmarEliminacion = async () => {
    await eliminarPaciente(pacienteAEliminar.idPacientes)
    setOpenConfirm(false)
    setPacienteAEliminar(null)
  }

  // --- COLUMNAS CON ACCIONES DINÁMICAS ---
  const columns = baseColumns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditar(row.original)}
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              onClick={() => handleEliminar(row.original)}
            >
              Eliminar
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
        <Button onClick={handleNuevo}>Nuevo Paciente</Button>
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
        onClose={handleCerrar}
        onSave={handleGuardado}  // 🔥 Nuevo: refresca la tabla al guardar
        paciente={selectedPaciente}
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
