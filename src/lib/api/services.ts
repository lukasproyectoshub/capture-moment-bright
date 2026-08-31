import { supabase } from "@/integrations/supabase/client";
import type {
  Categoria,
  Cliente,
  DashboardResumen,
  DetalleVenta,
  Empleado,
  Mascota,
  Producto,
  Venta,
  VentaPayload,
} from "./types";

/** Capa de datos sobre la base de datos del proyecto (Lovable Cloud). */

function fallar(mensaje: string, error: { message: string } | null): never {
  throw new Error(`${mensaje}: ${error?.message ?? "error desconocido"}`);
}

/* ------------------------------ CLIENTES ------------------------------ */

const aCliente = (r: Record<string, unknown>): Cliente => ({
  id: String(r["id"]),
  nombre: String(r["nombre"] ?? ""),
  apellido: String(r["apellido"] ?? ""),
  telefono: String(r["telefono"] ?? ""),
  email: String(r["email"] ?? ""),
  direccion: String(r["direccion"] ?? ""),
});

export const clientesService = {
  resource: "clientes",
  listar: async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("nombre", { ascending: true });
    if (error) fallar("No se pudieron cargar los clientes", error);
    return (data ?? []).map(aCliente);
  },
  crear: async (d: Omit<Cliente, "id">): Promise<Cliente> => {
    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nombre: d.nombre,
        apellido: d.apellido,
        telefono: d.telefono,
        email: d.email || null,
        direccion: d.direccion,
      })
      .select()
      .single();
    if (error) fallar("No se pudo crear el cliente", error);
    return aCliente(data);
  },
  actualizar: async (id: string, d: Omit<Cliente, "id">): Promise<Cliente> => {
    const { data, error } = await supabase
      .from("clientes")
      .update({
        nombre: d.nombre,
        apellido: d.apellido,
        telefono: d.telefono,
        email: d.email || null,
        direccion: d.direccion,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) fallar("No se pudo actualizar el cliente", error);
    return aCliente(data);
  },
  eliminar: async (id: string) => {
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) fallar("No se pudo eliminar el cliente", error);
    return true;
  },
};

/* ------------------------------ MASCOTAS ------------------------------ */

const aMascota = (r: Record<string, unknown>): Mascota => ({
  id: String(r["id"]),
  nombre: String(r["nombre"] ?? ""),
  especie: String(r["especie"] ?? "Otro"),
  raza: String(r["raza"] ?? ""),
  fechaNacimiento: r["fecha_nacimiento"] ? String(r["fecha_nacimiento"]) : "",
  clienteId: r["cliente_id"] ? String(r["cliente_id"]) : "",
});

export const mascotasService = {
  resource: "mascotas",
  listar: async (): Promise<Mascota[]> => {
    const { data, error } = await supabase
      .from("mascotas")
      .select("*")
      .order("nombre", { ascending: true });
    if (error) fallar("No se pudieron cargar las mascotas", error);
    return (data ?? []).map(aMascota);
  },
  crear: async (d: Omit<Mascota, "id">): Promise<Mascota> => {
    const { data, error } = await supabase
      .from("mascotas")
      .insert({
        nombre: d.nombre,
        especie: d.especie,
        raza: d.raza,
        fecha_nacimiento: d.fechaNacimiento || null,
        cliente_id: d.clienteId || null,
      })
      .select()
      .single();
    if (error) fallar("No se pudo crear la mascota", error);
    return aMascota(data);
  },
  actualizar: async (id: string, d: Omit<Mascota, "id">): Promise<Mascota> => {
    const { data, error } = await supabase
      .from("mascotas")
      .update({
        nombre: d.nombre,
        especie: d.especie,
        raza: d.raza,
        fecha_nacimiento: d.fechaNacimiento || null,
        cliente_id: d.clienteId || null,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) fallar("No se pudo actualizar la mascota", error);
    return aMascota(data);
  },
  eliminar: async (id: string) => {
    const { error } = await supabase.from("mascotas").delete().eq("id", id);
    if (error) fallar("No se pudo eliminar la mascota", error);
    return true;
  },
};

/* ----------------------------- CATEGORIAS ----------------------------- */

const aCategoria = (r: Record<string, unknown>): Categoria => ({
  id: String(r["id"]),
  nombre: String(r["nombre"] ?? ""),
  descripcion: String(r["descripcion"] ?? ""),
});

export const categoriasService = {
  resource: "categorias",
  listar: async (): Promise<Categoria[]> => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre", { ascending: true });
    if (error) fallar("No se pudieron cargar las categorías", error);
    return (data ?? []).map(aCategoria);
  },
  crear: async (d: Omit<Categoria, "id">): Promise<Categoria> => {
    const { data, error } = await supabase
      .from("categorias")
      .insert({ nombre: d.nombre, descripcion: d.descripcion })
      .select()
      .single();
    if (error) fallar("No se pudo crear la categoría", error);
    return aCategoria(data);
  },
  actualizar: async (id: string, d: Omit<Categoria, "id">): Promise<Categoria> => {
    const { data, error } = await supabase
      .from("categorias")
      .update({ nombre: d.nombre, descripcion: d.descripcion })
      .eq("id", id)
      .select()
      .single();
    if (error) fallar("No se pudo actualizar la categoría", error);
    return aCategoria(data);
  },
  eliminar: async (id: string) => {
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (error) fallar("No se pudo eliminar la categoría", error);
    return true;
  },
};

