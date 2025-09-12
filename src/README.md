# InmoPlus - Frontend Only

Este proyecto contiene únicamente la parte **visual y estética** de la aplicación InmoPlus, eliminando toda la funcionalidad de base de datos de Supabase.

## ✅ Lo que está incluido

### 🎨 Frontend Completo
- **React 18** con TypeScript
- **Tailwind CSS v4** con design system personalizado
- **ShadCN UI** - Sistema de componentes
- **Animaciones avanzadas** con Motion/React
- **Responsive design** completo
- **Modo oscuro** nativo

### 🏠 Componentes Principales
- ✅ **Header** - Navegación con efectos de scroll
- ✅ **Hero** - Sección principal con buscador
- ✅ **FeaturedProperties** - Propiedades destacadas (datos estáticos)
- ✅ **Services** - Servicios de la inmobiliaria  
- ✅ **About** - Información de la empresa
- ✅ **Contact** - Formulario de contacto (sin envío)
- ✅ **Footer** - Pie de página completo

### 🎯 Funcionalidades UX
- ✅ **Scroll Progress** - Indicador de progreso
- ✅ **Back to Top** - Botón volver arriba
- ✅ **Smooth Scrolling** - Navegación fluida
- ✅ **Toast Notifications** - Notificaciones Sonner
- ✅ **Animaciones de entrada** - useInView hook
- ✅ **Estados de carga** - Skeletons elegantes

## ❌ Lo que se eliminó

### 🗄️ Base de Datos
- ❌ Supabase Edge Functions
- ❌ Supabase Database
- ❌ API calls y endpoints
- ❌ Sistema de autenticación
- ❌ AdminDashboard
- ❌ CRUD de propiedades

### 📁 Archivos Limpiados
- `/utils/api.ts` - Solo interfaces, sin funciones
- `/utils/supabase/info.tsx` - Vacío
- `/supabase/` - Carpeta vaciada
- `/components/AdminDashboard.tsx` - Componente básico
- `/components/PropertySearch.tsx` - Componente básico

## 🚀 Cómo usar

### 1. Instalación
```bash
npm install
npm run dev
```

### 2. Conectar tu API Node.js

#### En `/components/Contact.tsx`:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  // TODO: Replace with your API
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};
```

#### En `/components/FeaturedProperties.tsx`:
```tsx
useEffect(() => {
  // TODO: Replace with your API
  const fetchProperties = async () => {
    const response = await fetch('/api/properties');
    const data = await response.json();
    setProperties(data);
  };
  fetchProperties();
}, []);
```

### 3. Datos Estáticos Incluidos
- **FeaturedProperties** usa 3 propiedades de ejemplo
- **Contact** simula envío de formulario
- **Hero** simula búsqueda
- Todas las imágenes vienen de Unsplash

## 🎨 Sistema de Diseño

### Colores Principales
```css
--primary: #030213;     /* Negro elegante */
--background: #ffffff;  /* Blanco */
--foreground: oklch(0.145 0 0); /* Texto principal */
```

### Animaciones
```css
.animate-fadeInUp { /* Entrada desde abajo */ }
.animate-fadeInScale { /* Entrada con escala */ }
.shimmer { /* Efecto de carga */ }
```

### Componentes ShadCN
- 45+ componentes UI disponibles en `/components/ui/`
- Botones, cards, dialogs, forms, etc.
- Totalmente customizados con Tailwind

## 📱 Responsive

- ✅ **Mobile First** design
- ✅ **Tablet** optimizado  
- ✅ **Desktop** completo
- ✅ **4K** compatible

## 🔧 Tecnologías

- **React 18** + TypeScript
- **Tailwind CSS v4** + Custom Properties
- **ShadCN UI** + Lucide Icons
- **Motion/React** para animaciones
- **Sonner** para notificaciones

## 📝 Próximos Pasos

1. **Conectar API**: Reemplazar datos estáticos con tu Node.js API
2. **Autenticación**: Implementar login si necesario
3. **Base de datos**: Conectar a tu MongoDB/PostgreSQL
4. **Deploy**: Subir a Vercel/Netlify
5. **SEO**: Añadir meta tags y OpenGraph

---

**¡El diseño está listo para producción!** Solo necesitas conectar tu backend Node.js.