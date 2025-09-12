import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Calendar,
  Video,
  Home,
  TrendingUp,
  Key,
  CheckCircle,
  Star,
  ArrowRight,
  Building,
  Globe,
  Users
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { toast } from 'sonner@2.0.3';

const contactMethods = [
  {
    id: 'phone',
    title: 'Llámanos',
    description: 'Habla directamente con nuestros expertos',
    icon: Phone,
    primary: '+34 912 345 678',
    secondary: '+34 687 654 321',
    action: 'Llamar ahora',
    available: 'Lun-Vie 9:00-19:00',
    color: 'bg-green-500'
  },
  {
    id: 'email',
    title: 'Escríbenos',
    description: 'Envíanos un email y te responderemos pronto',
    icon: Mail,
    primary: 'info@inmoplus.com',
    secondary: 'ventas@inmoplus.com',
    action: 'Escribir email',
    available: 'Respuesta en 24h',
    color: 'bg-blue-500'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Chatea con nosotros por WhatsApp',
    icon: MessageCircle,
    primary: '+34 687 654 321',
    secondary: 'Chat inmediato',
    action: 'Abrir WhatsApp',
    available: 'Lun-Sáb 9:00-21:00',
    color: 'bg-green-600'
  },
  {
    id: 'visit',
    title: 'Visítanos',
    description: 'Ven a nuestra oficina en el centro de Madrid',
    icon: MapPin,
    primary: 'Calle Serrano 123, 2º A',
    secondary: '28006 Madrid, España',
    action: 'Ver en mapa',
    available: 'Lun-Vie 9:00-19:00',
    color: 'bg-purple-500'
  }
];

const officeHours = [
  { day: 'Lunes - Viernes', hours: '9:00 - 19:00' },
  { day: 'Sábados', hours: '10:00 - 14:00' },
  { day: 'Domingos', hours: 'Cerrado' }
];

const services = [
  {
    id: 'buy',
    title: 'Quiero Comprar',
    description: 'Encuentra la propiedad perfecta para ti',
    icon: Home,
    color: 'bg-blue-500'
  },
  {
    id: 'sell',
    title: 'Quiero Vender',
    description: 'Obtén la mejor valoración para tu propiedad',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    id: 'rent',
    title: 'Alquiler',
    description: 'Gestiona tu propiedad en alquiler',
    icon: Key,
    color: 'bg-yellow-500'
  }
];

const faqs = [
  {
    question: '¿Cobran por la valoración de mi propiedad?',
    answer: 'No, ofrecemos valoraciones gratuitas y sin compromiso. Nuestros expertos visitarán tu propiedad y te proporcionarán un informe detallado del valor de mercado.'
  },
  {
    question: '¿Cuánto tiempo tarda el proceso de venta?',
    answer: 'El tiempo promedio de venta está entre 2-4 meses, aunque depende de factores como ubicación, precio y condiciones del mercado. Nuestro marketing especializado acelera el proceso.'
  },
  {
    question: '¿Qué servicios incluye la gestión de alquiler?',
    answer: 'Incluye búsqueda de inquilinos, gestión de contratos, cobro de rentas, mantenimiento, gestión de incidencias y asesoramiento legal completo.'
  },
  {
    question: '¿Puedo programar una visita virtual?',
    answer: 'Sí, ofrecemos tours virtuales en tiempo real para que puedas ver las propiedades desde casa. También disponemos de videos y fotos profesionales de alta calidad.'
  }
];

