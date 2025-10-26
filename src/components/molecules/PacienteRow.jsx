import { Button } from "@/components/ui/button"
import { TableRow, TableCell } from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

export function PacienteRow({ paciente }) {
  return (
    <TableRow>
      <TableCell>{paciente.nombre}</TableCell>
      <TableCell>{paciente.dni}</TableCell>
      <TableCell>{paciente.email}</TableCell>
      <TableCell>{paciente.telefono}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}