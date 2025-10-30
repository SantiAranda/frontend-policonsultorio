"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { usePacientesStore } from "@/store/pacientes"
import { useObrasSocialesStore } from "@/store/obrasSociales"
import DatoPersonalModal from  "@/components/molecules/DatoPersonalModal"


export default function PacienteModal({ open, onClose, pacienteAEditar = null }) {
  const { toast } = useToast()
  const { agregarPaciente } = usePacientesStore()
  const { obrasSociales, fetchObrasSociales } = useObrasSocialesStore()

  const [datosPersonales, setDatosPersonales] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [datoSeleccionado, setDatoSeleccionado] = useState(null)
  const [esParticular, setEsParticular] = useState("")
  const [obraSocialSeleccionada, setObraSocialSeleccionada] = useState("")
  const [numAfiliado, setNumAfiliado] = useState("")
  const [abrirModalDato, setAbrirModalDato] = useState(false)
  const [datoPersonalAEditar, setDatoPersonalAEditar] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")
  const [seGuardo, setSeGuardo] = useState(false) // ⬅️ NUEVO: tracking si se guardó
  
  const fetchDatos = async () => {
    try {
      const resDatos = await fetch("http://localhost:8000/api/datos-personales")
      const dataDatos = await resDatos.json()
      setDatosPersonales(Array.isArray(dataDatos.data?.datosPersonales) ? dataDatos.data.datosPersonales : [])
    } catch (err) {
      console.error("❌ Error al traer datos personales:", err)
      setDatosPersonales([])
    }

    try {
      const resPacientes = await fetch("http://localhost:8000/api/pacientes")
      const dataPacientes = await resPacientes.json()
      setPacientes(Array.isArray(dataPacientes.data) ? dataPacientes.data : [])
    } catch (err) {
      console.error("❌ Error al traer pacientes:", err)
      setPacientes([])
    }
  }

  useEffect(() => {
    if (open) {
      fetchDatos()
      fetchObrasSociales()
      setSeGuardo(false) // ⬅️ Resetear al abrir
      
      if (pacienteAEditar) {
        // Modo edición: cargar datos del paciente
        const idDato = pacienteAEditar.datosPersonales_idDatosPersonales || 
                       pacienteAEditar.datos_personales?.idDatosPersonales ||
                       pacienteAEditar.datosPersonales?.idDatosPersonales
        
        setDatoSeleccionado(String(idDato))
        setEsParticular(pacienteAEditar.particular === 1 ? "si" : "no")
        setObraSocialSeleccionada(String(pacienteAEditar.obrasSociales_idObrasSociales || ""))
        setNumAfiliado(pacienteAEditar.numAfiliado || "")
      } else {
        // Modo creación: limpiar campos
        setDatoSeleccionado(null)
        setEsParticular("")
        setObraSocialSeleccionada("")
        setNumAfiliado("")
      }
      
      setMensaje("")
      setTipoMensaje("")
    }
  }, [open, pacienteAEditar])

  const obraSocialParticular = obrasSociales.find(os => 
    os.nombre?.toLowerCase().includes('particular') || 
    os.nombre?.toLowerCase().includes('sin obra')
  ) || obrasSociales[0]

  const datosFiltrados = pacienteAEditar 
    ? datosPersonales // Si estamos editando, mostrar todos los datos
    : datosPersonales.filter((dp) => {
        const idDP = Number(dp.idDatosPersonales)
        return !pacientes.some((p) => {
          const idAsociado =
            Number(p.datosPersonales_idDatosPersonales) ||
            Number(p.datos_personales?.idDatosPersonales) ||
            Number(p.datosPersonales?.idDatosPersonales) ||
            null
          return idAsociado === idDP
        })
      })

  const puedeGuardar =
    datoSeleccionado &&
    esParticular !== "" &&
    (esParticular === "si" ||
      (esParticular === "no" && obraSocialSeleccionada && numAfiliado.trim() !== ""))

  const handleEditarDatoPersonal = () => {
    // Primero intentar obtener del paciente directamente
    let datoActual = pacienteAEditar?.datosPersonales || 
                     pacienteAEditar?.datos_personales ||
                     pacienteAEditar?.datosPersonales_idDatosPersonales

    // Si es solo un ID, buscar en el array de datos personales
    if (!datoActual || typeof datoActual === 'number') {
      datoActual = datosPersonales.find(dp => dp.idDatosPersonales === Number(datoSeleccionado))
    }

    if (datoActual && datoActual.idDatosPersonales) {
      console.log("📝 Editando dato personal:", datoActual)
      setDatoPersonalAEditar(datoActual)
      setAbrirModalDato(true)
    } else {
      console.error("❌ No se encontró el dato personal. datoSeleccionado:", datoSeleccionado)
      toast({
        title: "Error",
        description: "No se encontró el dato personal para editar",
        variant: "destructive"
      })
    }
  }

  const handleDatoPersonalGuardado = async () => {
    // Refrescar datos personales después de editar
    await fetchDatos()
    setSeGuardo(true) // ⬅️ Marcar que hubo cambios
  }

  const handleGuardar = async () => {
    setGuardando(true)
    setMensaje("")
    setTipoMensaje("")

    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
      
      const body = {
        particular: esParticular === "si" ? 1 : 0,
        datosPersonales_idDatosPersonales: Number(datoSeleccionado),
        obrasSociales_idObrasSociales: esParticular === "si" 
          ? Number(obraSocialParticular?.idObrasSociales || 1)
          : Number(obraSocialSeleccionada),
        numAfiliado: esParticular === "si" ? "N/A" : numAfiliado,
      }

      // Solo agregar timestamps si estamos creando
      if (!pacienteAEditar) {
        body.created_at = now
        body.updated_at = now
      }

      const url = pacienteAEditar
        ? `http://localhost:8000/api/pacientes/${pacienteAEditar.idPacientes}`
        : "http://localhost:8000/api/pacientes"
      
      const method = pacienteAEditar ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const responseText = await res.text()
      let data
      
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Error del servidor (Status ${res.status})`)
      }

      if (!res.ok) {
        throw new Error(data?.message || `Error al ${pacienteAEditar ? 'actualizar' : 'guardar'} el paciente`)
      }

      setGuardando(false)
      setMensaje(`✅ Paciente ${pacienteAEditar ? 'actualizado' : 'guardado'} correctamente`)
      setTipoMensaje("success")
      setSeGuardo(true) // ⬅️ Marcar que se guardó

      toast({ 
        title: `✅ Paciente ${pacienteAEditar ? 'actualizado' : 'guardado'} correctamente`, 
        variant: "success",
        duration: 1500 
      })

      // ⏱️ TIEMPO DE ESPERA ANTES DE CERRAR (en milisegundos)
      // 🔧 Para reducir el tiempo, cambia 5000 por otro valor (ej: 2000 = 2 segundos)
      setTimeout(() => {
        onClose(true) // ⬅️ Pasar true porque se guardó
      }, 5000)

    } catch (err) {
      console.error(`❌ Error al ${pacienteAEditar ? 'actualizar' : 'guardar'} paciente:`, err)
      
      setGuardando(false)
      setMensaje(`❌ Error: ${err.message}`)
      setTipoMensaje("error")
      
      toast({ 
        title: `❌ Error al ${pacienteAEditar ? 'actualizar' : 'guardar'} el paciente`, 
        description: err.message, 
        variant: "destructive" 
      })
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose(seGuardo) // ⬅️ Pasar si se guardó al cerrar
        }
      }}
    >
      <DialogContent className="max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>{pacienteAEditar ? 'Editar Paciente' : 'Nuevo Paciente'}</DialogTitle>
          <DialogDescription id="dialog-description">
            Complete los datos para {pacienteAEditar ? 'actualizar el' : 'registrar un nuevo'} paciente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="font-medium text-sm">Seleccionar datos personales</label>

          {datosFiltrados.length === 0 && !pacienteAEditar && (
            <p className="text-sm text-muted-foreground mb-2">
              No hay datos personales disponibles.
            </p>
          )}

          <Select
            value={datoSeleccionado ?? undefined}
            onValueChange={(val) => setDatoSeleccionado(val || null)}
            disabled={!!pacienteAEditar}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un dato personal" />
            </SelectTrigger>
            <SelectContent>
              {datosFiltrados.map((dp) => (
                <SelectItem key={dp.idDatosPersonales} value={String(dp.idDatosPersonales)}>
                  {dp.nombre} {dp.apellido} - {dp.documento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!pacienteAEditar && (
            <Button
              variant="outline"
              onClick={() => {
                setDatoPersonalAEditar(null)
                setAbrirModalDato(true)
              }}
              disabled={datoSeleccionado !== null}
              className="mt-2 w-full"
            >
              ➕ Agregar nuevo dato personal
            </Button>
          )}

          {pacienteAEditar && datoSeleccionado && (
            <Button
              variant="outline"
              onClick={handleEditarDatoPersonal}
              className="mt-2 w-full"
            >
              ✏️ Editar datos personales
            </Button>
          )}

          {datoSeleccionado && (
            <>
              <label className="font-medium text-sm">¿Es particular?</label>
              <Select
                value={esParticular || undefined}
                onValueChange={(val) => setEsParticular(val || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {esParticular === "no" && (
            <>
              <label className="font-medium text-sm">Obra Social</label>
              <Select
                value={obraSocialSeleccionada || undefined}
                onValueChange={(val) => setObraSocialSeleccionada(val || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione obra social" />
                </SelectTrigger>
                <SelectContent>
                  {obrasSociales.map((os) => (
                    <SelectItem key={os.idObrasSociales} value={String(os.idObrasSociales)}>
                      {os.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="font-medium text-sm">Número de Afiliado</label>
              <Input
                placeholder="Ingrese número de afiliado"
                value={numAfiliado}
                onChange={(e) => setNumAfiliado(e.target.value)}
              />
            </>
          )}

          <Button
            disabled={!puedeGuardar || guardando}
            onClick={handleGuardar}
            className={`w-full ${
              guardando
                ? "bg-blue-500 hover:bg-blue-500"
                : puedeGuardar
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white`}
          >
            {guardando ? "⏳ Guardando..." : `💾 ${pacienteAEditar ? 'Actualizar' : 'Guardar'}`}
          </Button>

          {mensaje && (
            <div
              className={`text-center text-sm font-semibold p-3 rounded-md transition-all duration-300 ${
                tipoMensaje === "success"
                  ? "bg-green-100 text-green-700 border border-green-400"
                  : "bg-red-100 text-red-700 border border-red-400"
              }`}
            >
              {mensaje}
            </div>
          )}
        </div>
      </DialogContent>
      <DatoPersonalModal 
        open={abrirModalDato} 
        onClose={() => {
          setAbrirModalDato(false)
          setDatoPersonalAEditar(null)
        }} 
        onGuardado={handleDatoPersonalGuardado} 
        datoAEditar={datoPersonalAEditar}
      />
    </Dialog>
  )
}