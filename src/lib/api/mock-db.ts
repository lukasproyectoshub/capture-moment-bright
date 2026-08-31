/**
 * Respaldo local en memoria.
 *
 * Se usa SOLO cuando la API REST (Spring Boot) todavía no responde, para que la
 * interfaz sea navegable durante el desarrollo. Al levantar el backend real y
 * configurar VITE_API_URL, todas las operaciones viajan por HTTP y este módulo
 * deja de ejecutarse.
 */
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

interface DB {
  clientes: Cliente[];
  mascotas: Mascota[];
  categorias: Categoria[];
  productos: Producto[];
  empleados: Empleado[];
  ventas: Venta[];
}

const db: DB = {
  clientes: [
    { id: 1, nombre: "Lucía", apellido: "Fernández", telefono: "099 123 456", email: "lucia.fernandez@mail.com", direccion: "Av. Rivera 2345, Montevideo" },
    { id: 2, nombre: "Martín", apellido: "Pereyra", telefono: "098 774 210", email: "martin.pereyra@mail.com", direccion: "Bvar. España 1120, Montevideo" },
    { id: 3, nombre: "Camila", apellido: "Rodríguez", telefono: "094 556 001", email: "camila.rodriguez@mail.com", direccion: "18 de Julio 980, Montevideo" },
    { id: 4, nombre: "Diego", apellido: "Silva", telefono: "091 220 887", email: "diego.silva@mail.com", direccion: "Luis A. de Herrera 3410" },
    { id: 5, nombre: "Valentina", apellido: "Gómez", telefono: "096 332 118", email: "valentina.gomez@mail.com", direccion: "Cno. Carrasco 5570" },
  ],
  mascotas: [
    { id: 1, nombre: "Rocco", especie: "Perro", raza: "Labrador", fechaNacimiento: "2021-04-12", clienteId: 1 },
    { id: 2, nombre: "Mishi", especie: "Gato", raza: "Siamés", fechaNacimiento: "2022-09-03", clienteId: 1 },
    { id: 3, nombre: "Toby", especie: "Perro", raza: "Caniche", fechaNacimiento: "2019-01-25", clienteId: 2 },
    { id: 4, nombre: "Luna", especie: "Gato", raza: "Mestizo", fechaNacimiento: "2023-06-17", clienteId: 3 },
    { id: 5, nombre: "Pepe", especie: "Ave", raza: "Calopsita", fechaNacimiento: "2020-11-08", clienteId: 4 },
    { id: 6, nombre: "Nina", especie: "Perro", raza: "Border Collie", fechaNacimiento: "2022-02-14", clienteId: 5 },
    { id: 7, nombre: "Coco", especie: "Roedor", raza: "Hámster ruso", fechaNacimiento: "2024-03-01", clienteId: 3 },
  ],
  categorias: [
    { id: 1, nombre: "Alimentos", descripcion: "Alimento balanceado seco y húmedo" },
    { id: 2, nombre: "Higiene", descripcion: "Shampoo, piedras sanitarias y cuidado" },
    { id: 3, nombre: "Juguetes", descripcion: "Juguetes y entretenimiento" },
    { id: 4, nombre: "Accesorios", descripcion: "Collares, correas, camas y platos" },
    { id: 5, nombre: "Farmacia", descripcion: "Antiparasitarios y suplementos" },
  ],
  productos: [
    { id: 1, nombre: "Alimento Perro Adulto 15kg", descripcion: "Balanceado premium sabor carne", precio: 2890, stock: 24, stockMinimo: 10, categoriaId: 1, imagenUrl: "" },
    { id: 2, nombre: "Alimento Gato Castrado 7.5kg", descripcion: "Control de peso y salud urinaria", precio: 2150, stock: 6, stockMinimo: 8, categoriaId: 1, imagenUrl: "" },
    { id: 3, nombre: "Shampoo Antipulgas 500ml", descripcion: "Uso veterinario para perros y gatos", precio: 480, stock: 32, stockMinimo: 10, categoriaId: 2, imagenUrl: "" },
    { id: 4, nombre: "Piedras Sanitarias 10kg", descripcion: "Alta absorción, control de olores", precio: 690, stock: 4, stockMinimo: 12, categoriaId: 2, imagenUrl: "" },
    { id: 5, nombre: "Pelota Mordedora", descripcion: "Caucho resistente, tamaño mediano", precio: 320, stock: 45, stockMinimo: 15, categoriaId: 3, imagenUrl: "" },
    { id: 6, nombre: "Rascador para Gatos", descripcion: "Torre de sisal con plataforma", precio: 1980, stock: 9, stockMinimo: 5, categoriaId: 3, imagenUrl: "" },
    { id: 7, nombre: "Collar Reflectivo", descripcion: "Nylon ajustable con hebilla", precio: 410, stock: 60, stockMinimo: 20, categoriaId: 4, imagenUrl: "" },
    { id: 8, nombre: "Cama Acolchada M", descripcion: "Tela lavable, base antideslizante", precio: 1750, stock: 3, stockMinimo: 6, categoriaId: 4, imagenUrl: "" },
    { id: 9, nombre: "Antiparasitario Oral", descripcion: "Comprimidos para perros 10-25kg", precio: 890, stock: 28, stockMinimo: 10, categoriaId: 5, imagenUrl: "" },
    { id: 10, nombre: "Pipeta Antipulgas Gato", descripcion: "Protección mensual", precio: 560, stock: 18, stockMinimo: 10, categoriaId: 5, imagenUrl: "" },
  ],
  empleados: [
    { id: 1, nombre: "Sofía", apellido: "Méndez", cargo: "Encargada de local", telefono: "099 888 111", email: "sofia.mendez@petcare.com" },
    { id: 2, nombre: "Bruno", apellido: "Castro", cargo: "Vendedor", telefono: "098 445 220", email: "bruno.castro@petcare.com" },
    { id: 3, nombre: "Ana", apellido: "Ledesma", cargo: "Veterinaria", telefono: "094 100 337", email: "ana.ledesma@petcare.com" },
    { id: 4, nombre: "Nicolás", apellido: "Ferreira", cargo: "Peluquero canino", telefono: "091 776 543", email: "nicolas.ferreira@petcare.com" },
  ],
  ventas: [
    { id: 1, clienteId: 1, empleadoId: 2, fecha: "2026-03-11", total: 3370, detalles: [ { productoId: 1, productoNombre: "Alimento Perro Adulto 15kg", cantidad: 1, precioUnitario: 2890, subtotal: 2890 }, { productoId: 3, productoNombre: "Shampoo Antipulgas 500ml", cantidad: 1, precioUnitario: 480, subtotal: 480 } ] },
    { id: 2, clienteId: 3, empleadoId: 1, fecha: "2026-04-02", total: 2840, detalles: [ { productoId: 2, productoNombre: "Alimento Gato Castrado 7.5kg", cantidad: 1, precioUnitario: 2150, subtotal: 2150 }, { productoId: 4, productoNombre: "Piedras Sanitarias 10kg", cantidad: 1, precioUnitario: 690, subtotal: 690 } ] },
    { id: 3, clienteId: 2, empleadoId: 2, fecha: "2026-05-19", total: 1230, detalles: [ { productoId: 5, productoNombre: "Pelota Mordedora", cantidad: 2, precioUnitario: 320, subtotal: 640 }, { productoId: 7, productoNombre: "Collar Reflectivo", cantidad: 1, precioUnitario: 410, subtotal: 410 }, { productoId: 10, productoNombre: "Pipeta Antipulgas Gato", cantidad: 1, precioUnitario: 560, subtotal: 560 } ] },
    { id: 4, clienteId: 5, empleadoId: 3, fecha: "2026-06-07", total: 5780, detalles: [ { productoId: 1, productoNombre: "Alimento Perro Adulto 15kg", cantidad: 2, precioUnitario: 2890, subtotal: 5780 } ] },
    { id: 5, clienteId: 4, empleadoId: 4, fecha: "2026-07-21", total: 2670, detalles: [ { productoId: 6, productoNombre: "Rascador para Gatos", cantidad: 1, precioUnitario: 1980, subtotal: 1980 }, { productoId: 9, productoNombre: "Antiparasitario Oral", cantidad: 1, precioUnitario: 890, subtotal: 890 } ] },
    { id: 6, clienteId: 1, empleadoId: 1, fecha: "2026-08-14", total: 4640, detalles: [ { productoId: 8, productoNombre: "Cama Acolchada M", cantidad: 1, precioUnitario: 1750, subtotal: 1750 }, { productoId: 2, productoNombre: "Alimento Gato Castrado 7.5kg", cantidad: 1, precioUnitario: 2150, subtotal: 2150 }, { productoId: 7, productoNombre: "Collar Reflectivo", cantidad: 1, precioUnitario: 410, subtotal: 410 }, { productoId: 5, productoNombre: "Pelota Mordedora", cantidad: 1, precioUnitario: 320, subtotal: 320 } ] },
  ],
};

