"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function DatoPersonalModal({ open, onClose, onGuardado, datoAEditar = null }) {

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    tipoDocumento: "DNI",
    genero: "Masculino",
    fechaNacimiento: "",
    celular: "",
    estado: "Activo",
  })

  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")

  // Cargar datos si estamos editando
  useEffect(() => {
    if (open && datoAEditar) {
      console.log("📥 Cargando datos para editar:", datoAEditar)
      setForm({
        nombre: datoAEditar.nombre || "",
        apellido: datoAEditar.apellido || "",
        documento: datoAEditar.documento || "",
        tipoDocumento: datoAEditar.tipoDocumento || "DNI",
        genero: datoAEditar.genero || "Masculino",
        fechaNacimiento: datoAEditar.fechaNacimiento?.split('T')[0] || "",
        celular: datoAEditar.celular || "",
        estado: datoAEditar.estado || "Activo",
      })
    } else if (open && !datoAEditar) {
      limpiarCampos()
    }
  }, [open, datoAEditar])

  const limpiarCampos = () => {
    setForm({
      nombre: "",
      apellido: "",
      documento: "",
      tipoDocumento: "DNI",
      genero: "Masculino",
      fechaNacimiento: "",
      celular: "",
      estado: "Activo",
    })
    setMensaje("")
    setTipoMensaje("")
  }

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleGuardar = async () => {
    setGuardando(true)
    setMensaje("")
    setTipoMensaje("")
    
    try {
      const body = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        documento: form.documento.trim(),
        tipoDocumento: form.tipoDocumento,
        genero: form.genero,
        fechaNacimiento: form.fechaNacimiento || "2000-01-01",
        celular: form.celular.trim(),
        estado: form.estado,
      }

      const url = datoAEditar 
        ? `http://localhost:8000/api/datos-personales/${datoAEditar.idDatosPersonales}`
        : "http://localhost:8000/api/datos-personales"
      
      const method = datoAEditar ? "PUT" : "POST"

      const token = localStorage.getItem("token")

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Error del servidor:", data)
        throw new Error(
          data?.message || `Error al ${datoAEditar ? 'actualizar' : 'guardar'} los datos personales`
        )
      }

      // ✅ Cambiar estado ANTES de mostrar mensaje de éxito
      setGuardando(false)

      // Mostrar mensaje de éxito
      setMensaje(`✅ Datos ${datoAEditar ? 'actualizados' : 'guardados'} correctamente: ${body.nombre} ${body.apellido}`)
      setTipoMensaje("success")

      onGuardado?.()

      // ⏱️ TIEMPO DE ESPERA ANTES DE CERRAR (en milisegundos)
      // 🔧 Para reducir el tiempo, cambia 5000 por otro valor (ej: 2000 = 2 segundos)
      setTimeout(() => {
        limpiarCampos()
        onClose()
      }, 5000)
    } catch (err) {
      console.error(`❌ Error al ${datoAEditar ? 'actualizar' : 'guardar'} datos personales:`, err)
      
      // Mostrar mensaje de error
      setMensaje(`❌ Error: ${err.message}`)
      setTipoMensaje("error")
      
      // ❌ Cambiar estado después de error
      setGuardando(false)
    }
  }

  const puedeGuardar =
    form.nombre.trim() &&
    form.apellido.trim() &&
    form.documento.trim() &&
    form.celular.trim() &&
    form.fechaNacimiento

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{datoAEditar ? 'Editar dato personal' : 'Nuevo dato personal'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
          <Input
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
          />
          <Input
            placeholder="Documento"
            value={form.documento}
            onChange={(e) => handleChange("documento", e.target.value)}
          />

          <Select
            value={form.tipoDocumento}
            onValueChange={(v) => handleChange("tipoDocumento", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DNI">DNI</SelectItem>
              <SelectItem value="Pasaporte">Pasaporte</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.genero}
            onValueChange={(v) => handleChange("genero", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
          />

          <Input
            placeholder="Celular"
            value={form.celular}
            onChange={(e) => handleChange("celular", e.target.value)}
          />

          <Select
            value={form.estado}
            onValueChange={(v) => handleChange("estado", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>

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
            {guardando ? "⏳ Guardando..." : `💾 ${datoAEditar ? 'Actualizar' : 'Guardar'}`}
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
    </Dialog>
  )
}