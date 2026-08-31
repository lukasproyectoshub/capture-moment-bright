import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/petcare/AppShell";
import { DataState } from "@/components/petcare/DataState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatearMoneda, useDashboard, useProductos } from "@/hooks/use-petcare";

export const Route = createFileRoute("/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes | PETCARE" },
      {
        name: "description",
        content:
          "Reportes del petshop: evolución de ventas, productos más vendidos y control de stock.",
      },
      { property: "og:title", content: "Reportes | PETCARE" },
      { property: "og:description", content: "Analítica de ventas e inventario en PETCARE." },
    ],
  }),
  component: ReportesPage,
});

const COLORES = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function ReportesPage() {
  const { data, isLoading, error, refetch } = useDashboard();
  const { data: productos } = useProductos();

  const bajoStock = (productos ?? []).filter((p) => p.stock <= p.stockMinimo);

  return (
    <AppShell title="Reportes" description="Analítica del negocio en tiempo real">
      <DataState isLoading={isLoading} error={error} onRetry={() => refetch()}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" /> Evolución de ventas ·{" "}
                {formatearMoneda(data?.montoVentas ?? 0)} facturado
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.ventasPorMes ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip formatter={(v: number) => formatearMoneda(v)} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Ventas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft">
            <CardHeader>
              <CardTitle>Productos más vendidos</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.productosMasVendidos ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="nombre"
                    width={130}
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="cantidad"
                    fill="var(--color-chart-3)"
                    radius={[0, 8, 8, 0]}
                    name="Unidades"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft">
            <CardHeader>
              <CardTitle>Distribución de mascotas por especie</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.mascotasPorEspecie ?? []}
                    dataKey="cantidad"
                    nameKey="especie"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {(data?.mascotasPorEspecie ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-warning-foreground" /> Reposición sugerida
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bajoStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Todo el inventario está por encima del stock mínimo.
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {bajoStock.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-warning/50 bg-warning/10 p-3"
                    >
                      <div>
                        <p className="font-semibold">{p.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Mínimo sugerido: {p.stockMinimo} u.
                        </p>
                      </div>
                      <Badge className="bg-warning text-warning-foreground">{p.stock} u.</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </DataState>
    </AppShell>
  );
}
