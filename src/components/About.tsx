import { Button } from './ui/button';
import { CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from '../hooks/useRouter';

const features = [
  "Más de 10 años de experiencia en el sector",
  "Equipo de agentes certificados y especializados",
  "Red de contactos con los mejores profesionales",
  "Atención personalizada 24/7",
  "Tecnología avanzada para búsquedas precisas",
  "Proceso transparente y sin sorpresas"
];

export function About() {
  const { navigateTo } = useRouter();
  
  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl mb-6">
              ¿Por qué elegir <span className="text-primary">InmoPlus</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Somos una inmobiliaria de confianza con una sólida trayectoria en el mercado. 
              Nuestro compromiso es ayudarte a tomar la mejor decisión inmobiliaria de tu vida.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔄 Navegando a página nosotros...');
                  console.log('📍 Página actual antes de navegar:', window.location.hash || 'inicio');
                  navigateTo('nosotros');
                  console.log('✅ Comando navigateTo ejecutado');
                }}
                className="hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Conoce Nuestro Equipo
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigateTo('nosotros')}
                className="hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Testimonios
              </Button>
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1652878530627-cc6f063e3947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwb2ZmaWNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NzQ3MDA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Equipo profesional de InmoPlus"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-3xl text-primary mb-1">98%</div>
                <div className="text-sm text-gray-600">Satisfacción del cliente</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-primary text-white p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-3xl mb-1">24/7</div>
                <div className="text-sm">Atención al cliente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}