const nextId = (rows: Array<{ id: number }>) =>
  rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function resumen(): DashboardResumen {
  const ventasPorMes = MESES.map((mes, i) => ({
    mes,
    total: db.ventas
      .filter((v) => new Date(v.fecha).getMonth() === i)
      .reduce((s, v) => s + v.total, 0),
  }));

  const vendidos = new Map<string, number>();
  for (const venta of db.ventas) {
    for (const d of venta.detalles) {
      vendidos.set(d.productoNombre, (vendidos.get(d.productoNombre) ?? 0) + d.cantidad);
    }
  }

  const especies = new Map<string, number>();
  for (const m of db.mascotas) {
    especies.set(m.especie, (especies.get(m.especie) ?? 0) + 1);
  }

  return {
    totalClientes: db.clientes.length,
    totalMascotas: db.mascotas.length,
    totalProductos: db.productos.length,
    productosBajoStock: db.productos.filter((p) => p.stock <= p.stockMinimo).length,
    totalVentas: db.ventas.length,
    montoVentas: db.ventas.reduce((s, v) => s + v.total, 0),
    ventasPorMes,
    productosMasVendidos: [...vendidos.entries()]
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5),
    mascotasPorEspecie: [...especies.entries()].map(([especie, cantidad]) => ({ especie, cantidad })),
  };
}

