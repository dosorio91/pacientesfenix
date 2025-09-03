import { z } from 'zod';

export const patientSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  age: z.number().min(0, 'La edad no puede ser negativa').max(120, 'La edad máxima es 120 años'),
  parentsNames: z.string().min(3, 'El nombre de los padres debe tener al menos 3 caracteres'),
  reason: z.string().max(2000, 'El motivo no puede exceder 2000 caracteres').optional(),
});

export const sessionSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD'),
  notes: z.string().max(4000, 'Las observaciones no pueden exceder 4000 caracteres').optional(),
  progress: z.string().max(4000, 'Los avances no pueden exceder 4000 caracteres').optional(),
});

export type PatientInput = z.infer<typeof patientSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
