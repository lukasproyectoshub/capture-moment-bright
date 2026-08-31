DROP TABLE IF EXISTS public.productos CASCADE;

CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categorias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categorias TO authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categorias visibles para todos" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Autenticados crean categorias" ON public.categorias FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados actualizan categorias" ON public.categorias FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Autenticados eliminan categorias" ON public.categorias FOR DELETE TO authenticated USING (true);

CREATE TABLE public.productos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  precio NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT NOT NULL DEFAULT '',
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX productos_categoria_id_idx ON public.productos(categoria_id);
GRANT SELECT ON public.productos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.productos TO authenticated;
GRANT ALL ON public.productos TO service_role;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Productos visibles para todos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Autenticados crean productos" ON public.productos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados actualizan productos" ON public.productos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Autenticados eliminan productos" ON public.productos FOR DELETE TO authenticated USING (true);

CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE,
  direccion TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados gestionan clientes" ON public.clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','preparando','entregado','cancelado')),
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX pedidos_cliente_id_idx ON public.pedidos(cliente_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pedidos TO authenticated;
GRANT ALL ON public.pedidos TO service_role;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados gestionan pedidos" ON public.pedidos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.pedido_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id) ON DELETE SET NULL,
  producto_nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX pedido_items_pedido_id_idx ON public.pedido_items(pedido_id);
CREATE INDEX pedido_items_producto_id_idx ON public.pedido_items(producto_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pedido_items TO authenticated;
GRANT ALL ON public.pedido_items TO service_role;
ALTER TABLE public.pedido_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados gestionan detalle de pedidos" ON public.pedido_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedido_items_updated_at BEFORE UPDATE ON public.pedido_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.calcular_subtotal_pedido_item()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER pedido_items_subtotal BEFORE INSERT OR UPDATE ON public.pedido_items FOR EACH ROW EXECUTE FUNCTION public.calcular_subtotal_pedido_item();

CREATE OR REPLACE FUNCTION public.recalcular_total_pedido()
RETURNS TRIGGER AS $$
DECLARE
  objetivo UUID := COALESCE(NEW.pedido_id, OLD.pedido_id);
BEGIN
  UPDATE public.pedidos p
  SET total = COALESCE((SELECT SUM(i.subtotal) FROM public.pedido_items i WHERE i.pedido_id = objetivo), 0)
  WHERE p.id = objetivo;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER pedido_items_total AFTER INSERT OR UPDATE OR DELETE ON public.pedido_items FOR EACH ROW EXECUTE FUNCTION public.recalcular_total_pedido();