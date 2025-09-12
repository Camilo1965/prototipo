import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Phone, Mail, MapPin, Clock, Home, TrendingUp, MessageCircle, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { toast } from 'sonner@2.0.3';

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    details: ["+34 912 345 678", "+34 687 654 321"]
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@inmoplus.com", "ventas@inmoplus.com"]
  },
  {
    icon: MapPin,
    title: "Oficina",
    details: ["Calle Serrano 123, 2º A", "28006 Madrid, España"]
  },
  {
    icon: Clock,
    title: "Horario",
    details: ["Lun - Vie: 9:00 - 19:00", "Sáb: 10:00 - 14:00"]
  }
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { ref: contactRef, hasBeenInView } = useInView(0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - replace with your own API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace this with your own Node.js API call
      console.log('Form data to send to your API:', formData);
      
      toast.success('¡Gracias por tu mensaje! Te contactaremos pronto.', {
        description: 'Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.'
      });
      setFormData({ name: '', email: '', phone: '', message: '', serviceType: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Error de conexión', {
        description: 'Verifica tu conexión a internet e intenta nuevamente.'
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

  const openDialog = (serviceType: string) => {
    setFormData(prev => ({ ...prev, serviceType }));
    setIsDialogOpen(true);
  };

  return (
    <>
      <section ref={contactRef} id="contacto" className="relative py-20 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzQ3MDA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Hermosa casa moderna"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-6 text-white">
              ¿Listo para dar el <span className="text-yellow-400 relative">
                siguiente paso
                <span className="absolute inset-0 bg-yellow-400/20 blur-xl"></span>
              </span>?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Sea cual sea tu objetivo inmobiliario, tenemos la experiencia y las herramientas para ayudarte a alcanzarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Vender */}
            <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-white/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl mb-4 text-white">¿Quieres vender?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Obtén la mejor valoración para tu propiedad y véndela rápidamente con nuestros expertos.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full group-hover:bg-green-500 group-hover:text-white transition-colors"
                      onClick={() => openDialog('venta')}
                    >
                      Quiero Vender
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>

            {/* Comprar */}
            <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-white/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <Home className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl mb-4 text-white">¿Quieres comprar?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Encuentra la propiedad perfecta con nuestra amplia cartera y asesoramiento personalizado.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full group-hover:bg-blue-500 group-hover:text-white transition-colors"
                      onClick={() => openDialog('compra')}
                    >
                      Quiero Comprar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>

            {/* Alquilar */}
            <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-white/20 bg-white/10 backdrop-blur-sm md:col-span-2 lg:col-span-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/30 transition-colors">
                  <MessageCircle className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl mb-4 text-white">¿Quieres alquilar?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Gestiona tu alquiler de forma segura y rentable con nuestro servicio integral.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full group-hover:bg-yellow-500 group-hover:text-white transition-colors"
                      onClick={() => openDialog('alquiler')}
                    >
                      Gestionar Alquiler
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Información de contacto compacta */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="text-white">
                  <IconComponent className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">{info.details[0]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {formData.serviceType === 'venta' && '🏠 Vender tu propiedad'}
              {formData.serviceType === 'compra' && '🔍 Encontrar tu hogar'}
              {formData.serviceType === 'alquiler' && '🏘️ Gestionar alquiler'}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {formData.serviceType === 'venta' && 'Completa el formulario y te ayudaremos a obtener la mejor valoración para tu propiedad.'}
              {formData.serviceType === 'compra' && 'Cuéntanos qué tipo de propiedad buscas y te ayudaremos a encontrar opciones perfectas.'}
              {formData.serviceType === 'alquiler' && 'Gestiona tu propiedad de alquiler con nuestro servicio integral y seguro.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm">Nombre</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Teléfono</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Cuéntanos más</label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={
                  formData.serviceType === 'venta' 
                    ? "Describe tu propiedad: ubicación, tipo, tamaño..."
                    : formData.serviceType === 'compra'
                    ? "¿Qué tipo de propiedad buscas? Ubicación preferida, presupuesto..."
                    : "Detalles sobre la propiedad a alquilar..."
                }
                rows={3}
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Contactar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}