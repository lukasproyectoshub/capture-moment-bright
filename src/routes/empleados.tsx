import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, Mail, Phone } from "lucide-react";

import { AppShell } from "@/components/petcare/AppShell";
import { CrudSection, type ColumnDef, type FieldDef } from "@/components/petcare/CrudSection";
import { Badge } from "@/components/ui/badge";
import { useEmpleados, useEmpleadosMutations } from "@/hooks/use-petcare";
import type { Empleado } from "@/lib/api/types";

export const Route = createFileRoute("/empleados")({
  head: () => ({
    meta: [
      { title: "Empleados | PETCARE" },
      {
        name: "description",
        content: "Gestiona el equipo del petshop: vendedores, veterinarios y peluqueros caninos.",
      },
      { property: "og:title", content: "Empleados | PETCARE" },
      { property: "og:description", content: "Administración del equipo de trabajo en PETCARE." },
    ],
  }),
  component: EmpleadosPage,
});

const fields: Array<FieldDef<Empleado>> = [
  { name: "nombre", label: "Nombre" },
  { name: "apellido", label: "Apellido" },
  { name: "cargo", label: "Cargo", colSpan: 2 },
  { name: "telefono", label: "Teléfono", type: "tel" },
  { name: "email", label: "Email", type: "email" },
];

function EmpleadosPage() {
  const { data, isLoading, error, refetch } = useEmpleados();
  const { crear, actualizar, eliminar } = useEmpleadosMutations();

  const columns: Array<ColumnDef<Empleado>> = [
    {
      header: "Empleado",
      render: (e) => (
        <div>
          <p className="font-semibold">
            {e.nombre} {e.apellido}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="size-3" /> {e.email}
          </p>
        </div>
      ),
    },
    {
      header: "Cargo",
      render: (e) => (
        <Badge className="gap-1 bg-sky text-sky-foreground">
          <BriefcaseBusiness className="size-3" /> {e.cargo}
        </Badge>
      ),
    },
    {
      header: "Teléfono",
      render: (e) => (
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Phone className="size-3 text-primary" /> {e.telefono}
        </span>
      ),
    },
  ];

  return (
    <AppShell title="Empleados" description="Equipo de trabajo de PETCARE">
      <CrudSection<Empleado>
        entidad="Empleado"
        entidadPlural="Empleados"
        fields={fields}
        columns={columns}
        rows={data}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        buscarEn={(e) => `${e.nombre} ${e.apellido} ${e.cargo} ${e.email} ${e.telefono}`}
        onCrear={(d) => crear.mutate(d)}
        onActualizar={(id, d) => actualizar.mutate({ id, data: d })}
        onEliminar={(id) => eliminar.mutate(id)}
        guardando={crear.isPending || actualizar.isPending}
      />
    </AppShell>
  );
}