const testimonials = [
  {
    name: 'Laura Pérez',
    role: 'Compradora',
    content: 'Excelente atención personalizada. Me ayudaron a encontrar la casa perfecta en tiempo récord.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e7?w=100'
  },
  {
    name: 'Miguel Torres',
    role: 'Vendedor',
    content: 'Vendieron mi apartamento por encima del precio esperado. Muy profesionales en todo el proceso.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  },
  {
    name: 'Carmen Silva',
    role: 'Propietaria',
    content: 'La gestión de alquiler es impecable. No tengo que preocuparme por nada, ellos se encargan de todo.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
  }
];

export function ContactPage() {
  const [activeService, setActiveService] = useState('buy');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'buy',
    message: '',
    contactMethod: 'email',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref: pageRef, hasBeenInView } = useInView(0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('¡Mensaje enviado correctamente!', {
        description: 'Nos pondremos en contacto contigo en las próximas 24 horas.'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'buy',
        message: '',
        contactMethod: 'email',
        urgency: 'normal'
      });
    } catch (error) {
      toast.error('Error al enviar el mensaje', {
        description: 'Por favor intenta de nuevo o contáctanos directamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactMethod = (method: string) => {
    switch (method) {
      case 'phone':
        window.open('tel:+34912345678');
        break;
      case 'email':
        window.open('mailto:info@inmoplus.com');
        break;
      case 'whatsapp':
        window.open('https://wa.me/34687654321');
        break;
      case 'visit':
        window.open('https://maps.google.com/?q=Calle+Serrano+123+Madrid');
        break;
    }
    
    toast.success(`Abriendo ${method}...`);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2V8ZW58MXx8fHwxNzU3NDcwMDg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Contacto profesional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center text-white transition-all duration-1000 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
              Hablemos de tu <span className="text-yellow-400 relative">
                Proyecto
                <span className="absolute inset-0 bg-yellow-400/20 blur-xl"></span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Estamos aquí para ayudarte en cada paso de tu aventura inmobiliaria. Contacta con nosotros hoy mismo
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="px-4 py-2 text-sm bg-green-500/20 text-green-200 border-green-400/30">
                <CheckCircle className="h-4 w-4 mr-2" />
                Respuesta 24h
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-blue-500/20 text-blue-200 border-blue-400/30">
                <Users className="h-4 w-4 mr-2" />
                Atención personalizada
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                <Star className="h-4 w-4 mr-2" />
                Expertos certificados
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-6">Múltiples formas de contactarnos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige la forma que más te convenga para ponerte en contacto con nuestro equipo
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-500 ${
          hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
        }`}>
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card 
                key={method.id} 
                className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleContactMethod(method.id)}
              >
                <CardContent className="p-0 text-center">
                  <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                  <div className="space-y-1 text-sm mb-4">
                    <p className="font-medium">{method.primary}</p>
                    <p className="text-gray-500">{method.secondary}</p>
                  </div>
                  <Badge variant="outline" className="mb-3 text-xs">
                    {method.available}
                  </Badge>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white">
                    {method.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className={`transition-all duration-1000 delay-700 ${
              hasBeenInView ? 'animate-in slide-in-from-left-6 fade-in' : 'opacity-0 translate-x-6'
            }`}>
              <Card className="p-8 shadow-xl border-0">
                <CardContent className="p-0">
                  <h3 className="text-2xl mb-6">Envíanos un mensaje</h3>
                  
                  {/* Service Selection */}
                  <div className="mb-6">
                    <label className="block text-sm mb-3">¿En qué podemos ayudarte?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {services.map((service) => {
                        const IconComponent = service.icon;
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => {
                              setActiveService(service.id);
                              setFormData(prev => ({ ...prev, service: service.id }));
                            }}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              activeService === service.id
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <IconComponent className="h-5 w-5 mx-auto mb-1" />
                            <span className="text-xs">{service.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Nombre completo *</label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          required
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Teléfono *</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+34 600 000 000"
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Método de contacto preferido</label>
                        <select
                          name="contactMethod"
                          value={formData.contactMethod}
                          onChange={handleChange}
                          className="w-full h-12 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Teléfono</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Urgencia</label>
                        <select
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleChange}
                          className="w-full h-12 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="low">Baja - En unos días</option>
                          <option value="normal">Normal - En 24-48h</option>
                          <option value="high">Alta - Lo antes posible</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Mensaje *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={
                          activeService === 'buy' 
                            ? "Cuéntanos qué tipo de propiedad buscas, ubicación preferida, presupuesto..."
                            : activeService === 'sell'
                            ? "Describe tu propiedad: ubicación, tipo, características principales..."
                            : "Detalles sobre tu propiedad en alquiler o consulta específica..."
                        }
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className={`space-y-6 transition-all duration-1000 delay-900 ${
              hasBeenInView ? 'animate-in slide-in-from-right-6 fade-in' : 'opacity-0 translate-x-6'
            }`}>
              {/* Office Info */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <h4 className="text-lg mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Nuestra Oficina
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p>Calle Serrano 123, 2º A</p>
                        <p className="text-gray-500">28006 Madrid, España</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Lun-Vie: 9:00-19:00, Sáb: 10:00-14:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <h4 className="text-lg mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Horarios de Atención
                  </h4>
                  <div className="space-y-2">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{schedule.day}</span>
                        <span className="text-gray-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <h4 className="text-lg mb-4">Acciones Rápidas</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Programar cita
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Videollamada
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat en vivo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-0">
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 italic">
                    "La atención al cliente es excepcional. Siempre disponibles y muy profesionales."
                  </p>
                  <div className="flex items-center">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b1e7?w=40"
                      alt="Cliente satisfecho"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-xs font-medium">Ana Ruiz</p>
                      <p className="text-xs text-gray-500">Cliente desde 2022</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 delay-1100 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-6">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600">Respuestas a las consultas más comunes de nuestros clientes</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-1300 ${
          hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
        }`}>
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-0">
                <h4 className="text-lg mb-3">{faq.question}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 delay-1500 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-6">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600">Testimonios reales de personas que confiaron en nosotros</p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1700 ${
            hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
          }`}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-gray-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}