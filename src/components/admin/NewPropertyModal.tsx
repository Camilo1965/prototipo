import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// Removed unused Checkbox import
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import {
  Home,
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
  Building,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { propertiesAPI, filesAPI } from '../../utils/api';
import { Progress } from '../ui/progress';
import { MapPicker } from './MapPicker';

// Utilidad para extraer coordenadas desde URLs comunes de Google Maps
function extractCoords(url: string): { lat: number; lng: number } | null {
  try {
    // Patrones posibles:
    // 1. .../@40.416775,-3.703790,17z/
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+),/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    // 2. ...?q=40.416775,-3.703790
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    // 3. Coordenadas simples en path .../40.416775,-3.703790
    const pathMatch = url.match(/\/(-?\d+\.\d+),(-?\d+\.\d+)(?:[/#?]|$)/);
    if (pathMatch) {
      const lat = parseFloat(pathMatch[1]);
      const lng = parseFloat(pathMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    return null;
  } catch {
    return null;
  }
}

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated?: () => void;
  property?: any; // Property para edición
  mode?: 'create' | 'edit';
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
  googleMapsUrl: string;
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

export function NewPropertyModal({ isOpen, onClose, onPropertyCreated, property, mode = 'create', isEditing = false, propertyData = null }: NewPropertyModalProps & { isEditing?: boolean, propertyData?: any }) {
  // Si tenemos propertyData (de la versión antigua) y estamos en modo edición, usarlo como property
  const effectiveProperty = isEditing && propertyData ? propertyData : property;
  // Aseguramos que el modo está definido
  const editMode = mode === 'edit' || isEditing;
  const [formData, setFormData] = useState<PropertyData>(() => {
    if ((editMode && property) || (isEditing && propertyData)) {
      // Utilizar effectiveProperty para los datos iniciales
      // Mapear property a PropertyData según los campos disponibles
      return {
        title: effectiveProperty.title || '',
        description: effectiveProperty.description || '',
        price: effectiveProperty.price || '',
        propertyType: effectiveProperty.type || '',
        operationType: effectiveProperty.operationType || '',
        address: effectiveProperty.address || '',
        city: effectiveProperty.city || '',
        district: effectiveProperty.district || '',
        postalCode: effectiveProperty.postalCode || '',
        latitude: effectiveProperty.latitude || '',
        longitude: effectiveProperty.longitude || '',
        bedrooms: effectiveProperty.bedrooms || 1,
        bathrooms: effectiveProperty.bathrooms || 1,
        totalArea: effectiveProperty.area || 50,
        usableArea: effectiveProperty.usableArea || 0,
        plotArea: effectiveProperty.plotArea || 0,
        floor: effectiveProperty.floor || '',
        totalFloors: effectiveProperty.totalFloors || '',
        yearBuilt: effectiveProperty.yearBuilt || '',
        condition: effectiveProperty.condition || '',
        orientation: effectiveProperty.orientation || '',
        amenities: effectiveProperty.amenities || [],
        features: effectiveProperty.features || [],
        security: effectiveProperty.security || [],
        energyRating: effectiveProperty.energyRating || '',
        heating: effectiveProperty.heating || '',
        cooling: effectiveProperty.cooling || '',
        parking: effectiveProperty.parking || '',
        storage: effectiveProperty.storage || false,
        terrace: effectiveProperty.terrace || false,
        balcony: effectiveProperty.balcony || false,
        garden: effectiveProperty.garden || false,
        communityFees: effectiveProperty.communityFees || '',
        ibi: effectiveProperty.ibi || '',
        status: effectiveProperty.status || 'Activa',
        availability: effectiveProperty.availability || 'Disponible',
        featured: effectiveProperty.featured || false,
        googleMapsUrl: effectiveProperty.googleMapsUrl || ''
      };
    }
    return {
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
      featured: false,
      googleMapsUrl: ''
    };
  });

  // Siempre empezamos en la pestaña básica para una experiencia consistente
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Manejo de imágenes
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Estado de subida: { [file.name]: { progress: number, status: 'pending'|'uploading'|'success'|'error', url?: string, error?: string } }
  const [uploadStatus, setUploadStatus] = useState<Record<string, { progress: number, status: string, url?: string, error?: string }>>({});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Previsualización combinada
  const allPreviewImages = [
    ...imageUrls,
    ...imageFiles.map(file => URL.createObjectURL(file))
  ];

  // Limpiar blobs al cerrar modal
  useEffect(() => {
  if (!isOpen) {
      imageFiles.forEach(f => URL.revokeObjectURL(URL.createObjectURL(f)));
      setImageFiles([]);
      setImageUrls([]);
      setNewImageUrl('');
    }
  }, [isOpen]);

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (img: string) => {
    setImageUrls(prev => prev.filter(url => url !== img));
    setImageFiles(prev => prev.filter(f => URL.createObjectURL(f) !== img));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files ?? []);
      setImageFiles(prev => [...prev, ...filesArr]);
      // Inicializar estado de subida
      setUploadStatus(prev => {
        const next = { ...prev };
        filesArr.forEach(f => {
          next[f.name] = { progress: 0, status: 'pending' };
        });
        return next;
      });
    }
  };

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
      // Validar campos requeridos, los mismos para creación y edición
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
    const latNum = formData.latitude ? parseFloat(formData.latitude) : undefined;
    const lngNum = formData.longitude ? parseFloat(formData.longitude) : undefined;
    const coordsValid = typeof latNum === 'number' && !isNaN(latNum) && typeof lngNum === 'number' && !isNaN(lngNum);
    // Subir imágenes locales al backend (ejemplo: Supabase Storage, aquí solo mock)
    let uploadedImageUrls: string[] = [];
    if (imageFiles.length > 0) {
      uploadedImageUrls = await Promise.all(imageFiles.map(async (file) => {
        setUploadStatus(prev => ({ ...prev, [file.name]: { ...prev[file.name], status: 'uploading', progress: 10 } }));
        try {
          // Simular progreso (si filesAPI.uploadImage no lo soporta)
          let progress = 10;
          const progressInterval = setInterval(() => {
            progress = Math.min(progress + 20, 90);
            setUploadStatus(prev => ({ ...prev, [file.name]: { ...prev[file.name], progress } }));
          }, 300);
          const res = await filesAPI.uploadImage(file);
          clearInterval(progressInterval);
          let url = '';
          if (typeof res === 'string') url = res;
          else if (res && res.url) url = res.url;
          else if (res && res.path) url = res.path;
          setUploadStatus(prev => ({ ...prev, [file.name]: { ...prev[file.name], status: 'success', progress: 100, url } }));
          return url;
        } catch (e) {
          setUploadStatus(prev => ({ ...prev, [file.name]: { ...prev[file.name], status: 'error', progress: 100, error: e instanceof Error ? e.message : 'Error' } }));
          toast.error('Error subiendo imagen: ' + (e instanceof Error ? e.message : ''));
          return '';
        }
      }));
      uploadedImageUrls = uploadedImageUrls.filter(Boolean);
    }
    const propertyData: any = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      location: `${formData.city}${formData.district ? ', ' + formData.district : ''}`,
      type: formData.propertyType || 'Otro',
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.totalArea,
      images: [...imageUrls, ...uploadedImageUrls],
      amenities: formData.amenities,
      features: formData.features,
      security: formData.security,
      status: 'Disponible' as 'Disponible',
      condition: formData.condition || 'Buen estado'
    };
    if (coordsValid) {
      propertyData.lat = latNum;
      propertyData.lng = lngNum;
    }
    if (formData.googleMapsUrl) {
      propertyData.googleMapsUrl = formData.googleMapsUrl.trim();
    } else if (coordsValid) {
      // generar url simple si no se proporcionó
      propertyData.googleMapsUrl = `https://www.google.com/maps?q=${latNum},${lngNum}`;
    }

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

    let response;
    if (editMode && property && property.id) {
      // Actualizar propiedad existente
      console.log('Actualizando propiedad existente:', property.id, propertyData);
      response = await propertiesAPI.update(property.id, propertyData);
      if (response.error) {
        throw new Error(response.error);
      }
      toast.success('Propiedad actualizada exitosamente', {
        description: `${propertyData.title} ha sido actualizada`
      });
    } else {
      // Crear nueva propiedad
      response = await propertiesAPI.create(propertyData);
      if (response.error) {
        throw new Error(response.error);
      }
      toast.success('Propiedad creada exitosamente', {
        description: `${response.property.title} ha sido añadida al inventario`
      });
      // Reset form solo en modo creación
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
        featured: false,
        googleMapsUrl: ''
      });
    }
    onClose();
    // Ejecutar callback si está disponible
    if (onPropertyCreated) {
      onPropertyCreated();
    }
  } catch (error) {
    console.error('❌ Error guardando propiedad:', error);
    toast.error('Error al guardar la propiedad', {
      description: error instanceof Error ? error.message : 'Por favor intenta de nuevo'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  // Debug para ver el modo y datos recibidos
  useEffect(() => {
    if (editMode) {
      console.log('Modal abierto en modo EDICIÓN con datos:', property);
    } else {
      console.log('Modal abierto en modo CREACIÓN');
    }
  }, [editMode, property]);
  
  // Aseguramos iniciar con la pestaña básica para edición también
  useEffect(() => {
    // Resetear el tab a básico cuando se abre el modal
    setCurrentTab('basic');
  }, [isOpen]);

  return (
  <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Home className="h-6 w-6 mr-2 text-primary" />
            {editMode ? 'Editar Propiedad Completa' : 'Nueva Propiedad'}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? 'Edición avanzada: Modifica todos los detalles de la propiedad usando las pestañas para acceder a todas las opciones.'
              : 'Completa todos los detalles para crear una nueva propiedad en el inventario'}
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
              {/* Imágenes */}
              <div className="mb-4">
                <Label className="block mb-1 font-semibold text-gray-700">Imágenes de la propiedad</Label>
                <div className="w-full flex flex-col gap-2">
                  <div
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300 p-6 cursor-pointer mb-2"
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      // Crear un input ficticio para simular el evento
                      const fakeInput = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
                      handleFileChange(fakeInput);
                    }}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="text-blue-700 font-medium text-sm">Arrastra imágenes aquí o haz clic para seleccionar</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Pega una URL de imagen y presiona +"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      className="w-full"
                    />
                    <Button type="button" onClick={handleAddImageUrl} disabled={!newImageUrl.trim()}>+</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {allPreviewImages.length === 0 && (
                      <div className="col-span-full text-center text-xs text-gray-400 py-6">No hay imágenes seleccionadas</div>
                    )}
                    {allPreviewImages.map((img, idx) => {
                      const file = imageFiles.find(f => URL.createObjectURL(f) === img);
                      const status = file ? uploadStatus[file.name] : undefined;
                      return (
                        <div
                          key={img + idx}
                          className="relative group rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                          <img
                            src={img}
                            alt="preview"
                            className="w-full h-40 object-cover rounded-xl group-hover:opacity-90 transition-opacity duration-200"
                          />
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); handleRemoveImage(img); }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-base shadow-lg opacity-80 hover:opacity-100 transition"
                            title="Eliminar imagen"
                          >×</button>
                          {status && (
                            <div className="absolute left-0 right-0 bottom-0">
                              <Progress value={status.progress} className="h-1" />
                              {status.status === 'uploading' && <span className="block text-[10px] text-blue-600 text-center">Subiendo...</span>}
                              {status.status === 'success' && <span className="block text-[10px] text-green-600 text-center">¡Listo!</span>}
                              {status.status === 'error' && <span className="block text-[10px] text-red-600 text-center">Error</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Puedes subir varias imágenes desde tu dispositivo, arrastrar y soltar, o agregar URLs. El orden se respeta al guardar.</p>
              </div>
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
                  <Select value={formData.propertyType} onValueChange={(value: string) => handleInputChange('propertyType', value)}>
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
                  <Select value={formData.operationType} onValueChange={(value: string) => handleInputChange('operationType', value)}>
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
                  <Select value={formData.status} onValueChange={(value: string) => handleInputChange('status', value)}>
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
                    onCheckedChange={(checked: boolean) => handleInputChange('featured', checked)}
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

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="googleMapsUrl">URL de Google Maps (opcional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="googleMapsUrl"
                      value={formData.googleMapsUrl}
                      onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
                      placeholder="Pega aquí la URL de Google Maps"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!formData.googleMapsUrl) {
                          toast.warning('Primero pega una URL');
                          return;
                        }
                        const parsed = extractCoords(formData.googleMapsUrl);
                        if (!parsed) {
                          toast.error('No se pudieron extraer coordenadas');
                          return;
                        }
                        handleInputChange('latitude', String(parsed.lat));
                        handleInputChange('longitude', String(parsed.lng));
                        toast.success('Coordenadas extraídas');
                      }}
                    >Extraer</Button>
                  </div>
                  <p className="text-xs text-gray-500">Acepta formatos con @lat,lng, o q=lat,lng. Si extraes, se rellenan las coordenadas y puedes ajustarlas en el mapa.</p>
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
                <div className="md:col-span-2 space-y-3 min-h-[28rem]">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Coordenadas (opcional)</Label>
                      <p className="text-xs text-gray-500">Selecciona en el mapa o introduce manualmente</p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Lat"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        className="h-9 w-32"
                      />
                      <Input
                        placeholder="Lng"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        className="h-9 w-32"
                      />
                    </div>
                  </div>
                  <MapPicker
                    lat={formData.latitude ? parseFloat(formData.latitude) : undefined}
                    lng={formData.longitude ? parseFloat(formData.longitude) : undefined}
                    onChange={({ lat, lng }) => {
                      handleInputChange('latitude', String(lat));
                      handleInputChange('longitude', String(lng));
                      if (!formData.googleMapsUrl) {
                        handleInputChange('googleMapsUrl', `https://www.google.com/maps?q=${lat},${lng}`);
                      }
                    }}
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
                  <Select value={formData.condition} onValueChange={(value: string) => handleInputChange('condition', value)}>
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
                  <Select value={formData.orientation} onValueChange={(value: string) => handleInputChange('orientation', value)}>
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
                  <Select value={formData.energyRating} onValueChange={(value: string) => handleInputChange('energyRating', value)}>
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
                  <Select value={formData.heating} onValueChange={(value: string) => handleInputChange('heating', value)}>
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
                  <Select value={formData.parking} onValueChange={(value: string) => handleInputChange('parking', value)}>
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
                      onCheckedChange={(checked: boolean) => handleInputChange('storage', checked)}
                    />
                    <Label>Trastero</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.terrace}
                      onCheckedChange={(checked: boolean) => handleInputChange('terrace', checked)}
                    />
                    <Label>Terraza</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.balcony}
                      onCheckedChange={(checked: boolean) => handleInputChange('balcony', checked)}
                    />
                    <Label>Balcón</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.garden}
                      onCheckedChange={(checked: boolean) => handleInputChange('garden', checked)}
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
              <Button onClick={handleSubmit} disabled={isSubmitting || Object.values(uploadStatus).some(s => s.status === 'uploading')}>
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