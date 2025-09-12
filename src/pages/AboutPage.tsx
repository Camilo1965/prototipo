import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Building,
  Handshake,
  Globe,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Star,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';

const teamMembers = [
  {
    id: 1,
    name: 'Ana García',
    role: 'CEO & Fundadora',
    bio: 'Más de 15 años de experiencia en el sector inmobiliario. Especialista en inversión y desarrollo de proyectos.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e7?w=300',
    experience: '15 años',
    specialties: ['Inversión', 'Desarrollo', 'Estrategia'],
    contact: {
      email: 'ana.garcia@inmoplus.com',
      phone: '+34 912 345 678',
      linkedin: '#'
    }
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    role: 'Director Comercial',
    bio: 'Experto en ventas y marketing inmobiliario. Ha gestionado más de 500 operaciones exitosas.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    experience: '12 años',
    specialties: ['Ventas', 'Marketing', 'Negociación'],
    contact: {
      email: 'carlos.ruiz@inmoplus.com',
      phone: '+34 912 345 679',
      linkedin: '#'
    }
  },
  {
    id: 3,
    name: 'María López',
    role: 'Directora de Alquileres',
    bio: 'Especialista en gestión de alquileres y administración de fincas. Garantiza la máxima rentabilidad.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    experience: '10 años',
    specialties: ['Alquileres', 'Administración', 'Gestión'],
    contact: {
      email: 'maria.lopez@inmoplus.com',
      phone: '+34 912 345 680',
      linkedin: '#'
    }
  },
  {
    id: 4,
    name: 'David Martín',
    role: 'Asesor Legal',
    bio: 'Abogado especializado en derecho inmobiliario. Garantiza la seguridad jurídica en todas las operaciones.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    experience: '8 años',
    specialties: ['Legal', 'Contratos', 'Fiscalidad'],
    contact: {
      email: 'david.martin@inmoplus.com',
      phone: '+34 912 345 681',
      linkedin: '#'
    }
  }
];

const companyStats = [
  {
    id: 1,
    number: '1000+',
    label: 'Propiedades vendidas',
    icon: Building,
    color: 'text-blue-500'
  },
  {
    id: 2,
    number: '500+',
    label: 'Clientes satisfechos',
    icon: Users,
    color: 'text-green-500'
  },
  {
    id: 3,
    number: '10+',
    label: 'Años de experiencia',
    icon: Calendar,
    color: 'text-yellow-500'
  },
  {
    id: 4,
    number: '€50M+',
    label: 'Volumen de ventas',
    icon: TrendingUp,
    color: 'text-purple-500'
  }
];

const values = [
  {
    id: 1,
    title: 'Transparencia',
    description: 'Operamos con total transparencia en todos nuestros procesos, proporcionando información clara y veraz.',
    icon: CheckCircle,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Confianza',
    description: 'Construimos relaciones duraderas basadas en la confianza mutua y el compromiso con nuestros clientes.',
    icon: Handshake,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Excelencia',
    description: 'Buscamos la excelencia en cada servicio, superando las expectativas de nuestros clientes.',
    icon: Star,
    color: 'bg-yellow-500'
  },
  {
    id: 4,
    title: 'Innovación',
    description: 'Utilizamos las últimas tecnologías y metodologías para ofrecer soluciones innovadoras.',
    icon: Globe,
    color: 'bg-purple-500'
  }
];

const timeline = [
  {
    year: '2014',
    title: 'Fundación de InmoPlus',
    description: 'Ana García funda InmoPlus con la visión de revolucionar el sector inmobiliario en Madrid.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
  },
  {
    year: '2016',
    title: 'Expansión del equipo',
    description: 'Incorporación de especialistas en diferentes áreas para ofrecer un servicio integral.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400'
  },
  {
    year: '2018',
    title: 'Primera oficina física',
    description: 'Apertura de la primera oficina en el centro de Madrid para atender mejor a nuestros clientes.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
  },
  {
    year: '2020',
    title: 'Digitalización completa',
    description: 'Implementación de tecnologías digitales para tours virtuales y gestión online.',
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400'
  },
  {
    year: '2022',
    title: 'Certificación de calidad',
    description: 'Obtención de certificaciones de calidad en servicios inmobiliarios.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
  },
  {
    year: '2024',
    title: 'Líder del mercado',
    description: 'Reconocidos como una de las inmobiliarias más confiables de Madrid.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
  }
];

const awards = [
  {
    title: 'Mejor Inmobiliaria Madrid 2023',
    organization: 'Asociación de Empresas Inmobiliarias',
    year: '2023'
  },
  {
    title: 'Premio Excelencia al Cliente',
    organization: 'Cámara de Comercio de Madrid',
    year: '2022'
  },
  {
    title: 'Certificación ISO 9001',
    organization: 'Organismo Internacional de Normalización',
    year: '2021'
  }
];

