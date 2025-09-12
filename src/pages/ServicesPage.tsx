import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { 
  Home, 
  TrendingUp, 
  Key, 
  Calculator, 
  FileText, 
  Shield, 
  Users, 
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Building,
  Handshake,
  Target,
  Award,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { toast } from 'sonner@2.0.3';

const services = [
  {
    id: 'compra-venta',
    title: 'Compra y Venta',
    icon: Home,
    description: 'Asesoramiento completo en procesos de compra y venta de propiedades',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
    features: [
      'Valoración gratuita de inmuebles',
      'Marketing personalizado',
      'Visitas guiadas',
      'Gestión documental completa',
      'Seguimiento hasta la escritura'
    ],
    process: [
      'Consulta inicial y valoración',
      'Estrategia de marketing',
      'Gestión de visitas',
      'Negociación',
      'Cierre y escritura'
    ],
    price: 'Comisión desde 2%'
  },
  {
    id: 'alquiler',
    title: 'Gestión de Alquileres',
    icon: Key,
    description: 'Gestión integral de propiedades en alquiler para propietarios e inquilinos',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    features: [
      'Búsqueda de inquilinos',
      'Gestión de contratos',
      'Cobro de rentas',
      'Mantenimiento de propiedades',
      'Gestión de incidencias'
    ],
    process: [
      'Evaluación de la propiedad',
      'Marketing y promoción',
      'Selección de inquilinos',
      'Firma de contrato',
      'Gestión mensual'
    ],
    price: 'Desde 8% del alquiler mensual'
  },
  {
    id: 'inversion',
    title: 'Inversión Inmobiliaria',
    icon: TrendingUp,
    description: 'Asesoramiento especializado en inversiones inmobiliarias rentables',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
    features: [
      'Análisis de rentabilidad',
      'Oportunidades de inversión',
      'Gestión de cartera',
      'Optimización fiscal',
      'Seguimiento de mercado'
    ],
    process: [
      'Análisis de perfil inversor',
      'Identificación de oportunidades',
      'Due diligence',
      'Ejecución de inversión',
      'Seguimiento y optimización'
    ],
    price: 'Consulta personalizada'
  },
  {
    id: 'valoracion',
    title: 'Valoración de Inmuebles',
    icon: Calculator,
    description: 'Tasaciones profesionales con metodología certificada',
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600',
    features: [
      'Metodología homologada',
      'Informe detallado',
      'Análisis de mercado',
      'Fotografías profesionales',
      'Entrega en 24-48h'
    ],
    process: [
      'Solicitud de valoración',
      'Visita técnica',
      'Análisis comparativo',
      'Elaboración del informe',
      'Entrega del certificado'
    ],
    price: 'Desde 150€'
  },
  {
    id: 'asesoria',
    title: 'Asesoría Legal',
    icon: FileText,
    description: 'Asesoramiento jurídico especializado en derecho inmobiliario',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    features: [
      'Revisión de contratos',
      'Gestión de escrituras',
      'Resolución de conflictos',
      'Asesoramiento fiscal',
      'Tramitación de permisos'
    ],
    process: [
      'Consulta inicial',
      'Análisis de documentación',
      'Estrategia legal',
      'Gestión de trámites',
      'Seguimiento del caso'
    ],
    price: 'Desde 80€/hora'
  },
  {
    id: 'seguros',
    title: 'Seguros Inmobiliarios',
    icon: Shield,
    description: 'Seguros especializados para proteger tu patrimonio inmobiliario',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
    features: [
      'Seguro de hogar',
      'Seguro de alquiler',
      'Seguro de comunidades',
      'Protección jurídica',
      'Cobertura integral'
    ],
    process: [
      'Evaluación de necesidades',
      'Comparativa de pólizas',
      'Contratación',
      'Gestión de siniestros',
      'Renovación anual'
    ],
    price: 'Desde 120€/año'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Propietaria',
    content: 'El servicio de gestión de alquileres ha sido excepcional. Se encargan de todo y siempre recibo mi renta puntualmente.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e7?w=100'
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    role: 'Inversor',
    content: 'Gracias a su asesoramiento en inversión inmobiliaria, he conseguido una rentabilidad del 8% anual en mi cartera.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  },
  {
    id: 3,
    name: 'Ana Martín',
    role: 'Compradora',
    content: 'Encontraron la casa perfecta para mi familia. El proceso fue muy fluido y transparente desde el primer día.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
  }
];

const faqs = [
  {
    question: '¿Cuánto tiempo tarda en venderse una propiedad?',
    answer: 'El tiempo promedio de venta está entre 2-4 meses, dependiendo del tipo de propiedad, ubicación y condiciones de mercado. Nuestro marketing especializado acelera significativamente este proceso.'
  },
  {
    question: '¿Qué documentos necesito para vender mi propiedad?',
    answer: 'Necesitarás la escritura de propiedad, nota simple del registro, cédula de habitabilidad, certificado energético, IBI al corriente y documentación de la comunidad de propietarios.'
  },
  {
    question: '¿Ofrecen garantías en el servicio de alquiler?',
    answer: 'Sí, ofrecemos garantía de cobro de rentas, seguro de impagos y gestión legal completa. Además, nuestros inquilinos pasan un riguroso proceso de selección.'
  },
  {
    question: '¿Cómo determinan el precio de una propiedad?',
    answer: 'Utilizamos metodología comparativa de mercado, análisis de ubicación, características del inmueble y tendencias actuales. Nuestras valoraciones son precisas y realistas.'
  },
  {
    question: '¿Qué comisión cobran por sus servicios?',
    answer: 'Nuestras comisiones son competitivas y transparentes: 2-3% en venta, 8-10% en gestión de alquiler. No hay costes ocultos y solo cobramos cuando conseguimos resultados.'
  }
];

export function ServicesPage() {
  const [activeService, setActiveService] = useState('compra-venta');
  const { ref: pageRef, hasBeenInView } = useInView(0.1);

  const handleContactService = (serviceTitle: string) => {
    toast.success(`Solicitud enviada para ${serviceTitle}`, {
      description: 'Nos pondremos en contacto contigo en las próximas 24 horas.'
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlcyUyMG9mZmljZXxlbnwxfHx8fDE3NTc0NzAwODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Servicios profesionales"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center text-white transition-all duration-1000 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
              Nuestros <span className="text-yellow-400 relative">
                Servicios
                <span className="absolute inset-0 bg-yellow-400/20 blur-xl"></span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Soluciones inmobiliarias integrales con más de 10 años de experiencia en el sector
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="px-4 py-2 text-sm bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                <Award className="h-4 w-4 mr-2" />
                Certificados
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-green-500/20 text-green-200 border-green-400/30">
                <Shield className="h-4 w-4 mr-2" />
                Asegurados
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-blue-500/20 text-blue-200 border-blue-400/30">
                <Users className="h-4 w-4 mr-2" />
                500+ Clientes
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-6">Servicios Especializados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos una gama completa de servicios inmobiliarios diseñados para satisfacer todas tus necesidades
          </p>
        </div>

        <Tabs value={activeService} onValueChange={setActiveService} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-gray-100 mb-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <TabsTrigger
                  key={service.id}
                  value={service.id}
                  className="flex flex-col gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs text-center">{service.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <TabsContent key={service.id} value={service.id} className="mt-0">
                <div className={`transition-all duration-1000 delay-500 ${
                  hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
                }`}>
                  <Card className="overflow-hidden shadow-2xl border-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="relative h-64 lg:h-auto">
                        <ImageWithFallback
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <div className="flex items-center mb-2">
                            <IconComponent className="h-8 w-8 mr-3 text-yellow-400" />
                            <h3 className="text-2xl">{service.title}</h3>
                          </div>
                          <p className="text-lg text-gray-200">{service.description}</p>
                        </div>
                      </div>

                      <CardContent className="p-8 lg:p-12">
                        <div className="space-y-8">
                          <div>
                            <h4 className="text-xl mb-4 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                              Características Principales
                            </h4>
                            <ul className="space-y-3">
                              {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xl mb-4 flex items-center">
                              <Target className="h-5 w-5 mr-2 text-blue-500" />
                              Proceso de Trabajo
                            </h4>
                            <div className="space-y-3">
                              {service.process.map((step, index) => (
                                <div key={index} className="flex items-center">
                                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-600">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-lg">Precio:</span>
                              <span className="text-xl text-primary">{service.price}</span>
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => handleContactService(service.title)}
                            >
                              Solicitar información
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 delay-700 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600">Testimonios reales de clientes satisfechos</p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-900 ${
            hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
          }`}>
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 delay-1000 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600">Resolvemos tus dudas más comunes</p>
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-1200 ${
          hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
        }`}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-lg">
                  <span className="text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 delay-1400 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-6">¿Necesitas ayuda personalizada?</h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para asesorarte en cualquier proyecto inmobiliario
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Phone className="h-5 w-5 mr-2" />
                Llamar ahora
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Mail className="h-5 w-5 mr-2" />
                Enviar email
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}