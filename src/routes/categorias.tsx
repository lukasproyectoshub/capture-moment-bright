import { createFileRoute } from "@tanstack/react-router";
import { Tag } from "lucide-react";

import { AppShell } from "@/components/petcare/AppShell";
import { CrudSection, type ColumnDef, type FieldDef } from "@/components/petcare/CrudSection";
import { Badge } from "@/components/ui/badge";
import { useCategorias, useCategoriasMutations, useProductos } from "@/hooks/use-petcare";
import type { Categoria } from "@/lib/api/types";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorías | PETCARE" },
      {
        name: "description",
        content: "Organiza los productos del petshop en categorías: alimentos, higiene y más.",
      },
      { property: "og:title", content: "Categorías | PETCARE" },
      {
        property: "og:description",
        content: "Administración de categorías de productos en PETCARE.",
      },
    ],
  }),
  component: CategoriasPage,
});

const fields: Array<FieldDef<Categoria>> = [
  { name: "nombre", label: "Nombre", colSpan: 2 },
  { name: "descripcion", label: "Descripción", type: "textarea" },
];

function CategoriasPage() {
  const { data, isLoading, error, refetch } = useCategorias();
  const { data: productos } = useProductos();
  const { crear, actualizar, eliminar } = useCategoriasMutations();

  const columns: Array<ColumnDef<Categoria>> = [
    {
      header: "Categoría",
      render: (c) => (
        <span className="flex items-center gap-2 font-semibold">
          <Tag className="size-4 text-primary" /> {c.nombre}
        </span>
      ),
    },
    {
      header: "Descripción",
      render: (c) => <span className="text-sm text-muted-foreground">{c.descripcion}</span>,
    },
    {
      header: "Productos",
      render: (c) => (
        <Badge variant="secondary">
          {(productos ?? []).filter((p) => p.categoriaId === c.id).length}
        </Badge>
      ),
    },
  ];

  return (
    <AppShell title="Categorías" description="Clasificación del catálogo de productos">
      <CrudSection<Categoria>
        entidad="Categoría"
        entidadPlural="Categorias"
        fields={fields}
        columns={columns}
        rows={data}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        buscarEn={(c) => `${c.nombre} ${c.descripcion}`}
        onCrear={(d) => crear.mutate(d)}
        onActualizar={(id, d) => actualizar.mutate({ id, data: d })}
        onEliminar={(id) => eliminar.mutate(id)}
        guardando={crear.isPending || actualizar.isPending}
      />
    </AppShell>
  );
}
