import { create } from 'zustand'

export const usePacientesStore = create((set) => ({
  pacientes: [],
  loading: false,
  error: null,
  message: null, // Para mensajes del servidor
  
  // Obtener todos los pacientes
  fetchPacientes: async () => {
    set({ loading: true })
    try {
      const response = await fetch('http://localhost:8000/api/pacientes', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      console.log('Respuesta completa:', result)

      // Extraer el array de pacientes de la respuesta
      const pacientesData = result.data || []
      
      set({ 
        pacientes: pacientesData,
        loading: false,
        message: result.message
      })
    } catch (error) {
      console.error('Error:', error)
      set({ 
        error: error.message, 
        loading: false, 
        pacientes: [] 
      })
    }
  },
  // Agregar nuevo paciente
  agregarPaciente: async (paciente) => {
    try {
      const response = await fetch('http://localhost:8000/api/pacientes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paciente)
      })
      const data = await response.json()
      
      if (response.ok) {
        set(state => ({
          pacientes: [...state.pacientes, data.data],
          message: 'Paciente agregado exitosamente'
        }))
        return { success: true }
      } else {
        throw new Error(data.message || 'Error al crear paciente')
      }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Editar paciente existente
  editarPaciente: async (id, datos) => {
    try {
      const response = await fetch(`http://localhost:8000/api/pacientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      const pacienteActualizado = await response.json()
      set(state => ({
        pacientes: state.pacientes.map(p => 
          p.id === id ? pacienteActualizado : p
        )
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Eliminar paciente
  eliminarPaciente: async (id) => {
    try {
      await fetch(`http://localhost:8000/api/pacientes/${id}`, {
        method: 'DELETE'
      })
      set(state => ({
        pacientes: state.pacientes.filter(p => p.id !== id)
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Limpiar error
  clearError: () => set({ error: null })
}))