import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { DataState } from "@/components/petcare/DataState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export interface FieldDef<T> {
  name: keyof T & string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select" | undefined;
  options?: Array<{ value: string; label: string }> | undefined;
  required?: boolean | undefined;
  colSpan?: 1 | 2 | undefined;
}

export interface ColumnDef<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string | undefined;
}

interface CrudSectionProps<T extends { id: number }> {
  entidad: string;
  entidadPlural: string;
  fields: Array<FieldDef<T>>;
  columns: Array<ColumnDef<T>>;
  rows: T[] | undefined;
  isLoading: boolean;
  error?: Error | null | undefined;
  onRetry?: (() => void) | undefined;
  buscarEn: (row: T) => string;
  onCrear: (data: Omit<T, "id">) => void;
  onActualizar: (id: number, data: Omit<T, "id">) => void;
  onEliminar: (id: number) => void;
  guardando?: boolean | undefined;
  extraFiltro?: ReactNode | undefined;
  filtrarExtra?: ((row: T) => boolean) | undefined;
}

export function CrudSection<T extends { id: number }>({
  entidad,
  entidadPlural,
  fields,
  columns,
  rows,
  isLoading,
  error,
  onRetry,
  buscarEn,
  onCrear,
  onActualizar,
  onEliminar,
  guardando,
  extraFiltro,
  filtrarExtra,
}: CrudSectionProps<T>) {
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<T | null>(null);
  const [borrar, setBorrar] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const filas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (rows ?? [])
      .filter((row) => (filtrarExtra ? filtrarExtra(row) : true))
      .filter((row) => (texto ? buscarEn(row).toLowerCase().includes(texto) : true));
  }, [rows, busqueda, buscarEn, filtrarExtra]);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
    setAbierto(true);
  };

  const abrirEdicion = (row: T) => {
    setEditando(row);
    setForm(
      Object.fromEntries(
        fields.map((f) => [f.name, row[f.name] === undefined ? "" : String(row[f.name])]),
      ),
    );
    setAbierto(true);
  };

  const guardar = () => {
    const data: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = form[field.name] ?? "";
      data[field.name] = field.type === "number" ? Number(raw || 0) : raw;
    }
    if (editando) onActualizar(editando.id, data as Omit<T, "id">);
    else onCrear(data as Omit<T, "id">);
    setAbierto(false);
  };

  const formValido = fields
    .filter((f) => f.required !== false)
    .every((f) => (form[f.name] ?? "").toString().trim().length > 0);

  return (
    <Card className="rounded-2xl border-border/70 shadow-soft">
      <CardContent className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={`Buscar ${entidadPlural.toLowerCase()}...`}
              className="rounded-xl pl-9"
              aria-label={`Buscar ${entidadPlural}`}
            />
          </div>
          {extraFiltro}
          <Button onClick={abrirNuevo} className="rounded-xl">
            <Plus className="size-4" /> Nuevo {entidad.toLowerCase()}
          </Button>
        </div>

        <DataState
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          isEmpty={filas.length === 0}
          emptyMessage={`No se encontraron ${entidadPlural.toLowerCase()}`}
        >
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  {columns.map((c) => (
                    <TableHead key={c.header} className={c.className}>
                      {c.header}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filas.map((row) => (
                  <TableRow key={row.id} className="hover:bg-sky/20">
                    {columns.map((c) => (
                      <TableCell key={c.header} className={c.className}>
                        {c.render(row)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => abrirEdicion(row)}
                        aria-label={`Editar ${entidad}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBorrar(row)}
                        aria-label={`Eliminar ${entidad}`}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">
            {filas.length} {filas.length === 1 ? entidad.toLowerCase() : entidadPlural.toLowerCase()}
          </p>
        </DataState>
      </CardContent>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editando ? `Editar ${entidad.toLowerCase()}` : `Nuevo ${entidad.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Los datos se envían a la API REST ({`/api/${entidadPlural.toLowerCase()}`}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.colSpan === 2 || field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <Label htmlFor={field.name} className="mb-1.5 block">
                  {field.label}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={form[field.name] ?? ""}
                    maxLength={500}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={form[field.name] ?? ""}
                    onValueChange={(v) => setForm((f) => ({ ...f, [field.name]: v }))}
                  >
                    <SelectTrigger id={field.name} className="w-full rounded-xl">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    maxLength={field.type === "number" ? undefined : 120}
                    value={form[field.name] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    className="rounded-xl"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAbierto(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!formValido || guardando} className="rounded-xl">
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={borrar !== null} onOpenChange={(o) => !o && setBorrar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {entidad.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción envía un DELETE a la API y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (borrar) onEliminar(borrar.id);
                setBorrar(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
