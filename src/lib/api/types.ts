export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
}

export type Especie = "Perro" | "Gato" | "Ave" | "Roedor" | "Reptil" | "Otro";

export interface Mascota {
  id: number;
  nombre: string;
  especie: Especie;
  raza: string;
  fechaNacimiento: string;
  clienteId: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  categoriaId: number;
  imagenUrl: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  email: string;
}

export interface DetalleVenta {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  clienteId: number;
  empleadoId: number;
  fecha: string;
  total: number;
  detalles: DetalleVenta[];
}

export interface VentaPayload {
  clienteId: number;
  empleadoId: number;
  detalles: Array<{ productoId: number; cantidad: number }>;
}

export interface DashboardResumen {
  totalClientes: number;
  totalMascotas: number;
  totalProductos: number;
  productosBajoStock: number;
  totalVentas: number;
  montoVentas: number;
  ventasPorMes: Array<{ mes: string; total: number }>;
  productosMasVendidos: Array<{ nombre: string; cantidad: number }>;
  mascotasPorEspecie: Array<{ especie: string; cantidad: number }>;
}
