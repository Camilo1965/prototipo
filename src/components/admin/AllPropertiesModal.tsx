// CLEAN RESTORED STABLE VERSION
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Search, Filter, Grid, List, MapPin, Bed, Bath, Square, Euro, Eye, Trash2, Star, Home, Building, MoreHorizontal, SortAsc, SortDesc, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  price: string; // numeric string
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // m2
  image: string;
  description: string;
  status: string; // Activa, Vendida, Pendiente, Inactiva
  featured: boolean;
  dateAdded: string; // ISO date
  views: number;
  agent: string;
  amenities: string[];
  condition: string;
  energyRating: string;
}

interface AllPropertiesModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

// Sample local dataset (kept for admin preview until wired to API endpoint)
const allProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Moderno en Salamanca',
    price: '350000',
    location: 'Salamanca',
    type: 'apartamento',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300',
    description: 'Luminoso y completamente reformado',
    status: 'Activa',
    featured: true,
    dateAdded: '2024-01-05',
    views: 512,
    agent: 'Ana García',
    amenities: ['elevator', 'air_conditioning', 'heating'],
    condition: 'Como nuevo',
    energyRating: 'B'
  },
  {
    id: '2',
    title: 'Chalet con Jardín en Las Rozas',
    price: '750000',
    location: 'Las Rozas',
    type: 'chalet',
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300',
    description: 'Gran parcela y piscina privada',
    status: 'Activa',
    featured: false,
    dateAdded: '2024-01-04',
    views: 298,
    agent: 'Carlos Ruiz',
    amenities: ['pool', 'garden', 'parking', 'storage'],
    condition: 'Buen estado',
    energyRating: 'C'
  },
  {
    id: '3',
    title: 'Oficina Centro de Madrid',
    price: '420000',
    location: 'Madrid Centro',
    type: 'oficina',
    bedrooms: 0,
    bathrooms: 1,
    area: 140,
    image: 'https://images.unsplash.com/photo-1600585154206-0c9f9bf1d559?w=300',
    description: 'Espacio diáfano con luz natural',
    status: 'Pendiente',
    featured: false,
    dateAdded: '2024-01-03',
    views: 120,
    agent: 'María López',
    amenities: ['air_conditioning', 'heating', 'wifi'],
    condition: 'Nuevo',
    energyRating: 'A'
  },
  {
    id: '4',
    title: 'Ático con Terraza Retiro',
    price: '620000',
    location: 'Retiro',
    type: 'ático',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=300',
    description: 'Exclusivo ático con terraza panorámica',
    status: 'Pendiente',
    featured: true,
    dateAdded: '2024-01-02',
    views: 425,
    agent: 'Ana García',
    amenities: ['terrace', 'elevator', 'heating', 'air_conditioning'],
    condition: 'Nuevo',
    energyRating: 'A'
  },
  {
    id: '5',
    title: 'Casa Familiar Pozuelo',
    price: '550000',
    location: 'Pozuelo',
    type: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300',
    description: 'Perfecta para familias',
    status: 'Activa',
    featured: false,
    dateAdded: '2024-01-01',
    views: 198,
    agent: 'Carlos Ruiz',
    amenities: ['garden', 'parking', 'storage'],
    condition: 'Buen estado',
    energyRating: 'C'
  }
];

const propertyTypes = ['todos', 'casa', 'apartamento', 'chalet', 'ático', 'oficina'];
const locations = ['Todas', 'Madrid Centro', 'Salamanca', 'Chamberí', 'Retiro', 'Las Rozas', 'Pozuelo'];
const statusOptions = ['Todos', 'Activa', 'Vendida', 'Pendiente', 'Inactiva'];
const agents = ['Todos', 'Ana García', 'Carlos Ruiz', 'María López'];

