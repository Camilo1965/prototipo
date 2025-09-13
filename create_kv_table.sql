-- Crear la tabla kv_store_5b516b3d para el sistema de almacenamiento clave-valor
CREATE TABLE IF NOT EXISTS public.kv_store_5b516b3d (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar rendimiento en consultas por prefijo
CREATE INDEX IF NOT EXISTS idx_kv_store_5b516b3d_key_prefix ON public.kv_store_5b516b3d USING btree (key text_pattern_ops);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_kv_store_5b516b3d_updated_at ON public.kv_store_5b516b3d;
CREATE TRIGGER update_kv_store_5b516b3d_updated_at 
  BEFORE UPDATE ON public.kv_store_5b516b3d 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.kv_store_5b516b3d ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones con service_role
CREATE POLICY "Enable all operations for service role" ON public.kv_store_5b516b3d
FOR ALL USING (auth.role() = 'service_role');

-- Crear política para usuarios autenticados (lectura limitada)
CREATE POLICY "Enable read for authenticated users" ON public.kv_store_5b516b3d
FOR SELECT USING (auth.role() = 'authenticated');

-- Comentarios para documentación
COMMENT ON TABLE public.kv_store_5b516b3d IS 'Tabla de almacenamiento clave-valor para propiedades e inquiries del sistema InmoPlus';
COMMENT ON COLUMN public.kv_store_5b516b3d.key IS 'Clave única del registro (ej: property:PROP-001, inquiry:uuid)';
COMMENT ON COLUMN public.kv_store_5b516b3d.value IS 'Valor JSON del registro';