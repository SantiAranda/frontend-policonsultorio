"use client"

import { useDarkMode } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DarkModeToggle({ className = "" }) {
  const { isDark, toggleDarkMode, isClient } = useDarkMode()

  // Evitar hidration mismatch
  if (!isClient) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`absolute top-4 right-4 z-20 text-muted-foreground ${className}`}
        disabled
      >
        <Moon className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      className={`absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground transition-colors ${className}`}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}