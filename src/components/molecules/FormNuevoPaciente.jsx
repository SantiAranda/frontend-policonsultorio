import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"

export function FormNuevoPaciente() {
  return (
    <Form>
      <h2 className="text-lg font-semibold mb-4">Nuevo Paciente</h2>
      
      <FormField>
        <FormLabel>Nombre</FormLabel>
        <FormItem>
          <Input placeholder="Nombre completo" />
        </FormItem>
      </FormField>

      <FormField>
        <FormLabel>DNI</FormLabel>
        <FormItem>
          <Input placeholder="DNI" />
        </FormItem>
      </FormField>

      <FormField>
        <FormLabel>Email</FormLabel>
        <FormItem>
          <Input type="email" placeholder="email@ejemplo.com" />
        </FormItem>
      </FormField>

      <FormField>
        <FormLabel>Teléfono</FormLabel>
        <FormItem>
          <Input placeholder="Teléfono" />
        </FormItem>
      </FormField>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline">Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </Form>
  )
}