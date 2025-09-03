"use client"

// Esta función le dice a Next.js qué IDs pre-renderizar
export function generateStaticParams() {
  // Como usamos localStorage, generaremos una página estática de ejemplo
  return [{ id: "example" }]
}

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatientById, getSessionsByPatientId } from "@/lib/db/localStorageRepo"
import { Patient, Session } from "@/lib/db/types"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SessionList } from "@/components/sessions/session-list"

interface Props {
  params: {
    id: string
  }
}

export default function PatientDetail({ params }: Props) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [params.id])

  async function loadData() {
    try {
      const patientData = await getPatientById(params.id)
      if (!patientData) {
        setError("Paciente no encontrado")
        return
      }
      setPatient(patientData)
      const sessionsData = await getSessionsByPatientId(params.id)
      setSessions(sessionsData)
      setError(null)
    } catch (e) {
      setError("Error al cargar los datos del paciente")
    }
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!patient) {
    return <div className="container py-8">Cargando...</div>
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/patients" className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver a pacientes
          </Link>
          <h1 className="text-3xl font-bold mt-2">{patient.fullName}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/patients">Volver</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del paciente</CardTitle>
          <CardDescription>Datos personales y motivo de consulta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Edad</h3>
            <p>{patient.age} años</p>
          </div>
          <div>
            <h3 className="font-medium">Nombre de los padres</h3>
            <p>{patient.parentsNames}</p>
          </div>
          {patient.reason && (
            <div>
              <h3 className="font-medium">Motivo de consulta</h3>
              <p className="whitespace-pre-wrap">{patient.reason}</p>
            </div>
          )}
          <div className="flex gap-2 text-sm text-gray-500">
            <Badge variant="outline">
              Creado: {new Date(patient.createdAt).toLocaleDateString()}
            </Badge>
            <Badge variant="outline">
              Actualizado: {new Date(patient.updatedAt).toLocaleDateString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sesiones</h2>
        <SessionList 
          sessions={sessions} 
          patientId={patient.id}
          onUpdate={loadData}
        />
      </div>
    </div>
  )
}
