## Uso de Coordenadas (Modelo Híbrido)

Este proyecto admite dos formas de establecer ubicación de una propiedad:

1. Pegar una URL de Google Maps (campo "URL de Google Maps") y pulsar "Extraer".
2. Seleccionar directamente sobre el mapa interactivo (MapPicker) o introducir manualmente lat / lng.

Al guardar se almacenan:
- lat, lng (si son válidos)
- googleMapsUrl (la original si se proporcionó, o una generada `https://www.google.com/maps?q=lat,lng`)

### Formatos de URL aceptados
- `https://www.google.com/maps/place/.../@40.416775,-3.703790,17z/...`
- `https://www.google.com/maps?q=40.416775,-3.703790`
- `https://www.google.com/maps/@40.416775,-3.703790,15z`

El parser detecta patrones `@lat,lng,` o query param `q=lat,lng`.

### Buenas prácticas
- Ajusta el zoom en Google Maps antes de copiar la URL para mayor precisión.
- Revisa que las coordenadas no tengan coma mal localizada (p.e. usar punto decimal).
- Si pegas una URL corta `https://maps.app.goo.gl/...`, ábrela primero y copia la versión expandida.
- Si cambias manualmente lat/lng y no hay URL, se genera una básica automáticamente.

### Errores comunes
| Problema | Causa | Solución |
|----------|-------|----------|
| "No se pudieron extraer coordenadas" | URL sin patrones reconocibles | Copiar la URL completa desde la barra del navegador tras abrir Google Maps |
| Marcador no aparece | Lat/lng vacíos o inválidos | Revisar números y volver a extraer |
| Mapa no carga | Conexión o bloqueo externo | Reintentar; Leaflet usa OpenStreetMap (no requiere API key) |

### Futuro (ideas)
- Búsqueda por radio / proximidad
- Clustering de propiedades
- Enriquecimiento SEO con `GeoCoordinates`
- Validación inversa (reverse geocoding) para mostrar barrio automático

---
Última actualización: auto-generada.