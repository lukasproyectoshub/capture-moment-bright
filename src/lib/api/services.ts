import { api } from "./client";
import type {
  Categoria,
  Cliente,
  DashboardResumen,
  Empleado,
  Mascota,
  Producto,
  Venta,
  VentaPayload,
} from "./types";

/** Servicios REST: /api/clientes, /api/mascotas, /api/productos, /api/categorias, /api/empleados, /api/ventas */
function crudService<T extends { id: number }, C = Omit<T, "id">>(resource: string) {
  return {
    resource,
    listar: () => api.get<T[]>(`/${resource}`),
    obtener: (id: number) => api.get<T>(`/${resource}/${id}`),
    crear: (data: C) => api.post<T>(`/${resource}`, data),
    actualizar: (id: number, data: C) => api.put<T>(`/${resource}/${id}`, data),
    eliminar: (id: number) => api.delete(`/${resource}/${id}`),
  };
}

export const clientesService = crudService<Cliente>("clientes");
export const mascotasService = crudService<Mascota>("mascotas");
export const categoriasService = crudService<Categoria>("categorias");
export const productosService = crudService<Producto>("productos");
export const empleadosService = crudService<Empleado>("empleados");

export const ventasService = {
  resource: "ventas",
  listar: () => api.get<Venta[]>("/ventas"),
  obtener: (id: number) => api.get<Venta>(`/ventas/${id}`),
  registrar: (data: VentaPayload) => api.post<Venta>("/ventas", data),
  eliminar: (id: number) => api.delete(`/ventas/${id}`),
};

export const dashboardService = {
  resumen: () => api.get<DashboardResumen>("/dashboard"),
};