const collections = ["clientes", "mascotas", "categorias", "productos", "empleados", "ventas"] as const;
type CollectionName = (typeof collections)[number];

function crearVenta(payload: VentaPayload): Venta {
  const detalles = payload.detalles.map((item) => {
    const producto = db.productos.find((p) => p.id === item.productoId);
    if (!producto) throw new Error(`Producto ${item.productoId} inexistente`);
    producto.stock = Math.max(0, producto.stock - item.cantidad);
    return {
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad: item.cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * item.cantidad,
    };
  });

  const venta: Venta = {
    id: nextId(db.ventas),
    clienteId: payload.clienteId,
    empleadoId: payload.empleadoId,
    fecha: new Date().toISOString().slice(0, 10),
    total: detalles.reduce((s, d) => s + d.subtotal, 0),
    detalles,
  };
  db.ventas.push(venta);
  return venta;
}

/** Emula las respuestas del backend REST para el path/método indicados. */
export function mockRequest<T>(method: string, path: string, body?: unknown): T {
  const clean = path.replace(/^\/+/, "").split("?")[0] ?? "";
  const [resource, idPart] = clean.split("/");

  if (resource === "dashboard") return resumen() as T;

  if (!collections.includes(resource as CollectionName)) {
    throw new Error(`Recurso no soportado: /${resource}`);
  }
  const name = resource as CollectionName;
  const rows = db[name] as Array<{ id: number }>;

  if (method === "GET") {
    if (idPart) {
      const found = rows.find((r) => r.id === Number(idPart));
      if (!found) throw new Error("Registro no encontrado");
      return found as T;
    }
    return [...rows].reverse() as T;
  }

  if (method === "POST") {
    if (name === "ventas") return crearVenta(body as VentaPayload) as T;
    const created = { ...(body as object), id: nextId(rows) } as { id: number };
    rows.push(created);
    return created as T;
  }

  if (method === "PUT") {
    const index = rows.findIndex((r) => r.id === Number(idPart));
    if (index === -1) throw new Error("Registro no encontrado");
    rows[index] = { ...(rows[index] as object), ...(body as object), id: Number(idPart) };
    return rows[index] as T;
  }

  if (method === "DELETE") {
    const index = rows.findIndex((r) => r.id === Number(idPart));
    if (index === -1) throw new Error("Registro no encontrado");
    rows.splice(index, 1);
    return undefined as T;
  }

  throw new Error(`Método no soportado: ${method}`);
}
