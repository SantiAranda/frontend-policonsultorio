import { create } from "zustand"

export const useDatosPersonalesStore = create((set, get) => ({
  datosPersonales: [],
  loading: false,
  error: null,

  // 🔹 Trae todos los datos personales del backend
  fetchDatosPersonales: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch("http://localhost:8000/api/datos-personales")
      if (!res.ok) throw new Error("Error al obtener los datos personales")

      const data = await res.json()
      // Tu backend los devuelve en data.datosPersonales (según lo que mostraste)
      const datos = data.data?.datosPersonales || []

      // 🔸 A futuro, el backend debería devolver si ya está asociado a un paciente.
      // Por ahora, le agregamos manualmente el campo `pacienteAsociado: false` para evitar errores.
      const formateados = datos.map((d) => ({
        ...d,
        pacienteAsociado: false, // lo ajustaremos cuando tengamos la relación real
      }))

      set({ datosPersonales: formateados, loading: false })
    } catch (error) {
      console.error("Error fetchDatosPersonales:", error)
      set({ error: error.message, loading: false })
    }
  },

  // 🔹 Crear nuevo dato personal
  crearDatoPersonal: async (nuevoDato) => {
    try {
      const res = await fetch("http://localhost:8000/api/datos-personales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoDato),
      })

      if (!res.ok) throw new Error("Error al crear datos personales")

      const data = await res.json()
      // Algunos back devuelven { message, data: {...} }
      const nuevo = data.data || nuevoDato

      // Actualizamos el estado local
      set((state) => ({
        datosPersonales: [...state.datosPersonales, nuevo],
      }))

      return nuevo
    } catch (error) {
      console.error("Error crearDatoPersonal:", error)
      throw error
    }
  },
}))
