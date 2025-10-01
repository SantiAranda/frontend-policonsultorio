"use client"

import { Button } from "@/components/ui/button"
import { UserInfo } from "@/components/molecules/UserInfo"
import { DarkModeToggle } from "@/components/atoms/DarkModeToggle"


export function Header({ userName }) {
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Dashboard Clínica</h1>
      <div className="flex items-center gap-4">
        {/* Toggle de modo oscuro */}
        <DarkModeToggle />

        {/* Usuario con iniciales */}
        <UserInfo name={userName} />

        {/* Logout */}
        <Button variant="outline">Cerrar Sesión</Button>
      </div>
    </header>
  )
}
