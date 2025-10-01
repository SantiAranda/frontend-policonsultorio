"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"

const themes = [
  { name: "Gris", value: "", color: "oklch(0.205 0 0)" },
  { name: "Azul", value: "blue", color: "oklch(0.559 0.204 259.012)" },
  { name: "Verde", value: "green", color: "oklch(0.608 0.179 142.495)" },
  { name: "Rojo", value: "red", color: "oklch(0.577 0.245 27.325)" },
  { name: "Púrpura", value: "purple", color: "oklch(0.559 0.230 292.958)" },
  { name: "Naranja", value: "orange", color: "oklch(0.696 0.199 70.67)" },
]

export default function ThemeSelector({ className = "" }) {
  const [currentTheme, setCurrentTheme] = useState("")

  useEffect(() => {
    // Cargar tema guardado al montar el componente
    const savedTheme = localStorage.getItem("theme") || ""
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (theme) => {
    const root = document.documentElement
      if (!theme) {
        root.removeAttribute("data-theme") // vuelve al base (gris)
      } else {
        root.setAttribute("data-theme", theme)
      }
    }


  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem("theme", theme)
  }

  const currentThemeData = themes.find(t => t.value === currentTheme) || themes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 theme-transition ${className}`}
        >
          <div 
            className="w-4 h-4 rounded-full border border-border" 
            style={{ backgroundColor: currentThemeData.color }}
          />
          <Palette className="w-4 h-4" />
          {currentThemeData.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div 
              className="w-4 h-4 rounded-full border border-border flex-shrink-0" 
              style={{ backgroundColor: theme.color }}
            />
            <span className="flex-1">{theme.name}</span>
            {currentTheme === theme.value && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}