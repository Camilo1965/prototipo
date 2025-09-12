import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { 
  Home, 
  MapPin, 
  Euro, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Wifi,
  Shield,
  Waves,
  Trees,
  Sun,
  AirVent,
  Zap,
  Camera,
  Building,
  Calendar,
  Star,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { propertiesAPI } from '../../utils/api';

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated?: () => void;
}

interface PropertyData {
  // Básico
  title: string;
  description: string;
  price: string;
  propertyType: string;
  operationType: string;
  
  // Ubicación
  address: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  
  // Características principales
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  usableArea: number;
  plotArea: number;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  condition: string;
  orientation: string;
  
  // Características especiales
  amenities: string[];
  features: string[];
  security: string[];
  
  // Información adicional
  energyRating: string;
  heating: string;
  cooling: string;
  parking: string;
  storage: boolean;
  terrace: boolean;
  balcony: boolean;
  garden: boolean;
  
  // Financiero
  communityFees: string;
  ibi: string;
  
  // Estado
  status: string;
  availability: string;
  featured: boolean;
}

const propertyTypes = [
  'Casa', 'Apartamento', 'Chalet', 'Ático', 'Duplex', 'Estudio', 
  'Loft', 'Villa', 'Finca', 'Local', 'Oficina', 'Nave', 'Garaje'
];

const operationTypes = ['Venta', 'Alquiler', 'Alquiler Vacacional'];

const amenities = [
  { id: 'pool', label: 'Piscina', icon: Waves },
  { id: 'garden', label: 'Jardín', icon: Trees },
  { id: 'terrace', label: 'Terraza', icon: Sun },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'storage', label: 'Trastero', icon: Building },
  { id: 'elevator', label: 'Ascensor', icon: Building },
  { id: 'air_conditioning', label: 'Aire Acondicionado', icon: AirVent },
  { id: 'heating', label: 'Calefacción', icon: Zap },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'security', label: 'Seguridad 24h', icon: Shield },
];

const features = [
  'Balcón', 'Chimenea', 'Vestidor', 'Lavadero', 'Despensa', 
  'Biblioteca', 'Gimnasio', 'Sala de juegos', 'Bodega',
  'Suite principal', 'Baño en suite', 'Walk-in closet'
];

const securityFeatures = [
  'Alarma', 'Cámaras de seguridad', 'Portero automático', 
  'Conserjería', 'Acceso con tarjeta', 'Vallado perimetral',
  'Seguridad 24h', 'Control de acceso'
];

