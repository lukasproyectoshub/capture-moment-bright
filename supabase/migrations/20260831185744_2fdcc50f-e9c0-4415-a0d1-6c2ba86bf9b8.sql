-- ==== MASCOTAS ====
CREATE TABLE public.mascotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  especie TEXT NOT NULL DEFAULT 'Perro',
  raza TEXT NOT NULL DEFAULT '',
  fecha_nacimiento DATE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mascotas TO authenticated;
GRANT ALL ON public.mascotas TO service_role;
ALTER TABLE public.mascotas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados gestionan mascotas" ON public.mascotas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_mascotas_updated_at BEFORE UPDATE ON public.mascotas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_mascotas_cliente ON public.mascotas(cliente_id);

-- ==== EMPLEADOS ====
CREATE TABLE public.empleados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  cargo TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL DEFAULT '',
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empleados TO authenticated;
GRANT ALL ON public.empleados TO service_role;
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados gestionan empleados" ON public.empleados FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_empleados_updated_at BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==== PEDIDOS: empleado que atiende ====
ALTER TABLE public.pedidos ADD COLUMN empleado_id UUID REFERENCES public.empleados(id) ON DELETE SET NULL;

-- ==== STOCK AUTOMATICO ====
CREATE OR REPLACE FUNCTION public.ajustar_stock_pedido_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.producto_id IS NOT NULL THEN
      UPDATE public.productos SET stock = GREATEST(stock - NEW.cantidad, 0) WHERE id = NEW.producto_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.producto_id IS NOT NULL THEN
      UPDATE public.productos SET stock = stock + OLD.cantidad WHERE id = OLD.producto_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.producto_id IS NOT NULL THEN
      UPDATE public.productos SET stock = stock + OLD.cantidad WHERE id = OLD.producto_id;
    END IF;
    IF NEW.producto_id IS NOT NULL THEN
      UPDATE public.productos SET stock = GREATEST(stock - NEW.cantidad, 0) WHERE id = NEW.producto_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER pedido_items_stock
AFTER INSERT OR UPDATE OR DELETE ON public.pedido_items
FOR EACH ROW EXECUTE FUNCTION public.ajustar_stock_pedido_item();

-- ==== DATOS DE EJEMPLO ====
INSERT INTO public.categorias (id, nombre, descripcion) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Alimentos', 'Alimento seco y humedo para mascotas'),
  ('11111111-1111-1111-1111-111111111102', 'Juguetes', 'Juguetes y entretenimiento'),
  ('11111111-1111-1111-1111-111111111103', 'Higiene', 'Shampoo, cepillos y cuidado'),
  ('11111111-1111-1111-1111-111111111104', 'Accesorios', 'Collares, correas y camas'),
  ('11111111-1111-1111-1111-111111111105', 'Salud', 'Antiparasitarios y vitaminas'),
  ('11111111-1111-1111-1111-111111111106', 'Aves y roedores', 'Productos para aves y roedores');

INSERT INTO public.productos (id, nombre, descripcion, precio, stock, stock_minimo, categoria_id) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Alimento perro adulto 15kg', 'Balanceado premium para perro adulto', 2890, 24, 6, '11111111-1111-1111-1111-111111111101'),
  ('22222222-2222-2222-2222-222222222202', 'Alimento gato adulto 7,5kg', 'Balanceado para gato adulto', 1980, 18, 5, '11111111-1111-1111-1111-111111111101'),
  ('22222222-2222-2222-2222-222222222203', 'Lata pate pollo 340g', 'Alimento humedo sabor pollo', 190, 60, 12, '11111111-1111-1111-1111-111111111101'),
  ('22222222-2222-2222-2222-222222222204', 'Pelota de goma', 'Pelota resistente para perros', 320, 40, 8, '11111111-1111-1111-1111-111111111102'),
  ('22222222-2222-2222-2222-222222222205', 'Raton de peluche', 'Juguete con catnip para gatos', 210, 35, 8, '11111111-1111-1111-1111-111111111102'),
  ('22222222-2222-2222-2222-222222222206', 'Shampoo hipoalergenico 500ml', 'Shampoo suave para piel sensible', 480, 22, 6, '11111111-1111-1111-1111-111111111103'),
  ('22222222-2222-2222-2222-222222222207', 'Cepillo deslanador', 'Cepillo para pelo largo', 560, 4, 5, '11111111-1111-1111-1111-111111111103'),
  ('22222222-2222-2222-2222-222222222208', 'Collar antipulgas', 'Proteccion por 4 meses', 690, 15, 5, '11111111-1111-1111-1111-111111111105'),
  ('22222222-2222-2222-2222-222222222209', 'Correa retractil 5m', 'Correa con freno automatico', 890, 12, 4, '11111111-1111-1111-1111-111111111104'),
  ('22222222-2222-2222-2222-222222222210', 'Cama acolchada mediana', 'Cama lavable para perro mediano', 2350, 3, 4, '11111111-1111-1111-1111-111111111104'),
  ('22222222-2222-2222-2222-222222222211', 'Antiparasitario interno', 'Comprimidos para desparasitar', 540, 30, 8, '11111111-1111-1111-1111-111111111105'),
  ('22222222-2222-2222-2222-222222222212', 'Mixtura para canarios 1kg', 'Semillas seleccionadas', 260, 26, 6, '11111111-1111-1111-1111-111111111106');

