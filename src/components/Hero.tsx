import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Search, MapPin, Home, Users, Award, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { toast } from 'sonner@2.0.3';

interface HeroProps {
  onSearch?: (searchData: { location: string; type: string }) => void;
  onNavigateToProperties?: () => void;
}

export function Hero({ onSearch, onNavigateToProperties }: HeroProps) {
  const [searchData, setSearchData] = useState({
    location: '',
    type: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const { ref: heroRef, hasBeenInView } = useInView(0.2);

  const handleSearch = async () => {
    if (!searchData.location.trim()) {
      toast.error('Por favor, ingresa una ubicación para buscar');
      return;
    }

    setIsSearching(true);
    
    // Simular búsqueda
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onSearch) {
      onSearch(searchData);
    }
    
    // Navigate to properties page
    if (onNavigateToProperties) {
      onNavigateToProperties();
    }
    
    toast.success(`Buscando propiedades en ${searchData.location}${searchData.type ? ` - ${searchData.type}` : ''}`);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <section ref={heroRef} id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1706808849827-7366c098b317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NzQ3MDA4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Casa moderna de lujo"
          className="w-full h-full object-cover scale-105 animate-in zoom-in-95 duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-1/4 left-1/4 text-yellow-400/20 h-6 w-6 animate-pulse" />
        <Sparkles className="absolute top-1/3 right-1/3 text-yellow-400/30 h-4 w-4 animate-pulse delay-1000" />
        <Sparkles className="absolute bottom-1/4 right-1/4 text-yellow-400/20 h-5 w-5 animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center text-white">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto transition-all duration-1000 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-8 fade-in' : 'opacity-0 translate-y-8'
          }`}>
            Encuentra tu <span className="text-yellow-400 relative">
              hogar perfecto
              <span className="absolute inset-0 bg-yellow-400/20 blur-xl"></span>
            </span> con nosotros
          </h1>
          <p className={`text-xl sm:text-2xl mb-8 max-w-2xl mx-auto text-gray-200 transition-all duration-1000 delay-300 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            Más de 10 años ayudando a familias y inversionistas a encontrar la propiedad ideal
          </p>

          {/* Search Form */}
          <div className={`max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 transition-all duration-1000 delay-500 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder="Ubicación (ej. Madrid, Barcelona...)"
                    className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                    value={searchData.location}
                    onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
              <div>
                <select 
                  className="w-full h-12 px-3 rounded-md border border-gray-200 bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  value={searchData.type}
                  onChange={(e) => setSearchData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">Tipo de propiedad</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="chalet">Chalet</option>
                  <option value="oficina">Oficina</option>
                  <option value="local">Local comercial</option>
                </select>
              </div>
              <div>
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-primary to-gray-800 hover:from-gray-800 hover:to-primary transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-700 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            {/* Propiedades Vendidas */}
            <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/20 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 cursor-pointer">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Home className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                  </div>
                  <div className="text-4xl mb-3 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">1000+</div>
                  <div className="text-white/90 group-hover:text-white transition-colors duration-300">Propiedades vendidas</div>
                  <p className="text-white/70 text-sm mt-2 group-hover:text-white/80 transition-colors duration-300">
                    Casas y apartamentos exitosamente vendidos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Clientes Satisfechos */}
            <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-400/20 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 cursor-pointer">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-400/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Users className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                  </div>
                  <div className="text-4xl mb-3 text-green-400 group-hover:text-green-300 transition-colors duration-300">500+</div>
                  <div className="text-white/90 group-hover:text-white transition-colors duration-300">Clientes satisfechos</div>
                  <p className="text-white/70 text-sm mt-2 group-hover:text-white/80 transition-colors duration-300">
                    Familias felices en su nuevo hogar
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Años de Experiencia */}
            <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-400/20 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 cursor-pointer">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-400/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Award className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <div className="text-4xl mb-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">10+</div>
                  <div className="text-white/90 group-hover:text-white transition-colors duration-300">Años de experiencia</div>
                  <p className="text-white/70 text-sm mt-2 group-hover:text-white/80 transition-colors duration-300">
                    Líderes en el mercado inmobiliario
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}