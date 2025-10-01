"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, User, Calendar, Settings } from "lucide-react"

// Importamos el Header organism
import { Header } from "@/components/organisms/Header"

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-primary/10 border-r p-4 transition-all",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="mb-6"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <User className="h-5 w-5" /> {isOpen && "Pacientes"}
          </Link>
          <Link href="/dashboard/turnos" className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> {isOpen && "Turnos"}
          </Link>
          <Link href="/dashboard/config" className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> {isOpen && "Configuración"}
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header organism */}
        <Header userName="Marianela Acosta" />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