INSERT INTO public.clientes (id, nombre, apellido, telefono, email, direccion) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Lucia', 'Fernandez', '099 123 456', 'lucia.fernandez@mail.com', 'Av. Rivera 2345, Montevideo'),
  ('33333333-3333-3333-3333-333333333302', 'Martin', 'Pereyra', '098 774 210', 'martin.pereyra@mail.com', 'Bvar. Espana 1120, Montevideo'),
  ('33333333-3333-3333-3333-333333333303', 'Camila', 'Rodriguez', '094 556 001', 'camila.rodriguez@mail.com', '18 de Julio 980, Montevideo'),
  ('33333333-3333-3333-3333-333333333304', 'Diego', 'Silva', '091 220 887', 'diego.silva@mail.com', 'Luis A. de Herrera 3410'),
  ('33333333-3333-3333-3333-333333333305', 'Valentina', 'Gomez', '096 332 118', 'valentina.gomez@mail.com', 'Cno. Carrasco 5570');

INSERT INTO public.mascotas (id, nombre, especie, raza, fecha_nacimiento, cliente_id) VALUES
  ('44444444-4444-4444-4444-444444444401', 'Rocco', 'Perro', 'Labrador', '2021-04-12', '33333333-3333-3333-3333-333333333301'),
  ('44444444-4444-4444-4444-444444444402', 'Mishi', 'Gato', 'Siames', '2022-09-03', '33333333-3333-3333-3333-333333333301'),
  ('44444444-4444-4444-4444-444444444403', 'Toby', 'Perro', 'Caniche', '2019-01-25', '33333333-3333-3333-3333-333333333302'),
  ('44444444-4444-4444-4444-444444444404', 'Kiwi', 'Ave', 'Canario', '2023-02-18', '33333333-3333-3333-3333-333333333303'),
  ('44444444-4444-4444-4444-444444444405', 'Nina', 'Gato', 'Mestiza', '2020-11-30', '33333333-3333-3333-3333-333333333304'),
  ('44444444-4444-4444-4444-444444444406', 'Lola', 'Perro', 'Bulldog', '2022-06-08', '33333333-3333-3333-3333-333333333305');

INSERT INTO public.empleados (id, nombre, apellido, cargo, telefono, email) VALUES
  ('55555555-5555-5555-5555-555555555501', 'Sofia', 'Machado', 'Encargada de local', '099 445 112', 'sofia.machado@petcare.com'),
  ('55555555-5555-5555-5555-555555555502', 'Bruno', 'Acosta', 'Vendedor', '098 221 034', 'bruno.acosta@petcare.com'),
  ('55555555-5555-5555-5555-555555555503', 'Paula', 'Nunez', 'Veterinaria', '094 887 665', 'paula.nunez@petcare.com'),
  ('55555555-5555-5555-5555-555555555504', 'Ignacio', 'Duarte', 'Peluquero canino', '091 556 778', 'ignacio.duarte@petcare.com');

INSERT INTO public.pedidos (id, cliente_id, empleado_id, fecha, estado) VALUES
  ('66666666-6666-6666-6666-666666666601', '33333333-3333-3333-3333-333333333301', '55555555-5555-5555-5555-555555555502', CURRENT_DATE - 20, 'entregado'),
  ('66666666-6666-6666-6666-666666666602', '33333333-3333-3333-3333-333333333303', '55555555-5555-5555-5555-555555555501', CURRENT_DATE - 8, 'entregado'),
  ('66666666-6666-6666-6666-666666666603', '33333333-3333-3333-3333-333333333305', '55555555-5555-5555-5555-555555555502', CURRENT_DATE - 2, 'pendiente');

INSERT INTO public.pedido_items (pedido_id, producto_id, producto_nombre, cantidad, precio_unitario) VALUES
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201', 'Alimento perro adulto 15kg', 1, 2890),
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222204', 'Pelota de goma', 2, 320),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222202', 'Alimento gato adulto 7,5kg', 1, 1980),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222206', 'Shampoo hipoalergenico 500ml', 1, 480),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222212', 'Mixtura para canarios 1kg', 3, 260),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222211', 'Antiparasitario interno', 2, 540);