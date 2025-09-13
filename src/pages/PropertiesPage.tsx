import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { MapPin, Bed, Bath, Square, Heart, Filter, Grid, List, Search, DollarSign, Calendar, Eye, CheckCircle, Star, Shield, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { toast } from 'sonner';
import { propertiesAPI, type Property, formatPrice, healthAPI } from '../utils/api';

// Usar el tipo Property de la API

const propertyTypes = ['casa', 'apartamento', 'chalet', 'oficina', 'local'];
const locations = ['Zona Rosa', 'Chapinero', 'La Candelaria', 'Chía', 'Cajicá', 'Chia', 'Usaquén'];

interface PropertiesPageProps {
  onSelectProperty?: (id: string) => void;
}

export function PropertiesPage({ onSelectProperty }: PropertiesPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    type: string;
    location: string;
    priceRange: [number, number];
    bedrooms: string;
    bathrooms: string;
    minArea: string;
    status: string;
    condition: string;
    amenities: string[];
    features: string[];
    security: string[];
  }>({
    search: '',
    type: 'all',
    location: 'all',
    priceRange: [0, 2000000000],
    bedrooms: 'all',
    bathrooms: 'all',
    minArea: '',
    status: 'all',
    condition: 'all',
    amenities: [],
    features: [],
    security: []
  });
  const [sortBy, setSortBy] = useState('recent');
  const { ref: pageRef, hasBeenInView } = useInView(0.1);

  // Dynamic SEO for listing page
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    let meta = prevDescEl;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    const prevDesc = meta.content;
    const count = filteredProperties.length;
    const desc = count > 0
      ? `Explora ${count} propiedades en nuestra plataforma: casas, apartamentos y más en ubicaciones destacadas.`
      : 'Explora propiedades disponibles: casas, apartamentos y más. Encuentra tu próximo hogar con nuestros filtros avanzados.';
    document.title = count > 0 ? `(${count}) Propiedades disponibles | Listado` : 'Listado de Propiedades | Búsqueda';
    meta.content = desc.slice(0, 155);

    // Structured data ItemList
    const ldId = 'ld-json-property-list';
    let script = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = ldId;
      document.head.appendChild(script);
    }
    const items = filteredProperties.slice(0, 20).map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${window.location.origin}#/propiedad/${p.id}`,
      name: p.title,
      ...(typeof p.price === 'number' ? { price: p.price } : {})
    }));
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Listado de Propiedades',
      numberOfItems: filteredProperties.length,
      itemListElement: items
    };
    script.textContent = JSON.stringify(ld);

    return () => {
      document.title = prevTitle;
      if (meta) meta.content = prevDesc;
      if (script) script.remove();
    };
  }, [filteredProperties]);



  useEffect(() => {
    checkBackendHealth();
    loadInitialProperties();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await healthAPI.check();
      if (health.status === 'OK') {
        console.log('✅ Backend conectado correctamente');
      } else {
        console.warn('⚠️ Backend responde pero con problemas:', health);
      }
    } catch (error) {
      console.warn('❌ Backend no disponible, usando datos de ejemplo');
    }
  };

  const loadInitialProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getAll({ limit: 50 });
      if (response.properties && response.properties.length > 0) {
        // Normalizar propiedades (especialmente el precio) antes de guardar en estado
        const normalized = response.properties.map((p: any) => {
          // Intentar convertir price a número si viene como string formateada
            let numericPrice: number = p.price;
            if (typeof p.price === 'string') {
              const digits = p.price.replace(/[^0-9]/g, '');
              if (digits.length > 0) {
                numericPrice = parseInt(digits, 10);
              }
            }
            return {
              ...p,
              price: numericPrice,
              bedrooms: p.bedrooms ?? 0,
              bathrooms: p.bathrooms ?? 0,
              area: p.area ?? 0,
              views: p.views ?? 0,
              createdAt: p.createdAt || new Date().toISOString(),
            };
        });
        console.log('✅ Propiedades normalizadas:', normalized.map((p: any) => ({ id: p.id, price: p.price, rawPrice: response.properties.find((r: any) => r.id === p.id)?.price })));
        setProperties(normalized);
        setFilteredProperties(normalized);
        toast.success(`${normalized.length} propiedades encontradas`);
      } else {
        setProperties([]);
        setFilteredProperties([]);
        toast.info('No hay propiedades registradas en la base de datos');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      setFilteredProperties([]);
      toast.warning('No se pudo conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort properties
  useEffect(() => {
    let filtered = [...properties];

    console.groupCollapsed('%c[DEBUG] Filtro de propiedades', 'color: #2563eb');
    console.log('Total inicial:', filtered.length);
    console.log('Rango de precio activo:', filters.priceRange);

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    if (filters.bedrooms && filters.bedrooms !== 'all') {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }
    if (filters.bathrooms && filters.bathrooms !== 'all') {
      filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    }
    if (filters.minArea && filters.minArea !== '') {
      filtered = filtered.filter(p => p.area >= parseInt(String(filters.minArea)));
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.condition && filters.condition !== 'all') {
      filtered = filtered.filter(p => p.condition === filters.condition);
    }
    
    // Filter by amenities, features, and security (for now, these are not in the sample data)
    // This will be useful when real data includes these fields

    // Price range filter (ignora precios NaN para no eliminar propiedades)
    filtered = filtered.filter(p => {
      let priceNum = typeof p.price === 'string' ? parseInt(p.price) : p.price;
      if (Number.isNaN(priceNum)) return true; // no filtrar si no se puede determinar
      return priceNum >= filters.priceRange[0] && priceNum <= filters.priceRange[1];
    });

    console.log('Después de filtros (sin sort):', filtered.length);

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseInt(a.price) : a.price;
          const priceB = typeof b.price === 'string' ? parseInt(b.price) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseInt(a.price) : a.price;
          const priceB = typeof b.price === 'string' ? parseInt(b.price) : b.price;
          return priceB - priceA;
        });
        break;
      case 'area-desc':
        filtered.sort((a, b) => b.area - a.area);
        break;
      case 'views-desc':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(b.createdAt || 0).getTime();
          const dateB = new Date(a.createdAt || 0).getTime();
          return dateA - dateB;
        });
    }

    // Si no queda ninguna y había propiedades originales, intentar autoajustar rango
    if (filtered.length === 0 && properties.length > 0) {
      const numericPrices = properties
        .map(p => (typeof p.price === 'string' ? parseInt(p.price) : p.price))
        .filter(p => !Number.isNaN(p));
      if (numericPrices.length > 0) {
        const min = Math.min(...numericPrices);
        const max = Math.max(...numericPrices);
        console.warn('[DEBUG] No coincidencias; autoajustando rango de precio a', { min, max });
        setFilters(prev => ({ ...prev, priceRange: [Math.max(0, min - 1), max + 1] }));
      }
    }

    setFilteredProperties(filtered);
    console.log('Final (post-sort):', filtered.length);
    console.groupEnd();
  }, [properties, filters, sortBy]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      location: 'all',
      priceRange: [100000000, 1000000000],
      bedrooms: 'all',
      bathrooms: 'all',
      minArea: '',
      status: 'all',
      condition: 'all',
      amenities: [],
      features: [],
      security: []
    });
  };

  const formatPriceLegacy = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
  <div ref={pageRef as React.RefObject<HTMLDivElement>} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzQ3MDA4OXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Propiedades premium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center text-white transition-all duration-1000 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
              Nuestras <span className="text-yellow-400 relative">
                Propiedades
                <span className="absolute inset-0 bg-yellow-400/20 blur-xl"></span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Descubre nuestra exclusiva selección de propiedades premium en las mejores ubicaciones de Madrid
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className={`mb-8 transition-all duration-1000 delay-300 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por título o ubicación..."
                    className="pl-10 h-12"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                  <SelectItem value="area-desc">Mayor superficie</SelectItem>
                  <SelectItem value="views-desc">Más visitadas</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 h-12"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="h-12 w-12"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-6 animate-fadeInUp">
                <div className="space-y-6">
                  {/* Filtros principales */}
                  <div className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 rounded-2xl p-6 shadow-lg border border-gray-200/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <Filter className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Filtros Principales</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {[
                        { 
                          key: 'type', 
                          label: 'Tipo', 
                          placeholder: 'Seleccionar tipo',
                          options: propertyTypes,
                          icon: '🏠'
                        },
                        { 
                          key: 'location', 
                          label: 'Ubicación', 
                          placeholder: 'Seleccionar ubicación',
                          options: locations,
                          icon: '📍'
                        },
                        { 
                          key: 'bedrooms', 
                          label: 'Habitaciones', 
                          placeholder: 'Cualquiera',
                          customOptions: [
                            { value: 'all', label: 'Cualquiera' },
                            { value: '1', label: '1+' },
                            { value: '2', label: '2+' },
                            { value: '3', label: '3+' },
                            { value: '4', label: '4+' }
                          ],
                          icon: '🛏️'
                        },
                        { 
                          key: 'bathrooms', 
                          label: 'Baños', 
                          placeholder: 'Cualquiera',
                          customOptions: [
                            { value: 'all', label: 'Cualquiera' },
                            { value: '1', label: '1+' },
                            { value: '2', label: '2+' },
                            { value: '3', label: '3+' }
                          ],
                          icon: '🚿'
                        },
                        { 
                          key: 'status', 
                          label: 'Estado', 
                          placeholder: 'Cualquier estado',
                          customOptions: [
                            { value: 'all', label: 'Todos' },
                            { value: 'Nuevo', label: 'Nuevo' },
                            { value: 'Disponible', label: 'Disponible' },
                            { value: 'Vendido', label: 'Vendido' }
                          ],
                          icon: '✅'
                        },
                        { 
                          key: 'condition', 
                          label: 'Condición', 
                          placeholder: 'Cualquier condición',
                          customOptions: [
                            { value: 'all', label: 'Todas' },
                            { value: 'Nuevo', label: 'Nuevo' },
                            { value: 'Como nuevo', label: 'Como nuevo' },
                            { value: 'Buen estado', label: 'Buen estado' },
                            { value: 'A reformar', label: 'A reformar' },
                            { value: 'En construcción', label: 'En construcción' }
                          ],
                          icon: '🔧'
                        }
                      ].map((filter) => (
                        <div key={filter.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <span className="mr-1">{filter.icon}</span>
                            {filter.label}
                          </label>
                          <Select 
                            value={filters[filter.key as keyof typeof filters] as string} 
                            onValueChange={(value: string) => handleFilterChange(filter.key as keyof typeof filters, value)}
                          >
                            <SelectTrigger className="h-10 text-sm bg-white/70 border border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 rounded-lg">
                              <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg">
                              {filter.customOptions ? 
                                filter.customOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                )) :
                                <>
                                  <SelectItem value="all">Todos</SelectItem>
                                  {filter.options?.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </>
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    {/* Slider de precio */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200/50">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                          Rango de Precio
                        </label>
                        <div className="px-3 py-1 bg-white rounded-lg shadow-sm border text-sm font-semibold text-blue-600">
                          COP ${formatPrice(filters.priceRange[0])} - COP ${formatPrice(filters.priceRange[1])}
                        </div>
                      </div>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value: [number, number]) => handleFilterChange('priceRange', value)}
                        max={1000000000}
                        min={50000000}
                        step={10000000}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">COP $50M</span>
                        <span className="text-xs text-gray-500">COP $1,000M</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenidades */}
                  <div className="bg-gradient-to-br from-emerald-50 via-blue-50/30 to-cyan-50/40 rounded-2xl p-6 shadow-lg border border-emerald-200/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Amenidades</h3>
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
                      {[
                        { id: 'pool', label: 'Piscina', icon: '🏊‍♂️', color: 'from-blue-500 to-cyan-500' },
                        { id: 'garden', label: 'Jardín', icon: '🌳', color: 'from-green-500 to-emerald-500' },
                        { id: 'terrace', label: 'Terraza', icon: '🌅', color: 'from-orange-500 to-yellow-500' },
                        { id: 'parking', label: 'Parking', icon: '🚗', color: 'from-gray-500 to-slate-600' },
                        { id: 'elevator', label: 'Ascensor', icon: '🏢', color: 'from-indigo-500 to-purple-500' },
                        { id: 'air_conditioning', label: 'A/C', icon: '❄️', color: 'from-cyan-500 to-blue-500' },
                        { id: 'heating', label: 'Calefacción', icon: '🔥', color: 'from-red-500 to-orange-500' },
                        { id: 'security', label: 'Seguridad', icon: '🛡️', color: 'from-red-600 to-pink-600' },
                        { id: 'storage', label: 'Trastero', icon: '📦', color: 'from-amber-500 to-yellow-600' },
                        { id: 'wifi', label: 'WiFi', icon: '📶', color: 'from-purple-500 to-indigo-500' }
                      ].map((amenity) => (
                        <div
                          key={amenity.id}
                          className={`rounded-lg p-3 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                            filters.amenities.includes(amenity.id)
                              ? `bg-gradient-to-r ${amenity.color} text-white shadow-lg`
                              : 'bg-white/80 text-gray-700 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleFilterChange('amenities', 
                            filters.amenities.includes(amenity.id)
                              ? filters.amenities.filter(a => a !== amenity.id)
                              : [...filters.amenities, amenity.id]
                          )}
                        >
                          <div className="text-center">
                            <div className="text-lg mb-1">{amenity.icon}</div>
                            <div className="text-xs font-medium">{amenity.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Características Especiales */}
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50/30 to-rose-50/40 rounded-2xl p-6 shadow-lg border border-purple-200/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Características Especiales</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                        { id: 'balcony', label: 'Balcón', icon: '🏠', color: 'from-indigo-500 to-blue-500' },
                        { id: 'fireplace', label: 'Chimenea', icon: '🔥', color: 'from-red-500 to-orange-500' },
                        { id: 'walk_in_closet', label: 'Vestidor', icon: '👔', color: 'from-purple-500 to-pink-500' },
                        { id: 'laundry', label: 'Lavadero', icon: '🧺', color: 'from-cyan-500 to-teal-500' },
                        { id: 'gym', label: 'Gimnasio', icon: '💪', color: 'from-green-500 to-emerald-500' },
                        { id: 'master_suite', label: 'Suite Principal', icon: '🛏️', color: 'from-amber-500 to-yellow-500' }
                      ].map((feature) => (
                        <div
                          key={feature.id}
                          className={`rounded-lg p-3 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                            filters.features.includes(feature.id)
                              ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                              : 'bg-white/80 text-gray-700 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleFilterChange('features', 
                            filters.features.includes(feature.id)
                              ? filters.features.filter(f => f !== feature.id)
                              : [...filters.features, feature.id]
                          )}
                        >
                          <div className="text-center">
                            <div className="text-lg mb-1">{feature.icon}</div>
                            <div className="text-xs font-medium">{feature.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seguridad */}
                  <div className="bg-gradient-to-br from-orange-50 via-red-50/30 to-pink-50/40 rounded-2xl p-6 shadow-lg border border-orange-200/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {[
                        { id: 'alarm', label: 'Alarma', icon: '🚨', color: 'from-red-500 to-pink-500' },
                        { id: 'cameras', label: 'Cámaras', icon: '📹', color: 'from-blue-500 to-indigo-500' },
                        { id: 'doorman', label: 'Portero', icon: '🚪', color: 'from-green-500 to-teal-500' },
                        { id: 'concierge', label: 'Conserjería', icon: '🎩', color: 'from-purple-500 to-violet-500' },
                        { id: 'gated', label: 'Conjunto Cerrado', icon: '🏘️', color: 'from-amber-500 to-orange-500' }
                      ].map((security) => (
                        <div
                          key={security.id}
                          className={`rounded-lg p-3 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                            filters.security.includes(security.id)
                              ? `bg-gradient-to-r ${security.color} text-white shadow-lg`
                              : 'bg-white/80 text-gray-700 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleFilterChange('security', 
                            filters.security.includes(security.id)
                              ? filters.security.filter(s => s !== security.id)
                              : [...filters.security, security.id]
                          )}
                        >
                          <div className="text-center">
                            <div className="text-lg mb-1">{security.icon}</div>
                            <div className="text-xs font-medium">{security.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Superficie y acciones */}
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          Superficie Mínima (m²)
                        </label>
                        <Input
                          type="number"
                          placeholder="Ej: 80"
                          value={filters.minArea}
                          onChange={(e) => handleFilterChange('minArea', e.target.value)}
                          className="h-10 bg-white border border-gray-300 hover:border-gray-400 focus:border-gray-500 transition-all duration-200 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={clearFilters} 
                          variant="outline" 
                          className="h-10 px-6 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 transition-all duration-200 rounded-lg"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Limpiar Filtros
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Results Count */}
        <div className={`mb-6 transition-all duration-1000 delay-500 ${
          hasBeenInView ? 'animate-in slide-in-from-left-4 fade-in' : 'opacity-0 translate-x-4'
        }`}>
          <p className="text-gray-600">
            {loading ? 'Cargando...' : `${filteredProperties.length} propiedades encontradas`}
          </p>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`transition-all duration-1000 delay-700 ${
            hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
          }`}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <Card 
                    key={property.id} 
                    className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
                        alt={property.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      


                      <Badge 
                        className={`absolute top-4 right-4 ${
                          property.status === 'Vendido' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                      >
                        {property.status}
                      </Badge>

                      <button className="absolute bottom-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors group">
                        <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                      </button>

                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {typeof property.price === 'number' ? formatPrice(property.price) : formatPriceLegacy(property.price)}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">{property.title}</h3>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                      <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms} hab.</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms} baños</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.area} m²</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(property.createdAt || new Date()).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{property.views} vistas</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                        onClick={() => onSelectProperty?.(property.id)}
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProperties.map((property, index) => (
                  <Card 
                    key={property.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      <div className="relative">
                        <ImageWithFallback
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
                          alt={property.title}
                          className="w-full h-48 md:h-full object-cover rounded-lg"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            property.status === 'Vendido' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl mb-2">{property.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{property.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl text-primary flex items-center">
                              <DollarSign className="h-5 w-5 mr-1" />
                              {typeof property.price === 'number' ? formatPrice(property.price) : formatPriceLegacy(property.price)}
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                              <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600">{property.description}</p>

                        <div className="flex gap-6 text-sm text-gray-600">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              <span>{property.bedrooms} habitaciones</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms} baños</span>
                          </div>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            <span>{property.area} m²</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(property.createdAt || new Date()).toLocaleDateString('es-ES')}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{property.views} vistas</span>
                            </div>
                          </div>
                          <Button onClick={() => onSelectProperty?.(property.id)}>Ver Detalles</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🏠</div>
                <h3 className="text-2xl mb-4">No se encontraron propiedades</h3>
                <p className="text-gray-600 mb-6">Intenta ajustar los filtros de búsqueda</p>
                <Button onClick={clearFilters}>Limpiar filtros</Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}