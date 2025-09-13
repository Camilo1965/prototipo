import { useEffect, useState, useRef } from 'react';
import { MapPlaceholder } from './MapPlaceholder';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-fixes.css';

// Lazy import pattern to avoid SSR / build issues and only load leaflet in browser
export interface PropertyMapProps {
  lat?: number | null;
  lng?: number | null;
  title?: string;
  heightClass?: string; // Tailwind height utility (e.g., 'h-80')
}

export function PropertyMap({ lat, lng, title, heightClass = 'h-80' }: PropertyMapProps) {
  // All hooks need to be declared unconditionally at the top level
  const [LeafletComponents, setLeafletComponents] = useState<null | {
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
  }>(null);
  const [interactive, setInteractive] = useState(false); // Moved from below
  const wrapperRef = useRef<HTMLDivElement | null>(null); // Moved from below

  // Validate coordinates
  const valid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

  // Define custom icon for marker using local files
  const customIcon = L.icon({
    iconUrl: '/images/leaflet/marker-icon.png',
    iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
    shadowUrl: '/images/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    let cancelled = false;
    if (!valid) return; // no attempt if invalid coords
    // Dynamically import leaflet & CSS once
    (async () => {
      try {
        // Import react-leaflet (named exports)
        const leafletMod: any = await import('react-leaflet');
        // No need to import CSS again since we already imported it at the top
        const { MapContainer, TileLayer, Marker, Popup } = leafletMod;
        if (!cancelled) {
          setLeafletComponents({ MapContainer, TileLayer, Marker, Popup });
        }
      } catch (e) {
        console.warn('No se pudo cargar el mapa dinámico', e);
      }
    })();
    return () => { cancelled = true; };
  }, [valid]);

  // Handle map interaction - defined before any conditionals
  const enableInteraction = () => setInteractive(true);

  if (!valid) {
    return <MapPlaceholder label="Coordenadas no disponibles" />;
  }

  if (!LeafletComponents) {
    return (
      <div className={`relative ${heightClass} w-full rounded-xl overflow-hidden border bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center`}> 
        <div className="space-y-3 text-center">
          <div className="animate-pulse text-sm text-gray-500">Cargando mapa...</div>
          <div className="flex gap-2 justify-center">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

  return (
    <div ref={wrapperRef} className={`relative ${heightClass} w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm`}> 
      {!interactive && (
        <button
          onClick={enableInteraction}
          className="absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/70 transition"
          aria-label="Activar interacción con el mapa"
        >
          <span className="text-sm font-medium">Activar mapa (scroll y zoom)</span>
          <span className="mt-1 text-xs text-gray-500">Click para permitir navegación</span>
        </button>
      )}
      <MapContainer
        center={[lat!, lng!]}
        zoom={15}
        scrollWheelZoom={interactive}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[lat!, lng!]} 
          icon={customIcon}
        > 
          <Popup>
            <div className="text-sm font-medium">{title || 'Ubicación'}</div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-xl shadow-inner" />
      {/* Controles adicionales podrían añadirse aquí si se requiere */}
    </div>
  );
}
