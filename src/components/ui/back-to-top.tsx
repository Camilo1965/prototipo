import { useState, useEffect } from 'react';
import { Button } from './button';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="lg"
        className="rounded-full w-14 h-14 shadow-2xl hover:shadow-yellow-400/25 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 border-0 group transition-all duration-300 hover:scale-110"
      >
        <ArrowUp className="h-6 w-6 group-hover:translate-y-[-2px] transition-transform duration-300" />
      </Button>
    </div>
  );
}