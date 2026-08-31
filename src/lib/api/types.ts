export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
}

export type Especie = "Perro" | "Gato" | "Ave" | "Roedor" | "Reptil" | "Otro";

export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  clienteId: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  categoriaId: string;
  imagenUrl: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  email: string;
}

export interface DetalleVenta {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  clienteId: string;
  empleadoId: string;
  fecha: string;
  total: number;
  detalles: DetalleVenta[];
}

export interface VentaPayload {
  clienteId: string;
  empleadoId: string;
  detalles: Array<{ productoId: string; cantidad: number }>;
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
