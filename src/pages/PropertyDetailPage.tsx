
import React, { useEffect, useState, useCallback } from 'react';

class DetailErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    // Optionally log error
    console.error('Error in PropertyDetailPage:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-10 text-center text-red-600">
          <h2 className="text-xl mb-4">Error en la página de detalle</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded max-w-xl mx-auto overflow-x-auto">{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { MapPin, Bed, Bath, Square, Eye, Calendar, ArrowLeft, Shield, CheckCircle, Share2, Heart, Compass, ListChecks } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { propertiesAPI, formatPrice, type Property, inquiriesAPI } from '../utils/api';
import { MapPlaceholder } from '../components/MapPlaceholder';
import { PropertyMap } from '../components/PropertyMap';
import { toast } from 'sonner';

interface PropertyDetailPageProps {
  propertyId: string | null;
  onBack: () => void;
  onNavigateToContact: () => void;
}



function PropertyDetailPageInner({ propertyId, onBack, onNavigateToContact }: PropertyDetailPageProps) {
  // Carrusel autoplay para detalle
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  // Declarar images después de property y activeImage
  // Declarar images después de property y activeImage
  // (restaurado: no se usa images, solo property.images directamente)

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const submitInquiry = async () => {
    if (!property) return;
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast.error('Completa nombre, email y mensaje');
      return;
    }
    try {
      setContactSubmitting(true);
      await inquiriesAPI.create({
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
        propertyId: property.id,
        phone: ''
      });
      toast.success('Consulta enviada');
      setContactData({ name: '', email: '', message: '' });
    } catch (e) {
      toast.error('No se pudo enviar');
    } finally {
      setContactSubmitting(false);
    }
  };

  const loadRelated = useCallback(async (base: Property) => {
    try {
      const resp = await propertiesAPI.getAll({ limit: 50 });
      if (resp.properties) {
        const list: Property[] = resp.properties
          .filter((p: Property) => p.id !== base.id && (p.type === base.type || p.location === base.location))
          .slice(0, 6);
        setRelated(list);
      }
    } catch (e) {
      console.warn('No se pudieron cargar relacionadas');
    }
  }, []);

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
          loadRelated(prop);
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

  // Dynamic SEO (title & meta description) when property data is available
  useEffect(() => {
    if (!property) return;
    const previousTitle = document.title;
    const newTitle = `${property.title} | Propiedad en ${property.location}`;
    document.title = newTitle;

    // Ensure / create meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    const previousDesc = metaDesc.content;
    const generatedDesc = (property.description && property.description.trim().length > 0
      ? property.description
      : `${property.title} en ${property.location}. ${typeof property.price === 'number' ? 'Precio: ' + formatPrice(property.price) : ''}`)
      .slice(0, 155);
    metaDesc.content = generatedDesc;

    // Basic structured data (JSON-LD) for rich snippets
    const ldKey = 'ld-json-property-detail';
    let ldScript = document.getElementById(ldKey) as HTMLScriptElement | null;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Residence',
      name: property.title,
      description: generatedDesc,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.location,
        addressCountry: 'ES'
      },
      floorSize: property.area ? { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' } : undefined,
      numberOfRoomsTotal: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      image: property.images?.slice(0, 6) || [],
      offers: property.price ? {
        '@type': 'Offer',
        price: typeof property.price === 'number' ? property.price : undefined,
        priceCurrency: 'USD',
        availability: property.status === 'Vendido' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
      } : undefined
    };
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.type = 'application/ld+json';
      ldScript.id = ldKey;
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = previousTitle;
      metaDesc.content = previousDesc;
      if (ldScript) {
        ldScript.remove();
      }
    };
  }, [property]);

  // Render
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-white to-gray-100 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
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
                <div className="flex justify-center items-center py-6">
                  <div className="relative w-full">
                    <ImageWithFallback
                      src={property?.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'}
                      alt={property?.title}
                      className="w-full h-56 md:h-80 object-cover"
                      style={{ display: 'block', borderRadius: 0, margin: 0, padding: 0, objectFit: 'cover' }}
                    />
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <Badge className={property?.status === 'Vendido' ? 'bg-red-600' : 'bg-blue-600'}>{property?.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button onClick={toggleFavorite} className={`p-2 rounded-full backdrop-blur bg-white/80 shadow hover:scale-105 transition ${isFavorite ? 'text-red-600' : 'text-gray-600'}`}>
                        <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={shareLink} className="p-2 rounded-full backdrop-blur bg-white/80 shadow hover:scale-105 transition text-gray-600">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-50/90 text-blue-900 px-6 py-2 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-sm z-10">
                      {typeof property?.price === 'number' ? formatPrice(property.price) : property?.price}
                    </div>
                  </div>
                </div>

                {/* Sección descripción y características */}
                <Card className="shadow-sm">
                  <CardContent className="p-6 md:p-8 space-y-8 bg-white/90 rounded-2xl border border-gray-100 shadow">
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
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold">Ubicación</h3>
                        {(property.lat && property.lng) && (
                          <Button size="sm" variant="outline" onClick={() => {
                            const url = property.googleMapsUrl || `https://www.google.com/maps?q=${property.lat},${property.lng}`;
                            window.open(url, '_blank');
                          }}>Ver en Google Maps</Button>
                        )}
                      </div>
                      { property.lat != null && property.lng != null ? (
                        <PropertyMap lat={property.lat} lng={property.lng} title={property.title} />
                      ) : (
                        <MapPlaceholder />
                      ) }
                    </div>
                    {related.length > 0 && (
                      <div className="pt-4 border-t">
                        <h3 className="text-xl font-semibold mb-4">Propiedades Relacionadas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {related.map(r => (
                            <div
                              key={r.id}
                              className="group rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                              onClick={() => {
                                window.location.hash = `#/propiedad/${r.id}`;
                              }}
                            >
                              <div className="relative h-40 overflow-hidden">
                                <ImageWithFallback src={r.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black/60 text-white">{r.type}</span>
                                <span className="absolute bottom-2 left-2 text-sm bg-black/60 text-white px-2 py-1 rounded">{typeof r.price === 'number' ? formatPrice(r.price) : r.price}</span>
                              </div>
                              <div className="p-4 space-y-1">
                                <p className="font-medium line-clamp-1">{r.title}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.location}</p>
                                <div className="flex text-xs text-gray-500 gap-3 pt-1">
                                  <span>{r.bedrooms} hab</span>
                                  <span>{r.bathrooms} baños</span>
                                  <span>{r.area} m²</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Contacto Rápido</h3>
                    <p className="text-xs text-gray-500 -mt-2">Solicita más información sobre esta propiedad</p>
                    <div className="space-y-3">
                      <input
                        name="name"
                        value={contactData.name}
                        onChange={handleContactChange}
                        placeholder="Nombre"
                        className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        name="email"
                        value={contactData.email}
                        onChange={handleContactChange}
                        placeholder="Email"
                        type="email"
                        className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        name="message"
                        value={contactData.message}
                        onChange={handleContactChange}
                        placeholder="Mensaje"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <Button disabled={contactSubmitting} onClick={submitInquiry} className="w-full">
                        {contactSubmitting ? 'Enviando...' : 'Enviar Consulta'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PropertyDetailPage(props: PropertyDetailPageProps) {
  return (
    <DetailErrorBoundary>
      <PropertyDetailPageInner {...props} />
    </DetailErrorBoundary>
  );
}
