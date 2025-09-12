import { Card, CardContent } from './ui/card';
import { Home, TrendingUp, FileText, Users, Calculator, Shield } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: "Compra y Venta",
    description: "Te ayudamos a encontrar la propiedad perfecta o a vender tu inmueble al mejor precio del mercado."
  },
  {
    icon: TrendingUp,
    title: "Inversión Inmobiliaria",
    description: "Asesoramiento experto para maximizar tu rentabilidad en el mercado inmobiliario."
  },
  {
    icon: FileText,
    title: "Gestión Legal",
    description: "Nos encargamos de todos los trámites legales para que tu transacción sea segura y sin complicaciones."
  },
  {
    icon: Calculator,
    title: "Valoraciones",
    description: "Tasaciones profesionales y precisas basadas en análisis exhaustivos del mercado actual."
  },
  {
    icon: Users,
    title: "Asesoramiento Personalizado",
    description: "Cada cliente es único. Ofrecemos soluciones personalizadas adaptadas a tus necesidades específicas."
  },
  {
    icon: Shield,
    title: "Garantía y Seguridad",
    description: "Todas nuestras operaciones están respaldadas por garantías que protegen tus intereses."
  }
];

export function Services() {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una gama completa de servicios inmobiliarios para satisfacer todas tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}