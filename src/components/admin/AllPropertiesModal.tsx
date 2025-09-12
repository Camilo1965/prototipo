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
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Euro,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Star,
  Home,
  Building,
  TrendingUp,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  X,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  status: string;
  featured: boolean;
  dateAdded: string;
  views: number;
  agent: string;
  amenities: string[];
  condition: string;
  energyRating: string;
}

interface AllPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data expandido
const allProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna en Centro',
    price: '350000',
    location: 'Madrid Centro',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300',
    description: 'Hermosa casa moderna completamente renovada',
    status: 'Activa',
    featured: true,
    dateAdded: '2024-01-15',
    views: 245,
    agent: 'Ana García',
    amenities: ['parking', 'terrace', 'heating'],
    condition: 'Como nuevo',
    energyRating: 'B'
  },
  {
    id: '2',
    title: 'Apartamento Lujoso Salamanca',
    price: '480000',
    location: 'Salamanca',
    type: 'apartamento',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300',
    description: 'Elegante apartamento en zona exclusiva',
    status: 'Vendida',
    featured: true,
    dateAdded: '2024-01-10',
    views: 189,
    agent: 'Carlos Ruiz',
    amenities: ['elevator', 'air_conditioning', 'security'],
    condition: 'Nuevo',
    energyRating: 'A'
  },
  {
    id: '3',
    title: 'Villa con Jardín Las Rozas',
    price: '720000',
    location: 'Las Rozas',
    type: 'chalet',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=300',
    description: 'Impresionante villa con jardín privado',
    status: 'Activa',
    featured: false,
    dateAdded: '2024-01-08',
    views: 312,
    agent: 'María López',
    amenities: ['garden', 'pool', 'parking', 'security'],
    condition: 'Buen estado',
    energyRating: 'C'
  },
  {
    id: '4',
    title: 'Oficina Moderna Chamberí',
    price: '280000',
    location: 'Chamberí',
    type: 'oficina',
    bedrooms: 0,
    bathrooms: 1,
    area: 80,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
    description: 'Oficina completamente equipada',
    status: 'Activa',
    featured: false,
    dateAdded: '2024-01-05',
    views: 156,
    agent: 'David Martín',
    amenities: ['elevator', 'air_conditioning', 'wifi'],
    condition: 'Como nuevo',
    energyRating: 'B'
  },
  {
    id: '5',
    title: 'Ático con Terraza Retiro',
    price: '890000',
    location: 'Retiro',
    type: 'ático',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=300',
    description: 'Exclusivo ático con terraza panorámica',
    status: 'Pendiente',
    featured: true,
    dateAdded: '2024-01-03',
    views: 425,
    agent: 'Ana García',
    amenities: ['terrace', 'elevator', 'heating', 'air_conditioning'],
    condition: 'Nuevo',
    energyRating: 'A'
  },
  {
    id: '6',
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

const propertyTypes = ['todos', 'casa', 'apartamento', 'chalet', 'ático', 'oficina', 'local'];
const locations = ['Todas', 'Madrid Centro', 'Salamanca', 'Chamberí', 'Retiro', 'Las Rozas', 'Pozuelo'];
const statusOptions = ['Todos', 'Activa', 'Vendida', 'Pendiente', 'Inactiva'];
const agents = ['Todos', 'Ana García', 'Carlos Ruiz', 'María López', 'David Martín'];

export function AllPropertiesModal({ isOpen, onClose }: AllPropertiesModalProps) {
  const [properties, setProperties] = useState<Property[]>(allProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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

  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'todos') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Location filter
    if (filters.location !== 'Todas') {
      filtered = filtered.filter(p => p.location === filters.location);
    }

    // Status filter
    if (filters.status !== 'Todos') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Agent filter
    if (filters.agent !== 'Todos') {
      filtered = filtered.filter(p => p.agent === filters.agent);
    }

    // Price range filter
    filtered = filtered.filter(p => {
      const price = parseInt(p.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Area range filter
    filtered = filtered.filter(p => 
      p.area >= filters.areaRange[0] && p.area <= filters.areaRange[1]
    );

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(p => p.featured);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        filters.amenities.every(amenity => p.amenities.includes(amenity))
      );
    }

    // Condition filter
    if (filters.condition !== 'Todas') {
      filtered = filtered.filter(p => p.condition === filters.condition);
    }

    // Energy rating filter
    if (filters.energyRating !== 'Todas') {
      filtered = filtered.filter(p => p.energyRating === filters.energyRating);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = parseInt(a.price) - parseInt(b.price);
          break;
        case 'area':
          comparison = a.area - b.area;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'recent':
        default:
          comparison = new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters, sortBy, sortOrder]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES').format(parseInt(price));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activa':
        return 'bg-green-500';
      case 'vendida':
        return 'bg-blue-500';
      case 'pendiente':
        return 'bg-yellow-500';
      case 'inactiva':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'todos',
      location: 'Todas',
      status: 'Todos',
      agent: 'Todos',
      priceRange: [0, 1000000],
      areaRange: [0, 500],
      bedrooms: '',
      bathrooms: '',
      featured: false,
      amenities: [],
      condition: 'Todas',
      energyRating: 'Todas'
    });
    setSearchTerm('');
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

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
            <Badge className="ml-3" variant="secondary">
              {filteredProperties.length} de {properties.length}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Gestiona y filtra todas las propiedades del inventario
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search and Controls */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título, ubicación o descripción..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2">
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'todos' ? 'Todos los tipos' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {showAdvancedFilters && <X className="h-4 w-4 ml-2" />}
                </Button>
              </div>

              {/* View and Sort Controls */}
              <div className="flex gap-2">
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="price">Precio</SelectItem>
                    <SelectItem value="area">Superficie</SelectItem>
                    <SelectItem value="views">Más vistas</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <Card className="animate-in slide-in-from-top-2 fade-in">
                <CardContent className="p-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Básicos</TabsTrigger>
                      <TabsTrigger value="features">Características</TabsTrigger>
                      <TabsTrigger value="advanced">Avanzados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Ubicación</label>
                          <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map(location => (
                                <SelectItem key={location} value={location}>{location}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm mb-2 block">Agente</label>
                          <Select value={filters.agent} onValueChange={(value) => handleFilterChange('agent', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {agents.map(agent => (
                                <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm mb-2 block">Habitaciones mín.</label>
                          <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Cualquiera" />
                            </SelectTrigger>
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
                          <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Cualquiera" />
                            </SelectTrigger>
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
                          <label className="text-sm mb-2 block">
                            Rango de precio: €{formatPrice(filters.priceRange[0].toString())} - €{formatPrice(filters.priceRange[1].toString())}
                          </label>
                          <Slider
                            value={filters.priceRange}
                            onValueChange={(value) => handleFilterChange('priceRange', value)}
                            max={1000000}
                            min={50000}
                            step={10000}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="text-sm mb-2 block">
                            Superficie: {filters.areaRange[0]}m² - {filters.areaRange[1]}m²
                          </label>
                          <Slider
                            value={filters.areaRange}
                            onValueChange={(value) => handleFilterChange('areaRange', value)}
                            max={500}
                            min={30}
                            step={10}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="space-y-4">
                      <div>
                        <label className="text-sm mb-3 block">Comodidades</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {availableAmenities.map(amenity => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={filters.amenities.includes(amenity.id)}
                                onCheckedChange={() => handleAmenityToggle(amenity.id)}
                              />
                              <label className="text-sm">{amenity.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.featured}
                          onCheckedChange={(checked) => handleFilterChange('featured', checked)}
                        />
                        <label className="text-sm">Solo propiedades destacadas</label>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Estado de conservación</label>
                          <Select value={filters.condition} onValueChange={(value) => handleFilterChange('condition', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Todas">Todas</SelectItem>
                              <SelectItem value="Nuevo">Nuevo</SelectItem>
                              <SelectItem value="Como nuevo">Como nuevo</SelectItem>
                              <SelectItem value="Buen estado">Buen estado</SelectItem>
                              <SelectItem value="A reformar">A reformar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm mb-2 block">Certificado energético</label>
                          <Select value={filters.energyRating} onValueChange={(value) => handleFilterChange('energyRating', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Todas">Todas</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="E">E</SelectItem>
                              <SelectItem value="F">F</SelectItem>
                              <SelectItem value="G">G</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Home className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg mb-2">No se encontraron propiedades</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
                <Button onClick={clearFilters}>Limpiar filtros</Button>
              </div>
            ) : (
              <div className={`p-4 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    {viewMode === 'grid' ? (
                      <div>
                        <div className="relative">
                          <ImageWithFallback
                            src={property.image}
                            alt={property.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          
                          {property.featured && (
                            <Badge className="absolute top-2 left-2 bg-yellow-500">
                              <Star className="h-3 w-3 mr-1" />
                              Destacada
                            </Badge>
                          )}

                          <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)}`}>
                            {property.status}
                          </Badge>

                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            €{formatPrice(property.price)}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2 line-clamp-1">{property.title}</h3>
                          
                          <div className="flex items-center text-gray-600 mb-2 text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{property.location}</span>
                          </div>

                          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                            {property.bedrooms > 0 && (
                              <div className="flex items-center">
                                <Bed className="h-3 w-3 mr-1" />
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Bath className="h-3 w-3 mr-1" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center">
                              <Square className="h-3 w-3 mr-1" />
                              <span>{property.area}m²</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{property.views}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                            <span>Agente: {property.agent}</span>
                            <span>{new Date(property.dateAdded).toLocaleDateString('es-ES')}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    ) : (
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <div className="relative flex-shrink-0">
                            <ImageWithFallback
                              src={property.image}
                              alt={property.title}
                              className="w-24 h-24 object-cover rounded"
                            />
                            
                            {property.featured && (
                              <Badge className="absolute -top-1 -right-1 bg-yellow-500 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                <Star className="h-2 w-2" />
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium line-clamp-1">{property.title}</h3>
                              <div className="flex items-center ml-4">
                                <Euro className="h-4 w-4 mr-1 text-primary" />
                                <span className="font-medium text-primary">{formatPrice(property.price)}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2 text-sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{property.location}</span>
                              <Badge className={`ml-2 ${getStatusColor(property.status)} text-xs`}>
                                {property.status}
                              </Badge>
                            </div>

                            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{property.description}</p>

                            <div className="flex justify-between items-center">
                              <div className="flex space-x-4 text-sm text-gray-600">
                                {property.bedrooms > 0 && (
                                  <div className="flex items-center">
                                    <Bed className="h-3 w-3 mr-1" />
                                    <span>{property.bedrooms} hab.</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Bath className="h-3 w-3 mr-1" />
                                  <span>{property.bathrooms} baños</span>
                                </div>
                                <div className="flex items-center">
                                  <Square className="h-3 w-3 mr-1" />
                                  <span>{property.area}m²</span>
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  <span>{property.views}</span>
                                </div>
                              </div>

                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                              <span>Agente: {property.agent}</span>
                              <span>{new Date(property.dateAdded).toLocaleDateString('es-ES')}</span>
                            </div>
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