export function AboutPage() {
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);
  const { ref: pageRef, hasBeenInView } = useInView(0.1);

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB0ZWFtfGVufDF8fHx8MTc1NzQ3MDA4OXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Nuestro equipo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center text-white transition-all duration-1000 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-6 fade-in' : 'opacity-0 translate-y-6'
          }`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
              Sobre <span className="text-yellow-400 relative">
                Nosotros
                <span className="absolute inset-0 bg-yellow-400/20 blur-xl"></span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Somos un equipo apasionado de profesionales inmobiliarios comprometidos con hacer realidad tus sueños
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="px-4 py-2 text-sm bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                <Award className="h-4 w-4 mr-2" />
                Premiados
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-green-500/20 text-green-200 border-green-400/30">
                <Shield className="h-4 w-4 mr-2" />
                Certificados
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-blue-500/20 text-blue-200 border-blue-400/30">
                <Clock className="h-4 w-4 mr-2" />
                10+ Años
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-300 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          {companyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.id} className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <IconComponent className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl mb-2">{stat.number}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-6">Nuestra Historia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde 2014, hemos estado transformando el mercado inmobiliario de Madrid con pasión, dedicación y un enfoque centrado en el cliente
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 transition-all duration-1000 delay-700 ${
            hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
          }`}>
            <div>
              <h3 className="text-2xl mb-6">Nuestra Misión</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                En InmoPlus, creemos que encontrar el hogar perfecto o realizar una inversión inmobiliaria exitosa 
                no debería ser una experiencia estresante. Nuestra misión es simplificar y humanizar el proceso 
                inmobiliario, ofreciendo un servicio personalizado que supere las expectativas de nuestros clientes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nos especializamos en crear conexiones significativas entre personas y propiedades, asegurándonos 
                de que cada transacción sea transparente, eficiente y exitosa. Nuestro compromiso va más allá de 
                una simple venta: construimos relaciones duraderas basadas en la confianza y la satisfacción mutua.
              </p>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600"
                alt="Nuestra oficina"
                className="w-full h-80 object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Values */}
          <div className={`transition-all duration-1000 delay-900 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h3 className="text-2xl text-center mb-12">Nuestros Valores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={value.id} className="p-6 text-center hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                    <CardContent className="p-0">
                      <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg mb-3">{value.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-16 transition-all duration-1000 delay-1000 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-6">Nuestro Crecimiento</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un viaje de crecimiento continuo y mejora constante
          </p>
        </div>

        <div className={`relative transition-all duration-1000 delay-1200 ${
          hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
        }`}>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-gray-300"></div>
          
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card className={`p-6 hover:shadow-xl transition-all duration-300 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                    <CardContent className="p-0">
                      <div className="flex items-center mb-4">
                        <Badge className="bg-primary text-white px-3 py-1 text-sm">
                          {item.year}
                        </Badge>
                      </div>
                      <h4 className="text-lg mb-3">{item.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-1400 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-6">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales experimentados comprometidos con tu éxito
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-1600 ${
            hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
          }`}>
            {teamMembers.map((member, index) => (
              <Card 
                key={member.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setActiveTeamMember(activeTeamMember === member.id ? null : member.id)}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-lg">{member.name}</h4>
                    <p className="text-sm text-gray-200">{member.role}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Experiencia</span>
                      <span>{member.experience}</span>
                    </div>
                    <Progress value={Math.min(parseInt(member.experience) * 6.67, 100)} className="h-2" />
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {activeTeamMember === member.id && (
                    <div className="border-t pt-4 mt-4 animate-in slide-in-from-top-2 fade-in">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{member.contact.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{member.contact.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Linkedin className="h-4 w-4 mr-2" />
                          <span>LinkedIn</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 delay-1800 ${
          hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl sm:text-4xl mb-6">Reconocimientos</h2>
          <p className="text-xl text-gray-600">Nuestro trabajo ha sido reconocido por organizaciones prestigiosas</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-2000 ${
          hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
        }`}>
          {awards.map((award, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-0">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-lg mb-2">{award.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{award.organization}</p>
                <Badge variant="outline">{award.year}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 delay-2200 ${
            hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl sm:text-4xl mb-6">¿Quieres formar parte de nuestro equipo?</h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Estamos siempre buscando talento excepcional para unirse a nuestra familia InmoPlus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Users className="h-5 w-5 mr-2" />
                Ver ofertas de empleo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Mail className="h-5 w-5 mr-2" />
                Envía tu CV
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}