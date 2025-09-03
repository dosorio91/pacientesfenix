import { Patient } from "@/lib/db/types";

// Esta función pre-genera las rutas estáticas
export async function generateStaticParams() {
  // Como usamos localStorage, solo generaremos una ruta de ejemplo
  return [{ id: "example" }];
}

// Esta función obtiene los datos para cada ruta
export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Patient ${params.id}`,
  };
}

// Esta es una página de ejemplo que se genera estáticamente
export default function PatientPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Patient {params.id}</h1>
      {/* El contenido real se cargará en el cliente */}
    </div>
  );
}
