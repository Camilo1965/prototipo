import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import 'leaflet/dist/leaflet.css';
import './leaflet-fixes.css';

interface MapPickerProps {
  lat?: number | null;
  lng?: number | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  heightClass?: string;
}

// Simple Leaflet based picker (lazy loaded)
export function MapPicker({ lat, lng, onChange, heightClass = 'h-96' }: MapPickerProps) {
  const [leafletReady, setLeafletReady] = useState(false);
  const [components, setComponents] = useState<any>(null);
  // Bucaramanga área metropolitana: lat 7.11935, lng -73.12274
  const DEFAULT_CENTER = { lat: 7.11935, lng: -73.12274 };
  const [internal, setInternal] = useState<{ lat: number; lng: number } | null>(lat != null && lng != null ? { lat, lng } : DEFAULT_CENTER);

  // Pre-define the ClickLayer component outside of conditional rendering
  // This avoids defining a component inside the render function conditionally
  const ClickLayerComponent = (props: { handleClick: (e: any) => void; useMapEvents: any }) => {
    const { handleClick, useMapEvents } = props;
    useMapEvents({
      click: handleClick
    });
    return null;
  };

  // Definimos un icono personalizado fuera del efecto para asegurar que siempre esté disponible
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
    (async () => {
      try {
        const leafletMod: any = await import('react-leaflet');
        // No confiamos en Icon.Default, usamos nuestro icono personalizado
        setComponents(leafletMod);
        setLeafletReady(true);
      } catch (e) {
        console.warn('No se pudo cargar Leaflet en MapPicker', e);
      }
    })();
    return () => {};
  }, []);

  useEffect(() => {
    if (lat != null && lng != null) {
      setInternal({ lat, lng });
    }
  }, [lat, lng]);

  const handleMapClick = (e: any) => {
    const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
    setInternal(newCoords);
    onChange(newCoords);
  };

  if (!leafletReady || !components) {
    return (
      <div className={`relative ${heightClass} rounded-lg border flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50`}>
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-40 mx-auto" />
          <div className="text-xs text-gray-500">Cargando mapa...</div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = components;
  
  // Create ClickLayer with necessary props
  const ClickLayer = () => <ClickLayerComponent handleClick={handleMapClick} useMapEvents={useMapEvents} />;

  return (
    <div className={`relative ${heightClass} rounded-lg overflow-hidden border`}> 
      <MapContainer
        center={[internal?.lat || DEFAULT_CENTER.lat, internal?.lng || DEFAULT_CENTER.lng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickLayer />
        {internal && (
          <Marker 
            position={[internal.lat, internal.lng]} 
            icon={customIcon}
          >
            {components.Popup && (
              <components.Popup>Ubicación seleccionada</components.Popup>
            )}
          </Marker>
        )}
      </MapContainer>
      {internal && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs shadow">
          {internal.lat.toFixed(5)}, {internal.lng.toFixed(5)}
        </div>
      )}
      <div className="absolute top-2 left-2 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setInternal(null)}>Limpiar</Button>
      </div>
    </div>
  );
}
