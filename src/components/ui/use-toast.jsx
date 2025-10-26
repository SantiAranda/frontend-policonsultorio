// src/components/ui/use-toast.jsx
"use client"

import { useState, useCallback } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, toast, removeToast }
}
