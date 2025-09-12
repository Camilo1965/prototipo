import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { useRouter } from '../hooks/useRouter';
import { propertiesAPI, formatPrice, Property as APIProperty } from '../utils/api';

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
}

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: propertiesRef, hasBeenInView } = useInView(0.1);
  const { navigateTo } = useRouter();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        console.log('🔄 Cargando propiedades destacadas...');
        const response = await propertiesAPI.getAll({ 
          limit: 6,
          sortBy: 'views-desc'
        });
        
        if (response.error) {
          console.warn('⚠️ Error API:', response.error);
          // Usar datos de respaldo si hay error
          setProperties([]);
          return;
        }

        // Convertir las propiedades de la API al formato del componente
        const featuredProperties = response.properties.map((prop: APIProperty) => ({
          id: prop.id,
          title: prop.title,
          price: formatPrice(prop.price),
          location: prop.location,
          type: prop.type,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          area: prop.area,
          image: prop.images?.[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
          description: prop.description || '',
          status: prop.status
        }));
        
        console.log(`✅ ${featuredProperties.length} propiedades destacadas cargadas`);
        setProperties(featuredProperties);
      } catch (error) {
        console.error('❌ Error cargando propiedades destacadas:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);
  return (
    <section ref={propertiesRef} id="propiedades" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-4">Propiedades Destacadas</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de propiedades premium en las mejores ubicaciones
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            {properties.map((property, index) => (
            <Card 
              key={property.id} 
              className={`overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group ${
                hasBeenInView ? 'animate-in fade-in slide-in-from-bottom-4' : ''
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                <ImageWithFallback
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                
                {/* Status Badge */}
                <Badge 
                  className={`absolute top-4 left-4 ${
                    property.status === 'Nuevo' ? 'bg-green-500' :
                    property.status === 'Vendido' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                >
                  {property.status}
                </Badge>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>

                {/* Price */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
                  {property.price}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} hab.</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} baños</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.area} m²</span>
                  </div>
                </div>

                <Button 
                  className="w-full hover:scale-105 transition-all duration-300" 
                  variant="outline"
                  onClick={() => navigateTo('propiedades')}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            onClick={() => navigateTo('propiedades')}
            className="hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver Todas las Propiedades
          </Button>
        </div>
      </div>
    </section>
  );
}