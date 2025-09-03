import { Session } from "@/lib/db/types"
import { SessionForm } from "./session-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { createSession, deleteSession, updateSession } from "@/lib/db/localStorageRepo"
import { SessionInput } from "@/lib/validations"
import { useState } from "react"

interface SessionListProps {
  sessions: Session[]
  patientId: string
  onUpdate: () => void
}

export function SessionList({ sessions, patientId, onUpdate }: SessionListProps) {
  const [editingSession, setEditingSession] = useState<Session | null>(null)

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  async function handleCreate(data: SessionInput) {
    await createSession({ ...data, patientId })
    onUpdate()
  }

  async function handleUpdate(data: SessionInput) {
    if (!editingSession) return
    await updateSession(editingSession.id, data)
    setEditingSession(null)
    onUpdate()
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta sesión?")) return
    await deleteSession(id)
    onUpdate()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Sesiones realizadas ({sessions.length})
        </h3>
        <SessionForm onSubmit={handleCreate} buttonText="Agregar sesión" />
      </div>

      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No hay sesiones registradas
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-medium">
                    {session.title}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {new Date(session.date).toLocaleDateString()}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingSession(session)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(session.id)}
                      className="text-red-600"
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.notes && (
                  <div>
                    <h4 className="font-medium">Observaciones</h4>
                    <p className="whitespace-pre-wrap text-sm text-gray-600">
                      {session.notes}
                    </p>
                  </div>
                )}
                {session.progress && (
                  <div>
                    <h4 className="font-medium">Avances</h4>
                    <p className="whitespace-pre-wrap text-sm text-gray-600">
                      {session.progress}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingSession && (
        <SessionForm
          onSubmit={handleUpdate}
          defaultValues={editingSession}
          buttonText="Editar sesión"
        />
      )}
    </div>
  )
}
