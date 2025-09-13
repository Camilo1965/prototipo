-- Eliminar el trigger que está causando el error
DROP TRIGGER IF EXISTS update_kv_store_5b516b3d_updated_at ON public.kv_store_5b516b3d;

-- Eliminar la función también
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Verificar la estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'kv_store_5b516b3d';