export function AllPropertiesModal({ isOpen, onClose }: AllPropertiesModalProps) {
  const [properties] = useState<Property[]>(allProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [filters, setFilters] = useState({
    type: 'todos',
    location: 'Todas',
    status: 'Todos',
    agent: 'Todos',
    priceRange: [0, 1000000],
    areaRange: [0, 500],
    bedrooms: '',
    bathrooms: '',
    featured: false,
    amenities: [] as string[],
    condition: 'Todas',
    energyRating: 'Todas'
  });

  useEffect(() => {
    let filtered = [...properties];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (filters.type !== 'todos') filtered = filtered.filter(p => p.type === filters.type);
    if (filters.location !== 'Todas') filtered = filtered.filter(p => p.location === filters.location);
    if (filters.status !== 'Todos') filtered = filtered.filter(p => p.status === filters.status);
    if (filters.agent !== 'Todos') filtered = filtered.filter(p => p.agent === filters.agent);
    filtered = filtered.filter(p => {
      const price = parseInt(p.price, 10);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    filtered = filtered.filter(p => p.area >= filters.areaRange[0] && p.area <= filters.areaRange[1]);
    if (filters.bedrooms) filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    if (filters.bathrooms) filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    if (filters.featured) filtered = filtered.filter(p => p.featured);
    if (filters.amenities.length) filtered = filtered.filter(p => filters.amenities.every(a => p.amenities.includes(a)));
    if (filters.condition !== 'Todas') filtered = filtered.filter(p => p.condition === filters.condition);
    if (filters.energyRating !== 'Todas') filtered = filtered.filter(p => p.energyRating === filters.energyRating);

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'price': cmp = parseInt(a.price) - parseInt(b.price); break;
        case 'area': cmp = a.area - b.area; break;
        case 'views': cmp = a.views - b.views; break;
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'recent': default:
          cmp = new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters, sortBy, sortOrder]);

  const formatPrice = (price: string) => new Intl.NumberFormat('es-ES').format(parseInt(price));
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activa': return 'bg-green-500';
      case 'vendida': return 'bg-blue-500';
      case 'pendiente': return 'bg-yellow-500';
      case 'inactiva': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  const handleFilterChange = (key: string, value: any) => setFilters(f => ({ ...f, [key]: value }));
  const clearFilters = () => {
    setFilters({
      type: 'todos', location: 'Todas', status: 'Todos', agent: 'Todos', priceRange: [0, 1000000], areaRange: [0, 500], bedrooms: '', bathrooms: '', featured: false, amenities: [], condition: 'Todas', energyRating: 'Todas'
    });
    setSearchTerm('');
  };
  const handleAmenityToggle = (amenity: string) => setFilters(f => ({
    ...f,
    amenities: f.amenities.includes(amenity) ? f.amenities.filter(a => a !== amenity) : [...f.amenities, amenity]
  }));

  const availableAmenities = [
    { id: 'parking', label: 'Parking' },
    { id: 'terrace', label: 'Terraza' },
    { id: 'garden', label: 'Jardín' },
    { id: 'pool', label: 'Piscina' },
    { id: 'elevator', label: 'Ascensor' },
    { id: 'air_conditioning', label: 'Aire Acondicionado' },
    { id: 'heating', label: 'Calefacción' },
    { id: 'security', label: 'Seguridad' },
    { id: 'storage', label: 'Trastero' },
    { id: 'wifi', label: 'WiFi' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Building className="h-6 w-6 mr-2 text-primary" />
            Todas las Propiedades
            <Badge className="ml-3" variant="secondary">{filteredProperties.length} de {properties.length}</Badge>
          </DialogTitle>
          <DialogDescription>Gestiona y filtra todas las propiedades del inventario</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="space-y-4 border-b pb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Select value={filters.type} onValueChange={(v: string) => handleFilterChange('type', v)}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(t => <SelectItem key={t} value={t}>{t === 'todos' ? 'Todos' : t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(v: string) => handleFilterChange('status', v)}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Estado" /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowAdvancedFilters(s => !s)} className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />Filtros{showAdvancedFilters && <X className="h-4 w-4 ml-2" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="flex border rounded-lg">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-r-none"><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-l-none"><List className="h-4 w-4" /></Button>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="price">Precio</SelectItem>
                    <SelectItem value="area">Superficie</SelectItem>
                    <SelectItem value="views">Más vistas</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {showAdvancedFilters && (
              <Card className="animate-in slide-in-from-top-2 fade-in">
                <CardContent className="p-4">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="basic">Básicos</TabsTrigger>
                      <TabsTrigger value="features">Características</TabsTrigger>
                      <TabsTrigger value="advanced">Avanzados</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Ubicación</label>
                          <Select value={filters.location} onValueChange={(v: string) => handleFilterChange('location', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Agente</label>
                          <Select value={filters.agent} onValueChange={(v: string) => handleFilterChange('agent', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{agents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Habitaciones mín.</label>
                          <Select value={filters.bedrooms} onValueChange={(v: string) => handleFilterChange('bedrooms', v)}>
                            <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Cualquiera</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Baños mín.</label>
                          <Select value={filters.bathrooms} onValueChange={(v: string) => handleFilterChange('bathrooms', v)}>
                            <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Cualquiera</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm mb-2 block">Rango de precio: €{formatPrice(filters.priceRange[0].toString())} - €{formatPrice(filters.priceRange[1].toString())}</label>
                          <Slider value={filters.priceRange} onValueChange={(v: number[]) => handleFilterChange('priceRange', v)} max={1000000} min={50000} step={10000} />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Superficie: {filters.areaRange[0]}m² - {filters.areaRange[1]}m²</label>
                          <Slider value={filters.areaRange} onValueChange={(v: number[]) => handleFilterChange('areaRange', v)} max={500} min={30} step={10} />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="features" className="space-y-4">
                      <div>
                        <label className="text-sm mb-3 block">Comodidades</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {availableAmenities.map(a => (
                            <div key={a.id} className="flex items-center space-x-2">
                              <Checkbox checked={filters.amenities.includes(a.id)} onCheckedChange={() => handleAmenityToggle(a.id)} />
                              <label className="text-sm">{a.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={filters.featured} onCheckedChange={(c: boolean) => handleFilterChange('featured', c)} />
                        <label className="text-sm">Solo destacadas</label>
                      </div>
                    </TabsContent>
                    <TabsContent value="advanced" className="space-y-4">
                      <p className="text-sm text-gray-600">Más filtros avanzados próximamente…</p>
                    </TabsContent>
                  </Tabs>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={clearFilters}><X className="h-4 w-4 mr-2" />Limpiar filtros</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Home className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg mb-2">No se encontraron propiedades</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar los filtros.</p>
                <Button onClick={clearFilters}>Limpiar filtros</Button>
              </div>
            ) : (
              <div className={`p-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                {filteredProperties.map(property => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    {viewMode === 'grid' ? (
                      <div>
                        <div className="relative">
                          <ImageWithFallback src={property.image} alt={property.title} className="w-full h-48 object-cover rounded-t-lg" />
                          {property.featured && (
                            <Badge className="absolute top-2 left-2 bg-yellow-500"><Star className="h-3 w-3 mr-1" />Destacada</Badge>
                          )}
                          <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)}`}>{property.status}</Badge>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">€{formatPrice(property.price)}</div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2 line-clamp-1">{property.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2 text-sm"><MapPin className="h-3 w-3 mr-1" /><span>{property.location}</span></div>
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                            {property.bedrooms > 0 && <div className="flex items-center"><Bed className="h-3 w-3 mr-1" /><span>{property.bedrooms}</span></div>}
                            <div className="flex items-center"><Bath className="h-3 w-3 mr-1" /><span>{property.bathrooms}</span></div>
                            <div className="flex items-center"><Square className="h-3 w-3 mr-1" /><span>{property.area}m²</span></div>
                            <div className="flex items-center"><Eye className="h-3 w-3 mr-1" /><span>{property.views}</span></div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                            <span>Agente: {property.agent}</span>
                            <span>{new Date(property.dateAdded).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.info('Vista previa (pendiente)')}><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.warning('Eliminar (pendiente)')}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast('Más acciones próximamente')}><MoreHorizontal className="h-3 w-3" /></Button>
                          </div>
                        </CardContent>
                      </div>
                    ) : (
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <div className="relative flex-shrink-0">
                            <ImageWithFallback src={property.image} alt={property.title} className="w-24 h-24 object-cover rounded" />
                            {property.featured && <Badge className="absolute -top-1 -right-1 bg-yellow-500 h-5 w-5 rounded-full p-0 flex items-center justify-center"><Star className="h-2 w-2" /></Badge>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium line-clamp-1">{property.title}</h3>
                              <div className="flex items-center ml-4"><Euro className="h-4 w-4 mr-1 text-primary" /><span className="font-medium text-primary">{formatPrice(property.price)}</span></div>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2 text-sm"><MapPin className="h-3 w-3 mr-1" /><span>{property.location}</span><Badge className={`ml-2 ${getStatusColor(property.status)} text-xs`}>{property.status}</Badge></div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{property.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-4 text-sm text-gray-600">
                                {property.bedrooms > 0 && <div className="flex items-center"><Bed className="h-3 w-3 mr-1" /><span>{property.bedrooms} hab.</span></div>}
                                <div className="flex items-center"><Bath className="h-3 w-3 mr-1" /><span>{property.bathrooms} baños</span></div>
                                <div className="flex items-center"><Square className="h-3 w-3 mr-1" /><span>{property.area}m²</span></div>
                                <div className="flex items-center"><Eye className="h-3 w-3 mr-1" /><span>{property.views}</span></div>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.info('Vista previa (pendiente)')}><Eye className="h-3 w-3" /></Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.warning('Eliminar (pendiente)')}><Trash2 className="h-3 w-3" /></Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast('Más acciones próximamente')}><MoreHorizontal className="h-3 w-3" /></Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500 mt-2"><span>Agente: {property.agent}</span><span>{new Date(property.dateAdded).toLocaleDateString('es-ES')}</span></div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}