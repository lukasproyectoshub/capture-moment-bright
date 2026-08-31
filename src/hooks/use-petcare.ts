import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  categoriasService,
  clientesService,
  dashboardService,
  empleadosService,
  mascotasService,
  productosService,
  ventasService,
} from "@/lib/api/services";
import type {
  Categoria,
  Cliente,
  Empleado,
  Mascota,
  Producto,
  VentaPayload,
} from "@/lib/api/types";

type Crud<T extends { id: number }> = {
  resource: string;
  listar: () => Promise<T[]>;
  crear: (data: Omit<T, "id">) => Promise<T>;
  actualizar: (id: number, data: Omit<T, "id">) => Promise<T>;
  eliminar: (id: number) => Promise<unknown>;
};

function useLista<T extends { id: number }>(service: Crud<T>) {
  return useQuery({
    queryKey: [service.resource],
    queryFn: service.listar,
  });
}

function useCrudMutations<T extends { id: number }>(service: Crud<T>, etiqueta: string) {
  const queryClient = useQueryClient();
  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: [service.resource] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const crear = useMutation({
    mutationFn: (data: Omit<T, "id">) => service.crear(data),
    onSuccess: () => {
      invalidar();
      toast.success(`${etiqueta} creado correctamente`);
    },
    onError: (e: Error) => toast.error(`No se pudo crear: ${e.message}`),
  });

  const actualizar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<T, "id"> }) => service.actualizar(id, data),
    onSuccess: () => {
      invalidar();
      toast.success(`${etiqueta} actualizado correctamente`);
    },
    onError: (e: Error) => toast.error(`No se pudo actualizar: ${e.message}`),
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => service.eliminar(id),
    onSuccess: () => {
      invalidar();
      toast.success(`${etiqueta} eliminado`);
    },
    onError: (e: Error) => toast.error(`No se pudo eliminar: ${e.message}`),
  });

  return { crear, actualizar, eliminar };
}

export const useClientes = () => useLista<Cliente>(clientesService);
export const useClientesMutations = () => useCrudMutations<Cliente>(clientesService, "Cliente");

export const useMascotas = () => useLista<Mascota>(mascotasService);
export const useMascotasMutations = () => useCrudMutations<Mascota>(mascotasService, "Mascota");

export const useCategorias = () => useLista<Categoria>(categoriasService);
export const useCategoriasMutations = () =>
  useCrudMutations<Categoria>(categoriasService, "Categoría");

export const useProductos = () => useLista<Producto>(productosService);
export const useProductosMutations = () => useCrudMutations<Producto>(productosService, "Producto");

export const useEmpleados = () => useLista<Empleado>(empleadosService);
export const useEmpleadosMutations = () => useCrudMutations<Empleado>(empleadosService, "Empleado");

export const useVentas = () =>
  useQuery({ queryKey: ["ventas"], queryFn: ventasService.listar });

export function useRegistrarVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VentaPayload) => ventasService.registrar(payload),
    onSuccess: (venta) => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`Venta #${venta.id} registrada por ${formatearMoneda(venta.total)}`);
    },
    onError: (e: Error) => toast.error(`No se pudo registrar la venta: ${e.message}`),
  });
}

export const useDashboard = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: dashboardService.resumen });

export function formatearMoneda(valor: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(valor);
}
