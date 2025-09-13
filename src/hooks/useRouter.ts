import { useState, useCallback } from 'react';

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

  const navigateTo = useCallback((page: Page) => {
    if (page === routerState.currentPage) return;

    setRouterState(prev => ({
      ...prev,
      isTransitioning: true
    }));

    // Simulate page transition delay
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