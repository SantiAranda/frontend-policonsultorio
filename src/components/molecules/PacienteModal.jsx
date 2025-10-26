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


export default function PacienteModal({ open, onClose }) {
  const { toast } = useToast()
  const { agregarPaciente } = usePacientesStore()
  const { obrasSociales, fetchObrasSociales } = useObrasSocialesStore()

  // Estados
  const [datosPersonales, setDatosPersonales] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [datoSeleccionado, setDatoSeleccionado] = useState(null)
  const [esParticular, setEsParticular] = useState("")
  const [obraSocialSeleccionada, setObraSocialSeleccionada] = useState("")
  const [numAfiliado, setNumAfiliado] = useState("")
  const [abrirModalDato, setAbrirModalDato] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")
  

  // Traer datos personales y pacientes
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

  // Resetear estados al abrir el modal
  useEffect(() => {
    if (open) {
      fetchDatos()
      fetchObrasSociales()
      setDatoSeleccionado(null)
      setEsParticular("")
      setObraSocialSeleccionada("")
      setNumAfiliado("")
      setMensaje("")
      setTipoMensaje("")
    }
  }, [open])

  // Buscar obra social "Particular" después de cargar las obras sociales
  const obraSocialParticular = obrasSociales.find(os => 
    os.nombre?.toLowerCase().includes('particular') || 
    os.nombre?.toLowerCase().includes('sin obra')
  ) || obrasSociales[0]

  console.log("🔍 Obra social Particular encontrada:", obraSocialParticular)

  // Filtrar datos personales que no tengan paciente asociado
  const datosFiltrados = datosPersonales.filter((dp) => {
    const idDP = Number(dp.idDatosPersonales)
    const tienePatiente = pacientes.some((p) => {
      const idAsociado =
        Number(p.datosPersonales_idDatosPersonales) ||
        Number(p.datos_personales?.idDatosPersonales) ||
        Number(p.datosPersonales?.idDatosPersonales) ||
        null
      return idAsociado === idDP
    })
    console.log(`Dato ${idDP} (${dp.nombre} ${dp.apellido}) - Tiene paciente: ${tienePatiente}`)
    return !tienePatiente
  })

  // Validación para habilitar Guardar
  const puedeGuardar =
    datoSeleccionado &&
    esParticular !== "" &&
    (esParticular === "si" ||
      (esParticular === "no" && obraSocialSeleccionada && numAfiliado.trim() !== ""))

  // Guardar paciente
  const handleGuardar = async () => {
    setGuardando(true)
    setMensaje("")
    setTipoMensaje("")

    try {
      const body = {
        particular: esParticular === "si" ? 1 : 0,
        datosPersonales_idDatosPersonales: Number(datoSeleccionado),
        // 🔧 Si es particular, usa obra social "Particular" o la primera disponible
        obrasSociales_idObrasSociales: esParticular === "si" 
          ? Number(obraSocialParticular?.idObrasSociales || 1) // fallback a 1 si no encuentra
          : Number(obraSocialSeleccionada),
        // 🔧 Si es particular, envía "N/A" en vez de null
        numAfiliado: esParticular === "si" ? "N/A" : numAfiliado,
      }

      console.log("📤 Enviando:", body)
      console.log("🔍 Obra social particular usada:", obraSocialParticular)

      const res = await fetch("http://localhost:8000/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("❌ Error del servidor:", data)
        console.log("Detalle completo:", JSON.stringify(data, null, 2))
        throw new Error(data?.message || "Error al guardar el paciente")
      }

      console.log("✅ Paciente creado:", data)

      // 🔧 CREAR USUARIO AUTOMÁTICAMENTE después de crear el paciente
      try {
        const datoPersonal = datosPersonales.find(dp => dp.idDatosPersonales === Number(datoSeleccionado))
        const userBody = {
          email: `paciente${datoSeleccionado}@temp.com`,
          password: "1234",
          rol: "paciente",
          estado: "Activo",
          datosPersonales_idDatosPersonales: Number(datoSeleccionado)
        }

        console.log("📤 Creando usuario:", userBody)

        const resUser = await fetch("http://localhost:8000/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userBody),
        })

        const dataUser = await resUser.json()

        if (!resUser.ok) {
          console.warn("⚠️ No se pudo crear el usuario:", dataUser)
          // No lanzamos error, solo advertimos
        } else {
          console.log("✅ Usuario creado:", dataUser)
        }
      } catch (errUser) {
        console.warn("⚠️ Error al crear usuario (no crítico):", errUser)
        // Continuamos aunque falle la creación del usuario
      }

      // ✅ Éxito
      setGuardando(false)
      setMensaje("✅ Paciente guardado correctamente")
      setTipoMensaje("success")

      toast({ 
        title: "✅ Paciente guardado correctamente", 
        variant: "success",
        duration: 1500 
      })

      await fetchDatos()

      // ⏱️ TIEMPO DE ESPERA ANTES DE CERRAR (en milisegundos)
      // 🔧 Para reducir el tiempo, cambia 5000 por otro valor (ej: 2000 = 2 segundos)
      setTimeout(() => {
        onClose()
      }, 5000)

    } catch (err) {
      console.error("❌ Error al guardar paciente:", err)
      
      setGuardando(false)
      setMensaje(`❌ Error: ${err.message}`)
      setTipoMensaje("error")
      
      toast({ 
        title: "❌ Error al guardar el paciente", 
        description: err.message, 
        variant: "destructive" 
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Nuevo Paciente</DialogTitle>
          <DialogDescription id="dialog-description">
            Complete los datos para registrar un nuevo paciente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="font-medium text-sm">Seleccionar datos personales</label>

          {datosFiltrados.length === 0 && (
            <p className="text-sm text-muted-foreground mb-2">
              No hay datos personales disponibles.
            </p>
          )}

          <Select
            value={datoSeleccionado ?? undefined}
            onValueChange={(val) => setDatoSeleccionado(val || null)}
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

          <Button
            variant="outline"
            onClick={() => setAbrirModalDato(true)}
            disabled={datoSeleccionado !== null}
            className="mt-2 w-full"
          >
            ➕ Agregar nuevo dato personal
          </Button>

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
            {guardando ? "⏳ Guardando..." : "💾 Guardar"}
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
      <DatoPersonalModal open={abrirModalDato} onClose={() => setAbrirModalDato(false)} onGuardado={fetchDatos}/>
    </Dialog>
  )
}