import { Home, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'Sobre Nosotros', href: '#nosotros' },
    { name: 'Nuestro Equipo', href: '#' },
    { name: 'Testimonios', href: '#' },
    { name: 'Carreras', href: '#' }
  ],
  services: [
    { name: 'Compra', href: '#' },
    { name: 'Venta', href: '#' },
    { name: 'Alquiler', href: '#' },
    { name: 'Inversión', href: '#' },
    { name: 'Valoraciones', href: '#' }
  ],
  resources: [
    { name: 'Blog', href: '#' },
    { name: 'Guía del Comprador', href: '#' },
    { name: 'Calculadora Hipoteca', href: '#' },
    { name: 'Tendencias del Mercado', href: '#' }
  ],
  legal: [
    { name: 'Política de Privacidad', href: '#' },
    { name: 'Términos de Servicio', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'RGPD', href: '#' }
  ]
};

const socialLinks = [
  { icon: Facebook, href: '#', name: 'Facebook' },
  { icon: Twitter, href: '#', name: 'Twitter' },
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Linkedin, href: '#', name: 'LinkedIn' }
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Home className="h-8 w-8 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold">InmoPlus</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Tu socio de confianza en el mercado inmobiliario. Más de 10 años ayudando a familias 
              y empresas a encontrar la propiedad perfecta.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 InmoPlus. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Registro Mercantil de Madrid: Tomo 12345, Folio 123, Sección 8ª, Hoja M-123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}