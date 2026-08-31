import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Dog,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/petcare/AppShell";
import { DataState } from "@/components/petcare/DataState";
import { StatCard } from "@/components/petcare/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatearMoneda, useDashboard } from "@/hooks/use-petcare";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | PETCARE Gestión de PetShop" },
      {
        name: "description",
        content:
          "Panel de control de PETCARE: clientes, mascotas, inventario y ventas del petshop en un solo lugar.",
      },
      { property: "og:title", content: "Dashboard | PETCARE Gestión de PetShop" },
      {
        property: "og:description",
        content: "Resumen en tiempo real de clientes, mascotas, stock y ventas del petshop.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data, isLoading, error, refetch } = useDashboard();

  return (
    <AppShell
      title="Dashboard"
      description="Resumen general del petshop"
      actions={
        <Button asChild>
          <Link to="/ventas">
            <ShoppingCart className="size-4" /> Nueva venta
          </Link>
        </Button>
      }
    >
      <DataState isLoading={isLoading} error={error} onRetry={() => refetch()}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Clientes"
            value={data?.totalClientes ?? 0}
            icon={Users}
            tone="primary"
            hint="Registrados en la sucursal"
          />
          <StatCard
            label="Mascotas"
            value={data?.totalMascotas ?? 0}
            icon={Dog}
            tone="sky"
            hint="Fichas activas"
          />
          <StatCard
            label="Productos"
            value={data?.totalProductos ?? 0}
            icon={Package}
            tone="accent"
            hint="En catálogo"
          />
          <StatCard
            label="Bajo stock"
            value={data?.productosBajoStock ?? 0}
            icon={AlertTriangle}
            tone="warning"
            hint="Requieren reposición"
          />
          <StatCard
            label="Ventas"
            value={data?.totalVentas ?? 0}
            icon={ShoppingCart}
            tone="success"
            hint="Operaciones registradas"
          />
          <StatCard
            label="Facturado"
            value={formatearMoneda(data?.montoVentas ?? 0)}
            icon={Wallet}
            tone="primary"
            hint="Monto acumulado"
          />
        </div>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" /> Ventas por mes
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.ventasPorMes ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip formatter={(v: number) => formatearMoneda(v)} />
                <Bar
                  dataKey="total"
                  fill="var(--color-chart-1)"
                  radius={[8, 8, 0, 0]}
                  name="Ventas"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </DataState>
    </AppShell>
  );
}
