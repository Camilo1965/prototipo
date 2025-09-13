-- Eliminar propiedades con IDs antiguos, mantener solo las que tienen formato PROP-XXX
DELETE FROM public.kv_store_5b516b3d 
WHERE key LIKE 'property:%' 
AND key NOT LIKE 'property:PROP-%';

-- Verificar las propiedades restantes
SELECT key, value->>'id' as property_id, value->>'title' as title 
FROM public.kv_store_5b516b3d 
WHERE key LIKE 'property:%';