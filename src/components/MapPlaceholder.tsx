import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  height?: number;
  label?: string;
}

export function MapPlaceholder({ height = 320, label = 'Mapa de ubicación (próximamente)' }: MapPlaceholderProps) {
  return (
    <div 
      className="relative w-full rounded-xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden group"
      style={{ height }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.03),transparent)]" />
      <div className="text-center p-6">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-white shadow flex items-center justify-center group-hover:scale-105 transition-transform">
          <MapPin className="h-7 w-7 text-gray-500" />
        </div>
        <p className="text-gray-600 font-medium mb-1">{label}</p>
        <p className="text-xs text-gray-400 max-w-xs">Aquí mostraremos un mapa interactivo con la ubicación precisa de la propiedad.</p>
      </div>
    </div>
  );
}