/* ----------------------------- PRODUCTOS ------------------------------ */

const aProducto = (r: Record<string, unknown>): Producto => ({
  id: String(r["id"]),
  nombre: String(r["nombre"] ?? ""),
  descripcion: String(r["descripcion"] ?? ""),
  precio: Number(r["precio"] ?? 0),
  stock: Number(r["stock"] ?? 0),
  stockMinimo: Number(r["stock_minimo"] ?? 0),
  categoriaId: r["categoria_id"] ? String(r["categoria_id"]) : "",
  imagenUrl: String(r["imagen_url"] ?? ""),
});

const filaProducto = (d: Omit<Producto, "id">) => ({
  nombre: d.nombre,
  descripcion: d.descripcion,
  precio: Number(d.precio) || 0,
  stock: Number(d.stock) || 0,
  stock_minimo: Number(d.stockMinimo) || 0,
  categoria_id: d.categoriaId || null,
  imagen_url: d.imagenUrl ?? "",
});

export const productosService = {
  resource: "productos",
  listar: async (): Promise<Producto[]> => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });
    if (error) fallar("No se pudieron cargar los productos", error);
    return (data ?? []).map(aProducto);
  },
  crear: async (d: Omit<Producto, "id">): Promise<Producto> => {
    const { data, error } = await supabase
      .from("productos")
      .insert(filaProducto(d))
      .select()
      .single();
    if (error) fallar("No se pudo crear el producto", error);
    return aProducto(data);
  },
  actualizar: async (id: string, d: Omit<Producto, "id">): Promise<Producto> => {
    const { data, error } = await supabase
      .from("productos")
      .update(filaProducto(d))
      .eq("id", id)
      .select()
      .single();
    if (error) fallar("No se pudo actualizar el producto", error);
    return aProducto(data);
  },
  eliminar: async (id: string) => {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) fallar("No se pudo eliminar el producto", error);
    return true;
  },
};

/* ----------------------------- EMPLEADOS ------------------------------ */

const aEmpleado = (r: Record<string, unknown>): Empleado => ({
  id: String(r["id"]),
  nombre: String(r["nombre"] ?? ""),
  apellido: String(r["apellido"] ?? ""),
  cargo: String(r["cargo"] ?? ""),
  telefono: String(r["telefono"] ?? ""),
  email: String(r["email"] ?? ""),
});

