import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProperties } from './components/FeaturedProperties';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ui/scroll-progress';
import { BackToTop } from './components/ui/back-to-top';
import { Toaster } from './components/ui/sonner';
import { PageTransition } from './components/ui/page-transition';
import { AuthProvider } from './components/AuthProvider';
import { useRouter } from './hooks/useRouter';

// Import pages
import { PropertiesPage } from './pages/PropertiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { InquiriesPage } from './pages/InquiriesPage';

function AppContent() {
  const { currentPage, isTransitioning, navigateTo } = useRouter('inicio');

  useEffect(() => {
    // Smooth scrolling para toda la página
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'inicio':
        return (
          <PageTransition pageKey="inicio">
            <main className="relative">
              <div id="inicio">
                <Hero onNavigateToProperties={() => navigateTo('propiedades')} />
              </div>
              <div id="propiedades">
                <FeaturedProperties />
              </div>
              <div id="servicios">
                <Services />
              </div>
              <div id="nosotros">
                <About />
              </div>
              <div id="contacto">
                <Contact />
              </div>
            </main>
            <Footer />
          </PageTransition>
        );
      case 'propiedades':
        return (
          <PageTransition pageKey="propiedades">
            <main className="pt-16">
              <PropertiesPage />
            </main>
            <Footer />
          </PageTransition>
        );
      case 'servicios':
        return (
          <PageTransition pageKey="servicios">
            <main className="pt-16">
              <ServicesPage />
            </main>
            <Footer />
          </PageTransition>
        );
      case 'nosotros':
        return (
          <PageTransition pageKey="nosotros">
            <main className="pt-16">
              <AboutPage />
            </main>
            <Footer />
          </PageTransition>
        );
      case 'contacto':
        return (
          <PageTransition pageKey="contacto">
            <main className="pt-16">
              <ContactPage />
            </main>
            <Footer />
          </PageTransition>
        );
      case 'admin':
        return (
          <PageTransition pageKey="admin">
            <AdminDashboard />
          </PageTransition>
        );
      case 'consultas':
        return (
          <PageTransition pageKey="consultas">
            <InquiriesPage />
          </PageTransition>
        );
      default:
        return (
          <PageTransition pageKey="inicio">
            <main className="relative">
              <div id="inicio">
                <Hero onNavigateToProperties={() => navigateTo('propiedades')} />
              </div>
              <div id="propiedades">
                <FeaturedProperties />
              </div>
              <div id="servicios">
                <Services />
              </div>
              <div id="nosotros">
                <About />
              </div>
              <div id="contacto">
                <Contact />
              </div>
            </main>
            <Footer />
          </PageTransition>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      {renderCurrentPage()}
      {currentPage !== 'admin' && currentPage !== 'consultas' && <BackToTop />}
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}