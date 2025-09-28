"use client"

import { useState, useEffect } from "react"

const themes = [
  { name: "Gris", value: "", color: "oklch(0.205 0 0)" },
  { name: "Azul", value: "blue", color: "oklch(0.559 0.204 259.012)" },
  { name: "Verde", value: "green", color: "oklch(0.608 0.179 142.495)" },
  { name: "Rojo", value: "red", color: "oklch(0.577 0.245 27.325)" },
  { name: "Púrpura", value: "purple", color: "oklch(0.559 0.230 292.958)" },
  { name: "Naranja", value: "orange", color: "oklch(0.696 0.199 70.67)" },
]

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Cargar tema guardado al montar el componente
    const savedTheme = localStorage.getItem("theme") || ""
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (theme) => {
    if (!isClient) return
    
    const root = document.documentElement
    // Remover todos los atributos de tema anteriores
    themes.forEach(t => {
      if (t.value) {
        root.removeAttribute(`data-theme`)
      }
    })
    // Aplicar nuevo tema
    if (theme) {
      root.setAttribute("data-theme", theme)
    }
  }

  const setTheme = (theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    if (isClient) {
      localStorage.setItem("theme", theme)
    }
  }

  const currentThemeData = themes.find(t => t.value === currentTheme) || themes[0]

  return {
    theme: currentTheme,
    setTheme,
    themes,
    currentThemeData,
    isClient
  }
}

// Hook adicional para modo oscuro/claro
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Verificar preferencia guardada o del sistema
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode !== null) {
      setIsDark(savedMode === "true")
      applyDarkMode(savedMode === "true")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(prefersDark)
      applyDarkMode(prefersDark)
    }
  }, [])

  const applyDarkMode = (dark) => {
    if (!isClient) return
    
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    applyDarkMode(newMode)
    if (isClient) {
      localStorage.setItem("darkMode", newMode.toString())
    }
  }

  return {
    isDark,
    toggleDarkMode,
    isClient
  }
}