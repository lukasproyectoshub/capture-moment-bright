import { createFileRoute } from "@tanstack/react-router";
import { Bird, Cat, Dog, PawPrint, Rabbit, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/petcare/AppShell";
import { CrudSection, type ColumnDef, type FieldDef } from "@/components/petcare/CrudSection";
import { Badge } from "@/components/ui/badge";
import { useClientes, useMascotas, useMascotasMutations } from "@/hooks/use-petcare";
import type { Mascota } from "@/lib/api/types";

export const Route = createFileRoute("/mascotas")({
  head: () => ({
    meta: [
      { title: "Mascotas | PETCARE" },
      {
        name: "description",
        content: "Registro de mascotas del petshop con especie, raza y propietario asociado.",
      },
      { property: "og:title", content: "Mascotas | PETCARE" },
      {
        property: "og:description",
        content: "Ficha de cada mascota vinculada a su cliente propietario.",
      },
    ],
  }),
  component: MascotasPage,
});

const iconos: Record<string, LucideIcon> = {
  Perro: Dog,
  Gato: Cat,
  Ave: Bird,
  Roedor: Rabbit,
  Reptil: PawPrint,
  Otro: PawPrint,
};

const especies = ["Perro", "Gato", "Ave", "Roedor", "Reptil", "Otro"];

function edad(fecha: string) {
  if (!fecha) return "—";
  const nacimiento = new Date(fecha);
  const meses =
    (Date.now() - nacimiento.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  if (meses < 12) return `${Math.max(0, Math.round(meses))} meses`;
  return `${Math.floor(meses / 12)} años`;
}

function MascotasPage() {
  const { data, isLoading, error, refetch } = useMascotas();
  const { data: clientes } = useClientes();
  const { crear, actualizar, eliminar } = useMascotasMutations();

  const nombreCliente = (id: number) => {
    const c = (clientes ?? []).find((x) => x.id === id);
    return c ? `${c.nombre} ${c.apellido}` : `Cliente #${id}`;
  };

  const fields: Array<FieldDef<Mascota>> = [
    { name: "nombre", label: "Nombre" },
    {
      name: "especie",
      label: "Especie",
      type: "select",
      options: especies.map((e) => ({ value: e, label: e })),
    },
    { name: "raza", label: "Raza" },
    { name: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
    {
      name: "clienteId",
      label: "Cliente propietario",
      type: "select",
      colSpan: 2,
      options: (clientes ?? []).map((c) => ({
        value: String(c.id),
        label: `${c.nombre} ${c.apellido}`,
      })),
    },
  ];

  const columns: Array<ColumnDef<Mascota>> = [
    {
      header: "Mascota",
      render: (m) => {
        const Icon = iconos[m.especie] ?? PawPrint;
        return (
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-sky/50">
              <Icon className="size-5 text-primary" />
            </span>
            <div>
              <p className="font-semibold">{m.nombre}</p>
              <p className="text-xs text-muted-foreground">{m.raza}</p>
            </div>
          </div>
        );
      },
    },
    { header: "Especie", render: (m) => <Badge variant="secondary">{m.especie}</Badge> },
    {
      header: "Nacimiento",
      render: (m) => (
        <div className="whitespace-nowrap">
          <p className="text-sm">{m.fechaNacimiento}</p>
          <p className="text-xs text-muted-foreground">{edad(m.fechaNacimiento)}</p>
        </div>
      ),
    },
    {
      header: "Propietario",
      render: (m) => (
        <span className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
          <User className="size-3" /> {nombreCliente(Number(m.clienteId))}
        </span>
      ),
    },
  ];

  return (
    <AppShell title="Mascotas" description="Cada mascota vinculada a su propietario">
      <CrudSection<Mascota>
        entidad="Mascota"
        entidadPlural="Mascotas"
        fields={fields}
        columns={columns}
        rows={data}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        buscarEn={(m) =>
          `${m.nombre} ${m.especie} ${m.raza} ${nombreCliente(Number(m.clienteId))}`
        }
        onCrear={(d) => crear.mutate({ ...d, clienteId: Number(d.clienteId) })}
        onActualizar={(id, d) =>
          actualizar.mutate({ id, data: { ...d, clienteId: Number(d.clienteId) } })
        }
        onEliminar={(id) => eliminar.mutate(id)}
        guardando={crear.isPending || actualizar.isPending}
      />
    </AppShell>
  );
}
