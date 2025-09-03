export type Patient = {
  id: string;                // uuid
  fullName: string;          // Nombre del paciente
  age: number;               // Edad
  parentsNames: string;      // Nombre de los papás
  reason?: string;           // Motivo de consulta (textarea)
  createdAt: string;        // ISO
  updatedAt: string;        // ISO
};

export type Session = {
  id: string;
  patientId: string;        // FK a Patient
  title: string;            // Nombre de la sesión
  date: string;             // YYYY-MM-DD
  notes?: string;           // Observaciones (textarea)
  progress?: string;        // Avances (textarea)
  createdAt: string;
  updatedAt: string;
};
