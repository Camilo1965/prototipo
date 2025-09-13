// CLEAN RESTORED STABLE VERSION
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { NewPropertyModal } from './NewPropertyModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Search, Filter, Grid, List, MapPin, Bed, Bath, Square, Eye, Trash2, Star, Home, MoreHorizontal, SortAsc, SortDesc, X, Plus } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import { propertiesAPI } from '../../utils/api';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>(allProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Estado para el diálogo de confirmación de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Función para manejar la eliminación de propiedades
  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    setIsDeleting(true);
    try {
      // Llamar a la API para eliminar la propiedad
      await propertiesAPI.delete(propertyToDelete.id);
      
      // Actualizar el estado local eliminando la propiedad
      const updatedProperties = properties.filter(p => p.id !== propertyToDelete.id);
      setProperties(updatedProperties);
      setFilteredProperties(filteredProperties.filter(p => p.id !== propertyToDelete.id));
      
      toast.success('Propiedad eliminada exitosamente', {
        description: `La propiedad "${propertyToDelete.title}" ha sido eliminada.`
      });
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      toast.error('Error al eliminar la propiedad', {
        description: 'No se pudo eliminar la propiedad. Por favor, inténtelo de nuevo.'
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };
  
  // Función para abrir el diálogo de confirmación de eliminación
  const confirmDelete = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

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
    
    // Ordenar resultados
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else if (sortBy === 'price') {
        return parseInt(a.price, 10) - parseInt(b.price, 10);
      } else if (sortBy === 'views') {
        return b.views - a.views;
      }
      return 0;
    });

    if (sortOrder === 'desc') {
      filtered.reverse();
    }

    setFilteredProperties(filtered);
  }, [searchTerm, filters, properties, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activa': return 'bg-green-500';
      case 'vendida': return 'bg-blue-500';
      case 'pendiente': return 'bg-yellow-500';
      case 'inactiva': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'decimal',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(parseInt(price, 10));
  };

  // Función de formato de fecha, útil para posibles usos futuros
  /* const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }; */

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Todas las Propiedades</DialogTitle>
              <DialogDescription>Gestiona, edita y actualiza todas tus propiedades</DialogDescription>
            </div>
                        <div className="flex items-center space-x-2">
              <Button onClick={() => toast('Nueva propiedad', { description: 'En desarrollo' })}>
                <Plus className="mr-1 h-4 w-4" /> Nueva Propiedad
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex space-x-2 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Buscar propiedades..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedFilters(prev => !prev)}
              >
                <Filter className="mr-1 h-4 w-4" /> {showAdvancedFilters ? 'Ocultar filtros' : 'Filtros'}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex space-x-1 border rounded-md p-1">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <div className="hidden sm:flex space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <span>Ordenar por</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Fecha</SelectItem>
                    <SelectItem value="price">Precio</SelectItem>
                    <SelectItem value="views">Visitas</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  title={sortOrder === 'asc' ? 'Descendente' : 'Ascendente'}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {showAdvancedFilters && (
              <Card className="w-64 m-4 shrink-0 overflow-y-auto">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Filtros avanzados</h3>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="basic">Básicos</TabsTrigger>
                      <TabsTrigger value="advanced">Avanzados</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm">Tipo de propiedad</label>
                        <Select 
                          value={filters.type} 
                          onValueChange={(val: string) => setFilters({...filters, type: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos los tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map(type => (
                              <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Ubicación</label>
                        <Select 
                          value={filters.location} 
                          onValueChange={(val: string) => setFilters({...filters, location: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas las ubicaciones" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map(location => (
                              <SelectItem key={location} value={location}>{location}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Estado</label>
                        <Select 
                          value={filters.status} 
                          onValueChange={(val: string) => setFilters({...filters, status: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos los estados" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Agente</label>
                        <Select 
                          value={filters.agent} 
                          onValueChange={(val: string) => setFilters({...filters, agent: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos los agentes" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map(agent => (
                              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Rango de precio</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">{formatPrice(filters.priceRange[0].toString())}€</span>
                          <Slider 
                            min={0} 
                            max={1000000} 
                            step={10000} 
                            value={[filters.priceRange[0], filters.priceRange[1]]} 
                            onValueChange={(val: number[]) => setFilters({...filters, priceRange: [val[0], val[1]]})}
                          />
                          <span className="text-xs">{formatPrice(filters.priceRange[1].toString())}€</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Superficie (m²)</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">{filters.areaRange[0]} m²</span>
                          <Slider 
                            min={0} 
                            max={500} 
                            step={10} 
                            value={[filters.areaRange[0], filters.areaRange[1]]} 
                            onValueChange={(val: number[]) => setFilters({...filters, areaRange: [val[0], val[1]]})}
                          />
                          <span className="text-xs">{filters.areaRange[1]} m²</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm">Dormitorios</label>
                          <Input 
                            placeholder="Min." 
                            value={filters.bedrooms} 
                            onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                            type="number"
                            min="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm">Baños</label>
                          <Input 
                            placeholder="Min." 
                            value={filters.bathrooms} 
                            onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
                            type="number"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="featured" 
                          checked={filters.featured} 
                          onCheckedChange={(checked: boolean | 'indeterminate') => 
                            setFilters({...filters, featured: checked === true})
                          }
                        />
                        <label htmlFor="featured" className="text-sm">Solo destacadas</label>
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
                          <ImageWithFallback
                            src={property.image || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300'}
                            alt={property.title}
                            className="w-full h-48 object-cover rounded-t-xl shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                          />
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
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => confirmDelete(property)}><Trash2 className="h-3 w-3" /></Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setPropertyToEdit(property); setEditModalOpen(true); }} title="Editar propiedad completa"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm0 0v3h3" /></svg></Button>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast('Más acciones próximamente')}><MoreHorizontal className="h-3 w-3" /></Button>
                          </div>
                        </CardContent>
                      </div>
                    ) : (
                      <div className="flex p-4">
                        <div className="relative w-48 h-24 mr-4 flex-shrink-0">
                          <ImageWithFallback
                            src={property.image || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300'}
                            alt={property.title}
                            className="w-full h-full object-cover rounded shadow transition-transform duration-200 hover:scale-105"
                          />
                          {property.featured && (
                            <Badge className="absolute top-1 left-1 bg-yellow-500 scale-75"><Star className="h-3 w-3 mr-1" />Destacada</Badge>
                          )}
                          <Badge className={`absolute top-1 right-1 scale-75 ${getStatusColor(property.status)}`}>{property.status}</Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">{property.title}</h3>
                            <span className="font-semibold text-sm">€{formatPrice(property.price)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-1 text-xs"><MapPin className="h-3 w-3 mr-1" /><span>{property.location}</span></div>
                          <div className="flex space-x-4 text-xs text-gray-600 mb-2">
                            <div className="flex items-center"><Bed className="h-3 w-3 mr-1" /><span>{property.bedrooms} hab.</span></div>
                            <div className="flex items-center"><Bath className="h-3 w-3 mr-1" /><span>{property.bathrooms} baños</span></div>
                            <div className="flex items-center"><Square className="h-3 w-3 mr-1" /><span>{property.area}m²</span></div>
                            <div className="flex items-center"><Eye className="h-3 w-3 mr-1" /><span>{property.views}</span></div>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.info('Vista previa (pendiente)')}><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => confirmDelete(property)}><Trash2 className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast('Más acciones próximamente')}><MoreHorizontal className="h-3 w-3" /></Button>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-2"><span>Agente: {property.agent}</span><span>{new Date(property.dateAdded).toLocaleDateString('es-ES')}</span></div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Modal de edición */}
      {propertyToEdit && (
        <NewPropertyModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          isEditing={true}
          propertyData={propertyToEdit}
          onPropertyCreated={() => { setEditModalOpen(false); setPropertyToEdit(null); }}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              {propertyToDelete ? (
                <>
                  ¿Está seguro que desea eliminar la propiedad <strong>{propertyToDelete.title}</strong>?
                  <p className="mt-2">Esta acción no se puede deshacer y la propiedad será eliminada permanentemente de la base de datos.</p>
                </>
              ) : (
                <p>¿Está seguro que desea eliminar esta propiedad?</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { 
                e.preventDefault(); 
                handleDeleteProperty(); 
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}