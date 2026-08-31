import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, PawPrint } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/petcare/AppShell";
import { CrudSection, type ColumnDef, type FieldDef } from "@/components/petcare/CrudSection";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatearMoneda,
  useCategorias,
  useProductos,
  useProductosMutations,
} from "@/hooks/use-petcare";
import type { Producto } from "@/lib/api/types";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Productos | PETCARE" },
      {
        name: "description",
        content:
          "Catálogo de productos del petshop con precio, stock, categoría y alertas de bajo stock.",
      },
      { property: "og:title", content: "Productos | PETCARE" },
      {
        property: "og:description",
        content: "Control de inventario y precios del catálogo PETCARE.",
      },
    ],
  }),
  component: ProductosPage,
});

function ProductosPage() {
  const { data, isLoading, error, refetch } = useProductos();
  const { data: categorias } = useCategorias();
  const { crear, actualizar, eliminar } = useProductosMutations();
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  const nombreCategoria = (id: number) =>
    (categorias ?? []).find((c) => c.id === id)?.nombre ?? "Sin categoría";

  const fields: Array<FieldDef<Producto>> = [
    { name: "nombre", label: "Nombre", colSpan: 2 },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "precio", label: "Precio", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "stockMinimo", label: "Stock mínimo", type: "number" },
    {
      name: "categoriaId",
      label: "Categoría",
      type: "select",
      options: (categorias ?? []).map((c) => ({ value: String(c.id), label: c.nombre })),
    },
    { name: "imagenUrl", label: "URL de imagen", colSpan: 2, required: false },
  ];

  const columns: Array<ColumnDef<Producto>> = [
    {
      header: "Producto",
      render: (p) => (
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-sky">
            {p.imagenUrl ? (
              <img
                src={p.imagenUrl}
                alt={p.nombre}
                loading="lazy"
                className="size-full object-cover"
              />
            ) : (
              <PawPrint className="size-5 text-primary" />
            )}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">{p.nombre}</p>
            <p className="max-w-[260px] truncate text-xs text-muted-foreground">
              {p.descripcion}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Categoría",
      render: (p) => <Badge variant="secondary">{nombreCategoria(Number(p.categoriaId))}</Badge>,
    },
    {
      header: "Precio",
      render: (p) => <span className="font-semibold">{formatearMoneda(Number(p.precio))}</span>,
    },
    {
      header: "Stock",
      render: (p) =>
        Number(p.stock) <= Number(p.stockMinimo) ? (
          <Badge className="gap-1 bg-warning text-warning-foreground">
            <AlertTriangle className="size-3" /> {p.stock} u. · bajo
          </Badge>
        ) : (
          <Badge className="bg-success text-success-foreground">{p.stock} u.</Badge>
        ),
    },
  ];

  const bajoStock = (data ?? []).filter((p) => Number(p.stock) <= Number(p.stockMinimo)).length;

  return (
    <AppShell
      title="Productos"
      description="Catálogo e inventario del petshop"
      actions={
        bajoStock > 0 ? (
          <Badge className="gap-1 bg-warning text-warning-foreground">
            <AlertTriangle className="size-3" /> {bajoStock} con bajo stock
          </Badge>
        ) : null
      }
    >
      <CrudSection<Producto>
        entidad="Producto"
        entidadPlural="Productos"
        fields={fields}
        columns={columns}
        rows={data}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        buscarEn={(p) => `${p.nombre} ${p.descripcion} ${nombreCategoria(Number(p.categoriaId))}`}
        filtrarExtra={(p) =>
          categoriaFiltro === "todas" || String(p.categoriaId) === categoriaFiltro
        }
        extraFiltro={
          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-[190px] rounded-xl" aria-label="Filtrar por categoría">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {(categorias ?? []).map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        onCrear={(d) => crear.mutate({ ...d, categoriaId: Number(d.categoriaId) })}
        onActualizar={(id, d) =>
          actualizar.mutate({ id, data: { ...d, categoriaId: Number(d.categoriaId) } })
        }
        onEliminar={(id) => eliminar.mutate(id)}
        guardando={crear.isPending || actualizar.isPending}
      />
    </AppShell>
  );
}
