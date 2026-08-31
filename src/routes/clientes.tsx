import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { AppShell } from "@/components/petcare/AppShell";
import { CrudSection, type ColumnDef, type FieldDef } from "@/components/petcare/CrudSection";
import { Badge } from "@/components/ui/badge";
import { useClientes, useClientesMutations } from "@/hooks/use-petcare";
import type { Cliente } from "@/lib/api/types";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes | PETCARE" },
      {
        name: "description",
        content: "Administra los clientes del petshop: alta, edición, búsqueda y eliminación.",
      },
      { property: "og:title", content: "Clientes | PETCARE" },
      {
        property: "og:description",
        content: "Gestión completa de clientes del petshop PETCARE.",
      },
    ],
  }),
  component: ClientesPage,
});

const fields: Array<FieldDef<Cliente>> = [
  { name: "nombre", label: "Nombre" },
  { name: "apellido", label: "Apellido" },
  { name: "telefono", label: "Teléfono", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "direccion", label: "Dirección", colSpan: 2 },
];

function ClientesPage() {
  const { data, isLoading, error, refetch } = useClientes();
  const { crear, actualizar, eliminar } = useClientesMutations();

  const columns: Array<ColumnDef<Cliente>> = [
    { header: "ID", render: (c) => <Badge variant="secondary">#{c.id}</Badge> },
    {
      header: "Cliente",
      render: (c) => (
        <div>
          <p className="font-semibold">
            {c.nombre} {c.apellido}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="size-3" /> {c.email}
          </p>
        </div>
      ),
    },
    {
      header: "Teléfono",
      render: (c) => (
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Phone className="size-3 text-primary" /> {c.telefono}
        </span>
      ),
    },
    {
      header: "Dirección",
      render: (c) => (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3 text-accent" /> {c.direccion}
        </span>
      ),
    },
  ];

  return (
    <AppShell title="Clientes" description="Base de clientes del petshop">
      <CrudSection<Cliente>
        entidad="Cliente"
        entidadPlural="Clientes"
        fields={fields}
        columns={columns}
        rows={data}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        buscarEn={(c) => `${c.nombre} ${c.apellido} ${c.email} ${c.telefono} ${c.direccion}`}
        onCrear={(d) => crear.mutate(d)}
        onActualizar={(id, d) => actualizar.mutate({ id, data: d })}
        onEliminar={(id) => eliminar.mutate(id)}
        guardando={crear.isPending || actualizar.isPending}
      />
    </AppShell>
  );
}
