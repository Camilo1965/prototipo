import { useState, useCallback, useEffect } from 'react';

export type Page = 'inicio' | 'propiedades' | 'propiedad' | 'servicios' | 'nosotros' | 'contacto' | 'admin' | 'consultas';

export interface RouterState {
  currentPage: Page;
  previousPage: Page | null;
  isTransitioning: boolean;
}

export function useRouter(initialPage: Page = 'inicio') {
  const [routerState, setRouterState] = useState<RouterState>({
    currentPage: initialPage,
    previousPage: null,
    isTransitioning: false
  });

  // Parsear hash a page
  const parseHash = (): Page => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return 'inicio';
    if (hash.startsWith('/propiedad/')) return 'propiedad';
    const clean = hash.replace('/', '') as Page;
    const allowed: Page[] = ['inicio','propiedades','propiedad','servicios','nosotros','contacto','admin','consultas'];
    return allowed.includes(clean) ? clean : 'inicio';
  };

  useEffect(() => {
    // Sincronizar al cargar
    const page = parseHash();
    if (page !== routerState.currentPage) {
      setRouterState(prev => ({ ...prev, currentPage: page }));
    }
    const onHash = () => {
      const next = parseHash();
      setRouterState(prev => ({ ...prev, previousPage: prev.currentPage, currentPage: next }));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateTo = useCallback((page: Page) => {
    if (page === routerState.currentPage) return;

    setRouterState(prev => ({
      ...prev,
      isTransitioning: true
    }));

    // Actualizar hash
    if (page === 'inicio') {
      window.location.hash = '';
    } else if (page === 'propiedad') {
      // hash para propiedad se maneja fuera porque requiere id
    } else {
      window.location.hash = `/${page}`;
    }

    // Simulate page transition delay / animación
    setTimeout(() => {
      setRouterState(prev => ({
        currentPage: page,
        previousPage: prev.currentPage,
        isTransitioning: false
      }));
      
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }, [routerState.currentPage]);

  return {
    currentPage: routerState.currentPage,
    previousPage: routerState.previousPage,
    isTransitioning: routerState.isTransitioning,
    navigateTo
  };
}