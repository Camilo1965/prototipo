import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, Home, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Page } from '../hooks/useRouter';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Detectar si se ha hecho scroll
      setIsScrolled(currentScrollY > 10);
      
      // Mostrar/ocultar header basado en dirección del scroll
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up o cerca del top
        setIsHeaderVisible(true);
      } else {
        // Scrolling down
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header 
        className={`bg-white/95 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled ? 'py-2' : 'py-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'h-12' : 'h-16'
          }`}>
            {/* Logo */}
            <div className="flex items-center">
              <Home className={`text-primary mr-2 transition-all duration-300 ${
                isScrolled ? 'h-6 w-6' : 'h-8 w-8'
              }`} />
              <span className={`font-bold text-primary transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                InmoPlus
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex space-x-8 transition-all duration-300 ${
              isScrolled ? 'space-x-6' : 'space-x-8'
            }`}>
              <button 
                onClick={() => handleNavigation('inicio')} 
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  currentPage === 'inicio' ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                Inicio
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  currentPage === 'inicio' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
              <button 
                onClick={() => handleNavigation('propiedades')} 
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  currentPage === 'propiedades' ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                Propiedades
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  currentPage === 'propiedades' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
              <button 
                onClick={() => handleNavigation('servicios')} 
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  currentPage === 'servicios' ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                Servicios
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  currentPage === 'servicios' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
              <button 
                onClick={() => handleNavigation('nosotros')} 
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  currentPage === 'nosotros' ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                Nosotros
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  currentPage === 'nosotros' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
              <button 
                onClick={() => handleNavigation('contacto')} 
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  currentPage === 'contacto' ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                Contacto
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  currentPage === 'contacto' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
              <button 
                onClick={() => handleNavigation('admin')} 
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  currentPage === 'admin' ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                Admin
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  currentPage === 'admin' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            </nav>

            {/* Desktop Auth/User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size={isScrolled ? "sm" : "default"}
                      className="transition-all duration-300 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleNavigation('admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Panel de Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    size={isScrolled ? "sm" : "default"}
                    onClick={() => setShowAuthModal(true)}
                    disabled={loading}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    size={isScrolled ? "sm" : "default"} 
                    className="transition-all duration-300"
                    onClick={() => handleNavigation('contacto')}
                  >
                    Contactar Ahora
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {isMenuOpen ? 
                  <X className={`transition-all duration-300 ${isScrolled ? 'h-5 w-5' : 'h-6 w-6'}`} /> : 
                  <Menu className={`transition-all duration-300 ${isScrolled ? 'h-5 w-5' : 'h-6 w-6'}`} />
                }
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                  onClick={() => handleNavigation('inicio')}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-all ${
                    currentPage === 'inicio' ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Inicio
                </button>
                <button 
                  onClick={() => handleNavigation('propiedades')}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-all ${
                    currentPage === 'propiedades' ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Propiedades
                </button>
                <button 
                  onClick={() => handleNavigation('servicios')}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-all ${
                    currentPage === 'servicios' ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Servicios
                </button>
                <button 
                  onClick={() => handleNavigation('nosotros')}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-all ${
                    currentPage === 'nosotros' ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Nosotros
                </button>
                <button 
                  onClick={() => handleNavigation('contacto')}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-all ${
                    currentPage === 'contacto' ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Contacto
                </button>
                <button 
                  onClick={() => handleNavigation('admin')}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-all ${
                    currentPage === 'admin' ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Admin
                </button>
                {/* Mobile Auth Actions */}
                <div className="px-3 py-2 space-y-2">
                  {user ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => handleNavigation('admin')}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Panel de Admin
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start" 
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setShowAuthModal(true)}
                        disabled={loading}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Button>
                      <Button className="w-full" onClick={() => handleNavigation('contacto')}>
                        Contactar Ahora
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Floating Mini Header - Solo visible cuando el header principal está oculto */}
      <div 
        className={`fixed top-4 right-4 z-60 transition-all duration-500 ease-in-out ${
          !isHeaderVisible && isScrolled ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
          <button
            onClick={() => setIsHeaderVisible(true)}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-6 w-6" />
            <span className="hidden group-hover:block text-sm font-medium animate-in slide-in-from-right-2 duration-200">
              InmoPlus
            </span>
            <ChevronDown className="h-4 w-4 rotate-180 group-hover:rotate-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}