export function NewPropertyModal({ isOpen, onClose, onPropertyCreated }: NewPropertyModalProps) {
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    operationType: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    bedrooms: 1,
    bathrooms: 1,
    totalArea: 50,
    usableArea: 0,
    plotArea: 0,
    floor: '',
    totalFloors: '',
    yearBuilt: '',
    condition: '',
    orientation: '',
    amenities: [],
    features: [],
    security: [],
    energyRating: '',
    heating: '',
    cooling: '',
    parking: '',
    storage: false,
    terrace: false,
    balcony: false,
    garden: false,
    communityFees: '',
    ibi: '',
    status: 'Activa',
    availability: 'Disponible',
    featured: false
  });

  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSecurityToggle = (security: string) => {
    setFormData(prev => ({
      ...prev,
      security: prev.security.includes(security)
        ? prev.security.filter(s => s !== security)
        : [...prev.security, security]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validar campos requeridos
    const requiredFields = {
      title: 'Título',
      price: 'Precio',
      propertyType: 'Tipo de propiedad',
      city: 'Ciudad'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof PropertyData]) {
        toast.error(`${label} es requerido`);
        setIsSubmitting(false);
        return;
      }
    }

    // Validar campos numéricos requeridos
    if (formData.bedrooms <= 0) {
      toast.error('Número de habitaciones es requerido y debe ser mayor a 0');
      setIsSubmitting(false);
      return;
    }

    if (formData.bathrooms <= 0) {
      toast.error('Número de baños es requerido y debe ser mayor a 0');
      setIsSubmitting(false);
      return;
    }

    if (formData.totalArea <= 0) {
      toast.error('Área total es requerida y debe ser mayor a 0');
      setIsSubmitting(false);
      return;
    }

    // Convertir los datos del formulario al formato de la API
    const propertyData = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      location: `${formData.city}${formData.district ? ', ' + formData.district : ''}`,
      type: formData.propertyType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.totalArea,
      images: [], // Las imágenes se pueden añadir después
      amenities: formData.amenities,
      features: formData.features,
      security: formData.security,
      status: 'Disponible',
      condition: formData.condition || 'Buen estado'
    };

    console.log('🔄 Enviando datos de propiedad:', propertyData);
    console.log('📋 Campos requeridos:', {
      title: propertyData.title,
      price: propertyData.price,
      location: propertyData.location,
      type: propertyData.type,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area
    });

    // Llamada real a la API
    const response = await propertiesAPI.create(propertyData);
    
    if (response.error) {
      throw new Error(response.error);
    }

    console.log('✅ Propiedad creada:', response.property);
      
      toast.success('Propiedad creada exitosamente', {
        description: `${response.property.title} ha sido añadida al inventario`
      });
      
      onClose();
      
      // Ejecutar callback si está disponible
      if (onPropertyCreated) {
        onPropertyCreated();
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        propertyType: '',
        operationType: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        bedrooms: 1,
        bathrooms: 1,
        totalArea: 50,
        usableArea: 0,
        plotArea: 0,
        floor: '',
        totalFloors: '',
        yearBuilt: '',
        condition: '',
        orientation: '',
        amenities: [],
        features: [],
        security: [],
        energyRating: '',
        heating: '',
        cooling: '',
        parking: '',
        storage: false,
        terrace: false,
        balcony: false,
        garden: false,
        communityFees: '',
        ibi: '',
        status: 'Activa',
        availability: 'Disponible',
        featured: false
      });
      
    } catch (error) {
      console.error('❌ Error creando propiedad:', error);
      toast.error('Error al crear la propiedad', {
        description: error instanceof Error ? error.message : 'Por favor intenta de nuevo'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Home className="h-6 w-6 mr-2 text-primary" />
            Nueva Propiedad
          </DialogTitle>
          <DialogDescription>
            Completa todos los detalles para crear una nueva propiedad en el inventario
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="location">Ubicación</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="amenities">Comodidades</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[50vh] mt-4">
            {/* Información Básica */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título de la propiedad *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Casa moderna en el centro de Madrid"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="propertyType">Tipo de propiedad *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="operationType">Tipo de operación *</Label>
                  <Select value={formData.operationType} onValueChange={(value) => handleInputChange('operationType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona operación" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Precio *</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="350000000"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activa">Activa</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Vendida">Vendida</SelectItem>
                      <SelectItem value="Inactiva">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe las características principales de la propiedad..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2 flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label>Marcar como propiedad destacada</Label>
                </div>
              </div>
            </TabsContent>

            {/* Ubicación */}
            <TabsContent value="location" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección completa *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Calle, número, etc."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Madrid"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="district">Distrito/Zona</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="Salamanca, Chamberí, etc."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="28001"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="40.4168"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="-3.7038"
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Detalles */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Habitaciones *</Label>
                  <div className="relative mt-1">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 1)}
                      placeholder="Ej: 3"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bathrooms">Baños *</Label>
                  <div className="relative mt-1">
                    <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 1)}
                      placeholder="Ej: 2"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="totalArea">Superficie total (m²) *</Label>
                  <div className="relative mt-1">
                    <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="totalArea"
                      type="number"
                      min="1"
                      value={formData.totalArea}
                      onChange={(e) => handleInputChange('totalArea', parseInt(e.target.value) || 50)}
                      placeholder="Ej: 120"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="usableArea">Superficie útil (m²)</Label>
                  <Input
                    id="usableArea"
                    type="number"
                    value={formData.usableArea}
                    onChange={(e) => handleInputChange('usableArea', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="floor">Planta</Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    placeholder="2º, Bajo, Ático..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="yearBuilt">Año construcción</Label>
                  <Input
                    id="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    placeholder="2020"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="condition">Estado</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nuevo">Nuevo</SelectItem>
                      <SelectItem value="Como nuevo">Como nuevo</SelectItem>
                      <SelectItem value="Buen estado">Buen estado</SelectItem>
                      <SelectItem value="A reformar">A reformar</SelectItem>
                      <SelectItem value="En construcción">En construcción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation">Orientación</Label>
                  <Select value={formData.orientation} onValueChange={(value) => handleInputChange('orientation', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona orientación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Norte">Norte</SelectItem>
                      <SelectItem value="Sur">Sur</SelectItem>
                      <SelectItem value="Este">Este</SelectItem>
                      <SelectItem value="Oeste">Oeste</SelectItem>
                      <SelectItem value="Noreste">Noreste</SelectItem>
                      <SelectItem value="Noroeste">Noroeste</SelectItem>
                      <SelectItem value="Sureste">Sureste</SelectItem>
                      <SelectItem value="Suroeste">Suroeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="energyRating">Certificado energético</Label>
                  <Select value={formData.energyRating} onValueChange={(value) => handleInputChange('energyRating', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="En trámite">En trámite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Comodidades */}
            <TabsContent value="amenities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Comodidades principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity) => {
                      const IconComponent = amenity.icon;
                      return (
                        <div
                          key={amenity.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.amenities.includes(amenity.id)
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleAmenityToggle(amenity.id)}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span className="text-sm">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Características adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <Badge
                        key={feature}
                        variant={formData.features.includes(feature) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFeatureToggle(feature)}
                      >
                        {feature}
                        {formData.features.includes(feature) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {securityFeatures.map((security) => (
                      <Badge
                        key={security}
                        variant={formData.security.includes(security) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSecurityToggle(security)}
                      >
                        {security}
                        {formData.security.includes(security) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información Avanzada */}
            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heating">Calefacción</Label>
                  <Select value={formData.heating} onValueChange={(value) => handleInputChange('heating', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tipo de calefacción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Central">Central</SelectItem>
                      <SelectItem value="Individual gas">Individual gas</SelectItem>
                      <SelectItem value="Individual eléctrica">Individual eléctrica</SelectItem>
                      <SelectItem value="Radiadores">Radiadores</SelectItem>
                      <SelectItem value="Suelo radiante">Suelo radiante</SelectItem>
                      <SelectItem value="Sin calefacción">Sin calefacción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="parking">Parking</Label>
                  <Select value={formData.parking} onValueChange={(value) => handleInputChange('parking', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tipo de parking" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Incluido">Incluido</SelectItem>
                      <SelectItem value="Opcional">Opcional</SelectItem>
                      <SelectItem value="Comunitario">Comunitario</SelectItem>
                      <SelectItem value="En la calle">En la calle</SelectItem>
                      <SelectItem value="No disponible">No disponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="communityFees">Gastos de comunidad (€/mes)</Label>
                  <Input
                    id="communityFees"
                    value={formData.communityFees}
                    onChange={(e) => handleInputChange('communityFees', e.target.value)}
                    placeholder="120"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ibi">IBI anual (€)</Label>
                  <Input
                    id="ibi"
                    value={formData.ibi}
                    onChange={(e) => handleInputChange('ibi', e.target.value)}
                    placeholder="800"
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg">Características especiales</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.storage}
                      onCheckedChange={(checked) => handleInputChange('storage', checked)}
                    />
                    <Label>Trastero</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.terrace}
                      onCheckedChange={(checked) => handleInputChange('terrace', checked)}
                    />
                    <Label>Terraza</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.balcony}
                      onCheckedChange={(checked) => handleInputChange('balcony', checked)}
                    />
                    <Label>Balcón</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.garden}
                      onCheckedChange={(checked) => handleInputChange('garden', checked)}
                    />
                    <Label>Jardín</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              {currentTab !== 'basic' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    const tabs = ['basic', 'location', 'details', 'amenities', 'advanced'];
                    const currentIndex = tabs.indexOf(currentTab);
                    if (currentIndex > 0) {
                      setCurrentTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Anterior
                </Button>
              )}
              
              {currentTab !== 'advanced' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const tabs = ['basic', 'location', 'details', 'amenities', 'advanced'];
                    const currentIndex = tabs.indexOf(currentTab);
                    if (currentIndex < tabs.length - 1) {
                      setCurrentTab(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Siguiente
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Crear Propiedad
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}