import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PatientInput, patientSchema } from "@/lib/validations"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface PatientFormProps {
  onSubmit: (data: PatientInput) => Promise<void>
  defaultValues?: Partial<PatientInput>
  buttonText?: string
}

export function PatientForm({ onSubmit, defaultValues, buttonText = "Agregar paciente" }: PatientFormProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  })

  const onSubmitWrapper = async (data: PatientInput) => {
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
            Ingresa los datos del paciente. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nombre completo *</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="age">Edad *</Label>
            <Input 
              id="age" 
              type="number" 
              {...register("age", { valueAsNumber: true })} 
            />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="parentsNames">Nombre de los padres *</Label>
            <Input id="parentsNames" {...register("parentsNames")} />
            {errors.parentsNames && (
              <p className="text-sm text-red-500">{errors.parentsNames.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="reason">Motivo de consulta</Label>
            <Textarea id="reason" {...register("reason")} />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
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
