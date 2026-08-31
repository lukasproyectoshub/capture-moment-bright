import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/petcare/AppShell";
import { DataState } from "@/components/petcare/DataState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatearMoneda,
  useClientes,
  useEmpleados,
  useProductos,
  useRegistrarVenta,
  useVentas,
} from "@/hooks/use-petcare";

export const Route = createFileRoute("/ventas")({
  head: () => ({
    meta: [
      { title: "Ventas | PETCARE" },
      {
        name: "description",
        content:
          "Registra ventas del petshop: cliente, empleado, carrito de productos, subtotales y total.",
      },
      { property: "og:title", content: "Ventas | PETCARE" },
      { property: "og:description", content: "Punto de venta y historial de ventas de PETCARE." },
    ],
  }),
  component: VentasPage,
});

interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

function VentasPage() {
  const { data: clientes } = useClientes();
  const { data: empleados } = useEmpleados();
  const { data: productos } = useProductos();
  const { data: ventas, isLoading, error, refetch } = useVentas();
  const registrar = useRegistrarVenta();

  const [clienteId, setClienteId] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const total = useMemo(
    () => carrito.reduce((s, i) => s + i.precio * i.cantidad, 0),
    [carrito],
  );

  const agregar = () => {
    const producto = (productos ?? []).find((p) => String(p.id) === productoId);
    if (!producto) return;
    const cant = Math.max(1, Number(cantidad) || 1);
    setCarrito((prev) => {
      const existente = prev.find((i) => i.productoId === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.productoId === producto.id ? { ...i, cantidad: i.cantidad + cant } : i,
        );
      }
      return [
        ...prev,
        { productoId: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: cant },
      ];
    });
    setProductoId("");
    setCantidad("1");
  };

  const cambiarCantidad = (id: number, delta: number) =>
    setCarrito((prev) =>
      prev
        .map((i) => (i.productoId === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0),
    );

  const confirmar = () => {
    registrar.mutate(
      {
        clienteId: Number(clienteId),
        empleadoId: Number(empleadoId),
        detalles: carrito.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      },
      {
        onSuccess: () => {
          setCarrito([]);
          setClienteId("");
          setEmpleadoId("");
        },
      },
    );
  };

  const puedeConfirmar = clienteId && empleadoId && carrito.length > 0 && !registrar.isPending;

  const nombreCliente = (id: number) => {
    const c = (clientes ?? []).find((x) => x.id === id);
    return c ? `${c.nombre} ${c.apellido}` : `Cliente #${id}`;
  };
  const nombreEmpleado = (id: number) => {
    const e = (empleados ?? []).find((x) => x.id === id);
    return e ? `${e.nombre} ${e.apellido}` : `Empleado #${id}`;
  };

  return (
    <AppShell title="Ventas" description="Registrar una nueva venta y ver el historial">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-primary" /> Nueva venta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Cliente</Label>
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {(clientes ?? []).map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nombre} {c.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Empleado</Label>
                <Select value={empleadoId} onValueChange={setEmpleadoId}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {(empleados ?? []).map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.nombre} {e.apellido} · {e.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <Label className="mb-1.5 block">Producto</Label>
                <Select value={productoId} onValueChange={setProductoId}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Agregar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {(productos ?? []).map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nombre} — {formatearMoneda(p.precio)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label className="mb-1.5 block">Cantidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={agregar} disabled={!productoId} className="rounded-xl">
                <Plus className="size-4" /> Agregar
              </Button>
            </div>

            {carrito.length === 0 ? (
              <p className="rounded-xl border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                El carrito está vacío. Agregá productos para calcular el total.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio unitario</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carrito.map((i) => (
                      <TableRow key={i.productoId}>
                        <TableCell className="font-medium">{i.nombre}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-7"
                              onClick={() => cambiarCantidad(i.productoId, -1)}
                              aria-label="Quitar una unidad"
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center">{i.cantidad}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-7"
                              onClick={() => cambiarCantidad(i.productoId, 1)}
                              aria-label="Agregar una unidad"
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatearMoneda(i.precio)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatearMoneda(i.precio * i.cantidad)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setCarrito((prev) => prev.filter((x) => x.productoId !== i.productoId))
                            }
                            aria-label="Quitar producto"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-sky p-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Total final</p>
                <p className="text-3xl font-bold text-primary">{formatearMoneda(total)}</p>
              </div>
              <Button
                size="lg"
                onClick={confirmar}
                disabled={!puedeConfirmar}
                className="rounded-xl bg-gradient-accent text-accent-foreground shadow-glow hover:opacity-90"
              >
                {registrar.isPending ? "Registrando..." : "Confirmar venta"}
              </Button>
            </div>
            {registrar.isError ? (
              <p role="alert" className="text-sm text-destructive">
                {registrar.error.message}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle>Historial de ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <DataState
              isLoading={isLoading}
              error={error}
              onRetry={() => refetch()}
              isEmpty={(ventas ?? []).length === 0}
              emptyMessage="Todavía no hay ventas registradas"
            >
              <ul className="space-y-3">
                {(ventas ?? []).map((v) => (
                  <li key={v.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">Venta #{v.id}</Badge>
                      <span className="font-bold text-primary">{formatearMoneda(v.total)}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{nombreCliente(v.clienteId)}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.fecha} · Atendió {nombreEmpleado(v.empleadoId)} · {v.detalles.length} ítems
                    </p>
                  </li>
                ))}
              </ul>
            </DataState>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
