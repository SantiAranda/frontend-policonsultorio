"use client"

import { useDarkMode } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DarkModeToggle({ className = "" }) {
  const { isDark, toggleDarkMode, isClient } = useDarkMode()

  if (!isClient) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`text-muted-foreground ${className}`}
        disabled
      >
        <Moon className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className={`text-muted-foreground hover:text-foreground transition-colors ${className}`}
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
