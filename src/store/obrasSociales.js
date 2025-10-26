import { create } from "zustand"

export const useObrasSocialesStore = create((set) => ({
  obrasSociales: [],
  loading: false,
  error: null,

  fetchObrasSociales: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch("http://localhost:8000/api/obras-sociales")
      const data = await res.json()
      set({ obrasSociales: data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
