import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { MapPin, Bed, Bath, Square, Eye, Calendar, ArrowLeft, Shield, CheckCircle, Share2, Heart, Compass, ListChecks } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { propertiesAPI, formatPrice, type Property } from '../utils/api';
import { MapPlaceholder } from '../components/MapPlaceholder';
import { toast } from 'sonner';

interface PropertyDetailPageProps {
  propertyId: string | null;
  onBack: () => void;
  onNavigateToContact: () => void;
}

export function PropertyDetailPage({ propertyId, onBack, onNavigateToContact }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Cargar favoritos de localStorage
  useEffect(() => {
    if (!propertyId) return;
    try {
      const raw = localStorage.getItem('fav_properties');
      if (raw) {
        const list: string[] = JSON.parse(raw);
        setIsFavorite(list.includes(propertyId));
      }
    } catch {}
  }, [propertyId]);

  const toggleFavorite = useCallback(() => {
    if (!propertyId) return;
    try {
      const raw = localStorage.getItem('fav_properties');
      let list: string[] = raw ? JSON.parse(raw) : [];
      if (list.includes(propertyId)) {
        list = list.filter(id => id !== propertyId);
        setIsFavorite(false);
        toast.info('Eliminado de favoritos');
      } else {
        list.push(propertyId);
        setIsFavorite(true);
        toast.success('Añadido a favoritos');
      }
      localStorage.setItem('fav_properties', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }, [propertyId]);

  const shareLink = useCallback(() => {
    if (!propertyId) return;
    const url = `${window.location.origin}#/propiedad/${propertyId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Enlace copiado');
    }).catch(() => {
      toast.error('No se pudo copiar');
    });
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) {
      setError('No se especificó la propiedad.');
      setLoading(false);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await propertiesAPI.getById(propertyId);
        // API responde { property: {...} }
        const prop = response.property || response;
        if (active) {
          setProperty(prop);
          setActiveImage(prop.images?.[0] || null);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Error cargando propiedad');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [propertyId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-6">
          <Button variant="ghost" onClick={onBack} className="group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Volver
          </Button>
          <h1 className="text-2xl font-semibold">Detalle de Propiedad</h1>
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        )}

        {!loading && error && (
          <Card className="p-10 text-center animate-in fade-in">
            <h2 className="text-xl mb-4">No se pudo cargar la propiedad</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={onBack}>Volver</Button>
          </Card>
        )}

        {!loading && property && (
          <div className="space-y-14 animate-in fade-in slide-in-from-bottom-4">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 flex flex-wrap items-center gap-1">
              <button className="hover:text-gray-800 transition-colors" onClick={onBack}>Propiedades</button>
              <span>/</span>
              <span className="text-gray-800 font-medium line-clamp-1 max-w-xs md:max-w-sm">{property.title}</span>
            </div>

            {/* Layout principal */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-2 space-y-6">
                <div className="relative rounded-2xl overflow-hidden shadow group ring-1 ring-gray-200/60">
                  <ImageWithFallback
                    src={activeImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'}
                    alt={property.title}
                    className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={property.status === 'Vendido' ? 'bg-red-600' : 'bg-blue-600'}>{property.status}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={toggleFavorite} className={`p-2 rounded-full backdrop-blur bg-white/80 shadow hover:scale-105 transition ${isFavorite ? 'text-red-600' : 'text-gray-600'}`}>
                      <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={shareLink} className="p-2 rounded-full backdrop-blur bg-white/80 shadow hover:scale-105 transition text-gray-600">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-5 py-3 rounded text-xl font-semibold flex items-center gap-2">
                    {typeof property.price === 'number' ? formatPrice(property.price) : property.price}
                  </div>
                </div>
                {property.images && property.images.length > 1 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {property.images.slice(0, 10).map(img => (
                      <button key={img} onClick={() => setActiveImage(img)} className={`relative rounded-lg overflow-hidden ring-2 transition ${activeImage === img ? 'ring-blue-500' : 'ring-transparent hover:ring-blue-300'}`}>
                        <ImageWithFallback src={img} alt="miniatura" className="w-full h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Sección descripción y características */}
                <Card className="shadow-sm">
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-3">
                      <h2 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
                        <span>{property.title}</span>
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {property.location}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(property.createdAt).toLocaleDateString('es-ES')}</span>
                        <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {property.views || 0} vistas</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex flex-col items-center gap-1">
                        <Bed className="h-5 w-5 text-blue-600" />
                        <span className="text-xs text-gray-500">Habitaciones</span>
                        <span className="font-medium text-gray-800">{property.bedrooms}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex flex-col items-center gap-1">
                        <Bath className="h-5 w-5 text-emerald-600" />
                        <span className="text-xs text-gray-500">Baños</span>
                        <span className="font-medium text-gray-800">{property.bathrooms}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex flex-col items-center gap-1">
                        <Square className="h-5 w-5 text-amber-600" />
                        <span className="text-xs text-gray-500">Área</span>
                        <span className="font-medium text-gray-800">{property.area} m²</span>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 flex flex-col items-center gap-1">
                        <Compass className="h-5 w-5 text-pink-600" />
                        <span className="text-xs text-gray-500">Estado</span>
                        <span className="font-medium text-gray-800">{property.status}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><ListChecks className="h-5 w-5 text-blue-600" /> Descripción</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {property.description || 'Sin descripción detallada.'}
                      </p>
                    </div>
                    {property.features && property.features.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Características</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.features.map(f => (
                            <Badge key={f} variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200">{f}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Ubicación</h3>
                      <MapPlaceholder />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-8 xl:sticky xl:top-24 h-fit">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-semibold leading-tight tracking-tight">{property.title}</h2>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" /> {property.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(property.createdAt).toLocaleDateString('es-ES')}</div>
                      <div className="flex items-center gap-1"><Eye className="h-3 w-3" /> {property.views || 0} vistas</div>
                    </div>
                    <Button className="w-full" onClick={onNavigateToContact}>Contactar</Button>
                  </CardContent>
                </Card>
                {property.amenities && property.amenities.length > 0 && (
                  <Card>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Amenidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map(a => (
                          <Badge key={a} variant="secondary" className="bg-gray-100">{a}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {property.security && property.security.length > 0 && (
                  <Card>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4" /> Seguridad</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.security.map(s => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
