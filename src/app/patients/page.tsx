"use client"

import { PatientForm } from "@/components/patients/patient-form"
import { PatientTable } from "@/components/patients/patient-table"
import { createPatient, deletePatient, getPatients, updatePatient } from "@/lib/db/localStorageRepo"
import { Patient } from "@/lib/db/types"
import { PatientInput } from "@/lib/validations"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  async function loadPatients() {
    try {
      const data = await getPatients()
      setPatients(data)
      setError(null)
    } catch (e) {
      setError("Error al cargar los pacientes")
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(search.toLowerCase()) ||
      patient.parentsNames.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCreate(data: PatientInput) {
    try {
      await createPatient(data)
      await loadPatients()
      setError(null)
    } catch (e) {
      setError("Error al crear el paciente")
    }
  }

  async function handleUpdate(data: PatientInput) {
    if (!editingPatient) return
    try {
      await updatePatient(editingPatient.id, data)
      await loadPatients()
      setEditingPatient(null)
      setError(null)
    } catch (e) {
      setError("Error al actualizar el paciente")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este paciente?")) return
    try {
      await deletePatient(id)
      await loadPatients()
      setError(null)
    } catch (e) {
      setError("Error al eliminar el paciente")
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <PatientForm onSubmit={handleCreate} buttonText="Agregar paciente" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar por nombre o nombre de los padres..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <PatientTable
        patients={filteredPatients}
        onEdit={setEditingPatient}
        onDelete={handleDelete}
      />

      {editingPatient && (
        <PatientForm
          onSubmit={handleUpdate}
          defaultValues={editingPatient}
          buttonText="Editar paciente"
        />
      )}
    </div>
  )
}
