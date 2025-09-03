import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SessionInput, sessionSchema } from "@/lib/validations"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface SessionFormProps {
  onSubmit: (data: SessionInput) => Promise<void>
  defaultValues?: Partial<SessionInput>
  buttonText?: string
}

export function SessionForm({ onSubmit, defaultValues, buttonText = "Agregar sesión" }: SessionFormProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SessionInput>({
    resolver: zodResolver(sessionSchema),
    defaultValues,
  })

  const onSubmitWrapper = async (data: SessionInput) => {
    await onSubmit(data)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Ingresa los datos de la sesión. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-4">
          <div>
            <Label htmlFor="title">Título de la sesión *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="date">Fecha *</Label>
            <Input 
              id="date" 
              type="date"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea id="notes" {...register("notes")} />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="progress">Avances</Label>
            <Textarea id="progress" {...register("progress")} />
            {errors.progress && (
              <p className="text-sm text-red-500">{errors.progress.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