export const empleadosService = {
  resource: "empleados",
  listar: async (): Promise<Empleado[]> => {
    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .order("nombre", { ascending: true });
    if (error) fallar("No se pudieron cargar los empleados", error);
    return (data ?? []).map(aEmpleado);
  },
  crear: async (d: Omit<Empleado, "id">): Promise<Empleado> => {
    const { data, error } = await supabase
      .from("empleados")
      .insert({
        nombre: d.nombre,
        apellido: d.apellido,
        cargo: d.cargo,
        telefono: d.telefono,
        email: d.email || null,
      })
      .select()
      .single();
    if (error) fallar("No se pudo crear el empleado", error);
    return aEmpleado(data);
  },
  actualizar: async (id: string, d: Omit<Empleado, "id">): Promise<Empleado> => {
    const { data, error } = await supabase
      .from("empleados")
      .update({
        nombre: d.nombre,
        apellido: d.apellido,
        cargo: d.cargo,
        telefono: d.telefono,
        email: d.email || null,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) fallar("No se pudo actualizar el empleado", error);
    return aEmpleado(data);
  },
  eliminar: async (id: string) => {
    const { error } = await supabase.from("empleados").delete().eq("id", id);
    if (error) fallar("No se pudo eliminar el empleado", error);
    return true;
  },
};

/* ------------------------- VENTAS (pedidos) --------------------------- */

interface FilaItem {
  producto_id: string | null;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

const aVenta = (r: Record<string, unknown>): Venta => {
  const items = (r["pedido_items"] as FilaItem[] | null) ?? [];
  return {
    id: String(r["id"]),
    clienteId: r["cliente_id"] ? String(r["cliente_id"]) : "",
    empleadoId: r["empleado_id"] ? String(r["empleado_id"]) : "",
    fecha: String(r["fecha"] ?? ""),
    total: Number(r["total"] ?? 0),
    detalles: items.map<DetalleVenta>((i) => ({
      productoId: i.producto_id ? String(i.producto_id) : "",
      productoNombre: i.producto_nombre,
      cantidad: Number(i.cantidad),
      precioUnitario: Number(i.precio_unitario),
      subtotal: Number(i.subtotal),
    })),
  };
};

const SELECT_VENTA =
  "id, cliente_id, empleado_id, fecha, total, pedido_items(producto_id, producto_nombre, cantidad, precio_unitario, subtotal)";

export const ventasService = {
  resource: "ventas",
  listar: async (): Promise<Venta[]> => {
    const { data, error } = await supabase
      .from("pedidos")
      .select(SELECT_VENTA)
      .order("fecha", { ascending: false });
    if (error) fallar("No se pudieron cargar las ventas", error);
    return (data ?? []).map((r) => aVenta(r as unknown as Record<string, unknown>));
  },
  registrar: async (payload: VentaPayload): Promise<Venta> => {
    const ids = payload.detalles.map((d) => d.productoId);
    const { data: productos, error: errProd } = await supabase
      .from("productos")
      .select("id, nombre, precio, stock")
      .in("id", ids);
    if (errProd) fallar("No se pudieron leer los productos de la venta", errProd);

    const items = payload.detalles.map((d) => {
      const p = (productos ?? []).find((x) => String(x.id) === d.productoId);
      if (!p) throw new Error("Producto no encontrado en el catálogo");
      if (Number(p.stock) < d.cantidad) {
        throw new Error(`Stock insuficiente de ${p.nombre} (${p.stock} disponibles)`);
      }
      return {
        producto_id: String(p.id),
        producto_nombre: String(p.nombre),
        cantidad: d.cantidad,
        precio_unitario: Number(p.precio),
      };
    });

    const { data: pedido, error: errPedido } = await supabase
      .from("pedidos")
      .insert({
        cliente_id: payload.clienteId || null,
        empleado_id: payload.empleadoId || null,
        estado: "pendiente",
      })
      .select("id")
      .single();
    if (errPedido) fallar("No se pudo registrar la venta", errPedido);

    const pedidoId = String(pedido.id);
    const { error: errItems } = await supabase
      .from("pedido_items")
      .insert(items.map((i) => ({ ...i, pedido_id: pedidoId })));
    if (errItems) {
      await supabase.from("pedidos").delete().eq("id", pedidoId);
      fallar("No se pudo registrar el detalle de la venta", errItems);
    }

    const { data, error } = await supabase
      .from("pedidos")
      .select(SELECT_VENTA)
      .eq("id", pedidoId)
      .single();
    if (error) fallar("No se pudo leer la venta registrada", error);
    return aVenta(data as unknown as Record<string, unknown>);
  },
  eliminar: async (id: string) => {
    const { error } = await supabase.from("pedidos").delete().eq("id", id);
    if (error) fallar("No se pudo eliminar la venta", error);
    return true;
  },
};

/* ----------------------------- DASHBOARD ------------------------------ */

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];

export const dashboardService = {
  resumen: async (): Promise<DashboardResumen> => {
    const [clientes, mascotas, productos, ventas] = await Promise.all([
      clientesService.listar(),
      mascotasService.listar(),
      productosService.listar(),
      ventasService.listar(),
    ]);

    const porMes = new Map<string, number>();
    const hoy = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      porMes.set(`${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, 0);
    }
    for (const v of ventas) {
      const d = new Date(`${v.fecha}T00:00:00`);
      const clave = `${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
      if (porMes.has(clave)) porMes.set(clave, (porMes.get(clave) ?? 0) + v.total);
    }

    const vendidos = new Map<string, number>();
    for (const v of ventas) {
      for (const d of v.detalles) {
        vendidos.set(d.productoNombre, (vendidos.get(d.productoNombre) ?? 0) + d.cantidad);
      }
    }

    const especies = new Map<string, number>();
    for (const m of mascotas) especies.set(m.especie, (especies.get(m.especie) ?? 0) + 1);

    return {
      totalClientes: clientes.length,
      totalMascotas: mascotas.length,
      totalProductos: productos.length,
      productosBajoStock: productos.filter((p) => p.stock <= p.stockMinimo).length,
      totalVentas: ventas.length,
      montoVentas: ventas.reduce((s, v) => s + v.total, 0),
      ventasPorMes: [...porMes.entries()].map(([mes, total]) => ({ mes, total })),
      productosMasVendidos: [...vendidos.entries()]
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5),
      mascotasPorEspecie: [...especies.entries()].map(([especie, cantidad]) => ({
        especie,
        cantidad,
      })),
    };
  },
};
