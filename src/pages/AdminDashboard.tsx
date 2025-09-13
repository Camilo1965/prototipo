import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Key,
  Camera,
  Settings,
  LogOut,
  FileText,
  Globe,
  Shield,
  Search,
  Filter,
  Bell,
  MessageCircle,
  Archive
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useInView } from '../hooks/useInView';
import { useRouter } from '../hooks/useRouter';
import { toast } from 'sonner';
import { NewPropertyModal } from '../components/admin/NewPropertyModal';
import { AllPropertiesModal } from '../components/admin/AllPropertiesModal';
import { EmailMarketingModal } from '../components/admin/EmailMarketingModal';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DashboardStats {
  properties: {
    total: number;
    available: number;
    sold: number;
    totalViews: number;
  };
  inquiries: {
    total: number;
    pending: number;
    processed: number;
  };
  propertyTypeStats: { [key: string]: number };
}

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  condition: string;
  views: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}



export function AdminDashboard() {
  const { user, loading, signIn, signOut, getAccessToken } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [hasVisitedInquiries, setHasVisitedInquiries] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);
  const [isAllPropertiesModalOpen, setIsAllPropertiesModalOpen] = useState(false);
  const [isEmailMarketingModalOpen, setIsEmailMarketingModalOpen] = useState(false);
  
  // Estados para datos reales del backend
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [allInquiries, setAllInquiries] = useState<Inquiry[]>([]);
  const [inquiriesStats, setInquiriesStats] = useState({ total: 0, pending: 0, completed: 0, responded: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);

  const [propertyFilters, setPropertyFilters] = useState({
    search: '',
    status: 'todas',
    type: 'todos',
    agent: 'todos'
  });

  const [archivedInquiries, setArchivedInquiries] = useState<string[]>([]);
  const [deletedInquiries, setDeletedInquiries] = useState<string[]>([]);
  const { ref: dashboardRef, hasBeenInView } = useInView(0.1);
  const { navigateTo } = useRouter();

  // Cargar datos del dashboard cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      loadDashboardData();
      // Actualizar datos cada 30 segundos
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification
      if (Math.random() > 0.95) {
        toast.info('Nueva consulta recibida', {
          description: 'Un cliente está interesado en una propiedad'
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Función para cargar todos los datos del dashboard
  const loadDashboardData = async (isRetry = false) => {
    if (!user) return;
    setLoadError(false);
    try {
      setLoadingStats(true);
      const accessToken = await getAccessToken();
      // Cargar estadísticas del dashboard
      const statsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/simple/make-server-5b516b3d/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setDashboardStats(stats);
      } else {
        throw new Error('No stats');
      }
      // Cargar propiedades recientes
      const propertiesResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/simple/make-server-5b516b3d/properties?limit=5&sortBy=recent`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setRecentProperties(propertiesData.properties || []);
      }
      // Cargar todas las propiedades
      const allPropertiesResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/simple/make-server-5b516b3d/properties`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (allPropertiesResponse.ok) {
        const allPropertiesData = await allPropertiesResponse.json();
        setAllProperties(allPropertiesData.properties || []);
      }
      // Cargar consultas
      const inquiriesResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/simple/make-server-5b516b3d/inquiries`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (inquiriesResponse.ok) {
        const inquiriesData = await inquiriesResponse.json();
        const inquiries = inquiriesData.inquiries || [];
        setAllInquiries(inquiries);
        setRecentInquiries(inquiries.slice(0, 5));
      }
      setLoadingStats(false);
    } catch (error) {
      setLoadError(true);
      setLoadingStats(false);
      if (!isRetry) {
        // Reintentar automáticamente después de 4 segundos
        if (retryTimeout.current) clearTimeout(retryTimeout.current);
        retryTimeout.current = setTimeout(() => loadDashboardData(true), 4000);
      }
    }
  };

  // Función para formatear precios
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePropertyAction = (action: string, property?: any) => {
    switch (action) {
      case 'add':
        setIsNewPropertyModalOpen(true);
        break;
      case 'edit':
        setSelectedProperty(property);
        setIsModalOpen(true);
        break;
      case 'delete':
        toast.warning('Función de eliminar', {
          description: 'Confirmación de eliminación se mostraría aquí'
        });
        break;
      case 'activate':
        toast.success('Propiedad activada');
        break;
      case 'deactivate':
        toast.info('Propiedad desactivada');
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new_property':
        setIsNewPropertyModalOpen(true);
        break;
      case 'email_marketing':
        setIsEmailMarketingModalOpen(true);
        break;
      case 'view_all_properties':
        setActiveTab('properties');
        break;
      case 'view_all_inquiries':
        navigateTo('consultas');
        break;
      case 'analytics_report':
        toast.info('Generando reporte de analytics', {
          description: 'El reporte se descargará en unos momentos'
        });
        break;
      default:
        toast.info('Función en desarrollo');
        break;
    }
  };

  // Función para manejar acciones de consultas
  const handleInquiryAction = (action: string, inquiryId: string, clientName: string) => {
    switch (action) {
      case 'archive':
        setArchivedInquiries(prev => [...prev, inquiryId]);
        setInquiriesStats(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1)
        }));
        toast.success(`📥 Consulta de ${clientName} archivada`, {
          description: 'Movida a la sección de archivados',
          duration: 3000,
        });
        break;
      case 'delete':
        if (window.confirm(`¿Eliminar la consulta de ${clientName}?`)) {
          setDeletedInquiries(prev => [...prev, inquiryId]);
          setInquiriesStats(prev => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
            pending: Math.max(0, prev.pending - 1)
          }));
          toast.success(`🗑️ Consulta eliminada`, {
            description: `${clientName} eliminado correctamente`,
            duration: 3000,
          });
        }
        break;
      case 'respond':
        setInquiriesStats(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          responded: prev.responded + 1
        }));
        toast.success(`✏️ Preparando respuesta para ${clientName}`, {
          description: 'Redirigiendo al editor...',
          duration: 2000,
        });
        setTimeout(() => {
          navigateTo('consultas');
        }, 1000);
        break;
      default:
        toast.info('Acción en desarrollo');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activa':
        return 'bg-green-500';
      case 'vendida':
        return 'bg-blue-500';
      case 'pendiente':
        return 'bg-yellow-500';
      case 'inactiva':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(loginForm.email, loginForm.password);
      toast.success('Acceso autorizado al panel de administración');
    } catch (error) {
      toast.error('Credenciales incorrectas');
    }
  };

  // Mostrar pantalla de login si no está autenticado
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <p className="text-slate-600">Acceso restringido - Credenciales requeridas</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Acceder al Panel
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Credenciales de demostración:</p>
              <p className="text-xs text-blue-600">Email: admin@inmoplus.com</p>
              <p className="text-xs text-blue-600">Contraseña: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={dashboardRef as React.RefObject<HTMLDivElement>} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/15 to-purple-500/20 -z-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className={`transition-all duration-1000 ${
              hasBeenInView ? 'animate-in slide-in-from-left-4 fade-in' : 'opacity-0 translate-x-4'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                    Panel de Administración
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
                    Gestiona propiedades, clientes y ventas con control total
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-4 transition-all duration-1000 delay-200 ${
              hasBeenInView ? 'animate-in slide-in-from-right-4 fade-in' : 'opacity-0 translate-x-4'
            }`}>
              <Button variant="outline" size="sm" className="relative hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl backdrop-blur-sm border-2 hover:border-primary/50 group">
                <Bell className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Notificaciones
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              </Button>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl backdrop-blur-sm border-2 hover:border-primary/50 group">
                <Settings className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Configuración
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl backdrop-blur-sm border-2 hover:border-red-300 hover:text-red-600 group"
                onClick={async () => {
                  try {
                    await signOut();
                    toast.success('Sesión cerrada exitosamente');
                    navigateTo('inicio');
                  } catch (error) {
                    toast.error('Error cerrando sesión');
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(value: string) => {
          setActiveTab(value);
          if (value === 'inquiries' && !hasVisitedInquiries) {
            setHasVisitedInquiries(true);
            toast.success('¡Nueva función disponible!', {
              description: 'Ahora puedes gestionar todas las consultas desde aquí.',
              icon: '✨',
              duration: 4000,
            });
          }
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 shadow-lg rounded-xl border-2 border-slate-200/50 dark:border-slate-600/50">
            <TabsTrigger value="overview" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30">
              <BarChart3 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30">
              <Home className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">Propiedades</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30">
              <Users className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30 group">
              <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 text-blue-600" />
              <span className="text-sm font-medium">Consultas</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30">
              <TrendingUp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30">
              <Globe className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col gap-2 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-blue-500/10 data-[state=active]:shadow-lg data-[state=active]:border-primary/30">
              <FileText className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">Reportes</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${
              hasBeenInView ? 'animate-in fade-in' : 'opacity-0'
            }`}>
              {loadingStats ? (
                <div className="col-span-4 flex flex-col items-center justify-center py-12 animate-pulse">
                  <div className="mb-6 flex flex-col items-center">
                    <BarChart3 className="h-12 w-12 text-blue-400 animate-bounce mb-2" />
                    <span className="text-lg font-semibold text-blue-700 animate-pulse">Cargando resumen del panel...</span>
                    <span className="text-sm text-gray-500 mt-1">Esto puede tardar unos segundos si el servidor está en frío.</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
                              <div className="h-8 bg-blue-200 rounded animate-pulse"></div>
                              <div className="h-4 bg-blue-100 rounded animate-pulse w-20"></div>
                            </div>
                            <div className="h-8 w-8 bg-blue-200 rounded animate-pulse"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : loadError ? (
                <div className="col-span-4 flex flex-col items-center justify-center py-12 animate-fade-in">
                  <AlertCircle className="h-12 w-12 text-red-400 mb-2 animate-bounce" />
                  <span className="text-lg font-semibold text-red-700">No se pudo cargar el resumen</span>
                  <span className="text-sm text-gray-500 mt-1">Reintentando automáticamente...</span>
                  <Button onClick={() => loadDashboardData(false)} className="mt-4">Reintentar ahora</Button>
                </div>
              ) : dashboardStats ? (
                [
                  {
                    title: 'Propiedades Totales',
                    value: dashboardStats.properties?.total?.toString() || "0",
                    change: `${dashboardStats.properties?.available || 0} disponibles`,
                    trend: 'up',
                    icon: Home,
                    color: 'text-blue-500'
                  },
                  {
                    title: 'Propiedades Vendidas',
                    value: dashboardStats.properties?.sold?.toString() || "0",
                    change: `de ${dashboardStats.properties?.total || 0} totales`,
                    trend: 'up',
                    icon: DollarSign,
                    color: 'text-green-500'
                  },
                  {
                    title: 'Consultas Totales',
                    value: dashboardStats.inquiries?.total?.toString() || "0",
                    change: `${dashboardStats.inquiries?.pending || 0} pendientes`,
                    trend: 'up',
                    icon: MessageCircle,
                    color: 'text-purple-500'
                  },
                  {
                    title: 'Vistas Totales',
                    value: dashboardStats.properties?.totalViews?.toString() || "0",
                    change: 'en todas las propiedades',
                    trend: 'up',
                    icon: Eye,
                    color: 'text-yellow-500'
                  }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-gray-500">
                              {stat.change}
                            </p>
                          </div>
                          <IconComponent className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                // Fallback state para cuando no hay datos pero tampoco hay error
                [
                  {
                    title: 'Propiedades Totales',
                    value: "0",
                    change: "0 disponibles",
                    trend: 'up',
                    icon: Home,
                    color: 'text-blue-500'
                  },
                  {
                    title: 'Propiedades Vendidas',
                    value: "0",
                    change: "de 0 totales",
                    trend: 'up',
                    icon: DollarSign,
                    color: 'text-green-500'
                  },
                  {
                    title: 'Consultas Totales',
                    value: "0",
                    change: "0 pendientes",
                    trend: 'up',
                    icon: MessageCircle,
                    color: 'text-purple-500'
                  },
                  {
                    title: 'Vistas Totales',
                    value: "0",
                    change: 'en todas las propiedades',
                    trend: 'up',
                    icon: Eye,
                    color: 'text-yellow-500'
                  }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-gray-500">
                              {stat.change}
                            </p>
                            <Button onClick={loadDashboardData} size="sm" variant="link" className="p-0 h-auto text-xs text-primary mt-1">
                              Cargar datos
                            </Button>
                          </div>
                          <IconComponent className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Quick Actions */}
            <div className={`transition-all duration-1000 delay-500 ${
              hasBeenInView ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0 translate-y-4'
            }`}>
              <Card className="shadow-xl border-2 border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                  <CardTitle className="flex items-center text-2xl font-bold">
                    <Activity className="h-6 w-6 mr-3 text-primary" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Button 
                      onClick={() => handleQuickAction('new_property')} 
                      className="h-24 flex flex-col hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 group"
                    >
                      <Plus className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-base font-semibold">Nueva Propiedad</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl border-2 hover:border-primary/50 backdrop-blur-sm group" 
                      onClick={() => handleQuickAction('email_marketing')}
                    >
                      <Mail className="h-8 w-8 mb-3 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-base font-semibold">Email Marketing</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl border-2 hover:border-primary/50 backdrop-blur-sm group" 
                      onClick={() => handleQuickAction('view_all_inquiries')}
                    >
                      <MessageCircle className="h-8 w-8 mb-3 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-base font-semibold">Gestionar Consultas</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl border-2 hover:border-primary/50 backdrop-blur-sm group" 
                      onClick={() => handleQuickAction('analytics_report')}
                    >
                      <BarChart3 className="h-8 w-8 mb-3 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-base font-semibold">Reporte Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Properties */}
              <Card className={`transition-all duration-1000 delay-700 ${
                hasBeenInView ? 'animate-in slide-in-from-left-4 fade-in' : 'opacity-0 translate-x-4'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Home className="h-5 w-5 mr-2" />
                      Propiedades Recientes
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleQuickAction('view_all_properties')}>
                      Ver todas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingStats ? (
                      // Loading skeleton
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                          </div>
                        </div>
                      ))
                    ) : recentProperties.length > 0 ? (
                      recentProperties.map((property) => (
                        <div key={property.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <ImageWithFallback
                            src={property.images?.[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100'}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{property.title}</p>
                            <p className="text-xs text-gray-500">{property.location}</p>
                            <p className="text-xs text-gray-600">{property.views || 0} vistas</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatPrice(property.price)}</p>
                            <Badge className={`text-xs text-white ${getStatusColor(property.status)}`}>
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Home className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No hay propiedades recientes</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setIsNewPropertyModalOpen(true)}
                        >
                          Crear Primera Propiedad
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Leads */}
              <Card className={`transition-all duration-1000 delay-900 ${
                hasBeenInView ? 'animate-in slide-in-from-right-4 fade-in' : 'opacity-0 translate-x-4'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Consultas Recientes
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleQuickAction('view_all_inquiries')}>Ver todas</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingStats ? (
                      // Loading skeleton
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="p-3 rounded-lg space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                          <div className="flex items-center justify-between">
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="flex space-x-1">
                              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : recentInquiries.length > 0 ? (
                      recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">{inquiry.name}</p>
                            <Badge className={`text-xs ${inquiry.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 truncate">{inquiry.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                            <div className="flex space-x-1">
                              {inquiry.phone && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => window.open(`tel:${inquiry.phone}`)}
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => window.open(`mailto:${inquiry.email}`)}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No hay consultas recientes</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>Gestión de Propiedades</CardTitle>
                  <Button onClick={() => handlePropertyAction('add')} className="hover:scale-105 transition-transform duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Propiedad
                  </Button>
                </div>
                
                {/* Filtros mejorados */}
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar por título, ubicación o descripción..."
                        className="pl-10"
                        value={propertyFilters.search}
                        onChange={(e) => setPropertyFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={propertyFilters.status} onValueChange={(value: string) => setPropertyFilters(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          <SelectItem value="activa">Activa</SelectItem>
                          <SelectItem value="vendida">Vendida</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="inactiva">Inactiva</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={propertyFilters.type} onValueChange={(value: string) => setPropertyFilters(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="apartamento">Apartamento</SelectItem>
                          <SelectItem value="chalet">Chalet</SelectItem>
                          <SelectItem value="ático">Ático</SelectItem>
                          <SelectItem value="oficina">Oficina</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={propertyFilters.agent} onValueChange={(value: string) => setPropertyFilters(prev => ({ ...prev, agent: value }))}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Agente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="ana-garcia">Ana García</SelectItem>
                          <SelectItem value="carlos-ruiz">Carlos Ruiz</SelectItem>
                          <SelectItem value="maria-lopez">María López</SelectItem>
                          <SelectItem value="david-martin">David Martín</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propiedad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Vistas</TableHead>
                      <TableHead>Agente</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingStats ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                            </div>
                          </TableCell>
                          <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                          <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : allProperties.length > 0 ? (
                      allProperties
                        .filter(property => {
                          // Aplicar filtros locales
                          if (propertyFilters.search && !property.title.toLowerCase().includes(propertyFilters.search.toLowerCase()) && 
                              !property.location.toLowerCase().includes(propertyFilters.search.toLowerCase())) {
                            return false;
                          }
                          if (propertyFilters.status !== 'todas' && property.status !== propertyFilters.status) {
                            return false;
                          }
                          if (propertyFilters.type !== 'todos' && property.type !== propertyFilters.type) {
                            return false;
                          }
                          return true;
                        })
                        .map((property) => (
                          <TableRow key={property.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <ImageWithFallback
                                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100'}
                                  alt={property.title}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <span className="font-medium">{property.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatPrice(property.price)}</TableCell>
                            <TableCell>{property.location}</TableCell>
                            <TableCell>
                              <Badge className={`text-white ${getStatusColor(property.status)}`}>
                                {property.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{property.views || 0}</TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-500">Admin</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" onClick={() => handlePropertyAction('edit', property)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handlePropertyAction('delete', property)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Home className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No hay propiedades disponibles</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setIsNewPropertyModalOpen(true)}
                          >
                            Crear Primera Propiedad
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Clientes y Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Interés</TableHead>
                      <TableHead>Propiedad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingStats ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                            </div>
                          </TableCell>
                          <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                          <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                          <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div></TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : allInquiries.length > 0 ? (
                      allInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{inquiry.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <p>{inquiry.email}</p>
                              {inquiry.phone && <p>{inquiry.phone}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm truncate max-w-32 block">{inquiry.message}</span>
                          </TableCell>
                          <TableCell>
                            {inquiry.propertyId ? (
                              <span className="text-xs text-gray-500">Propiedad #{inquiry.propertyId.slice(0, 8)}</span>
                            ) : (
                              <span className="text-xs text-gray-400">General</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={inquiry.status === 'Pendiente' ? 'border-yellow-500 text-yellow-600' : 'border-green-500 text-green-600'}>
                              {inquiry.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              Normal
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {inquiry.phone && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => window.open(`tel:${inquiry.phone}`)}
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => window.open(`mailto:${inquiry.email}`)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigateTo('consultas')}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No hay consultas disponibles</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardStats ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{dashboardStats.properties.total}</p>
                          <p className="text-sm text-gray-600">Total Propiedades</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{dashboardStats.properties.sold}</p>
                          <p className="text-sm text-gray-600">Vendidas</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Distribución por Tipo</h4>
                        <div className="space-y-2">
                          {Object.entries(dashboardStats.propertyTypeStats).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{type}</span>
                              <div className="flex-1 mx-4">
                                <Progress 
                                  value={(count / dashboardStats.properties.total) * 100} 
                                  className="h-2" 
                                />
                              </div>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Cargando analytics...</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tasa de conversión</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tiempo promedio de venta</span>
                        <span>68 días</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Satisfacción del cliente</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campañas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-2">8</div>
                  <p className="text-sm text-gray-600">Campañas en ejecución</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leads Generados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-2">156</div>
                  <p className="text-sm text-gray-600">Este mes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ROI Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-2">340%</div>
                  <p className="text-sm text-gray-600">Retorno de inversión</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Herramientas de Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Mail className="h-6 w-6 mb-2" />
                    Email Campaign
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Globe className="h-6 w-6 mb-2" />
                    SEO Tools
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Camera className="h-6 w-6 mb-2" />
                    Virtual Tours
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generador de Reportes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    Reporte de Ventas
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    Reporte de Clientes
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center">
                    <Home className="h-6 w-6 mb-2" />
                    Inventario
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Performance
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Finanzas
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    Cronograma
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab - NEW */}
          <TabsContent value="inquiries" className="space-y-8">
            {/* Header Section */}
            <div className={`relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/20 rounded-2xl border-2 border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-1000 delay-300 ${
              hasBeenInView ? 'animate-in fade-in slide-in-from-top-3' : 'opacity-0 translate-y-4'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5" />
              <div className="relative p-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative p-5 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl shadow-xl ring-1 ring-primary/10 hover:scale-105 transition-all duration-300 group animate-float">
                      <MessageCircle className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300 animate-pulse-soft" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                        Consultas Recientes
                      </h2>
                      <p className="text-xl text-slate-600 dark:text-slate-300 mt-2">
                        Gestiona las consultas más recientes de tus clientes
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigateTo('consultas')}
                    className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl h-14 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg group"
                  >
                    <Eye className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Ver todas las consultas
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {loadingStats ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="relative border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-7 w-7 bg-gray-200 rounded animate-pulse mr-3"></div>
                        <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))
              ) : dashboardStats ? (
                [
                  { value: dashboardStats.inquiries.total, label: 'Total Consultas', color: 'text-primary', gradient: 'from-primary/10 via-primary/5 to-blue-500/10', icon: MessageCircle, hoverGradient: 'from-primary/20 via-blue-500/15 to-purple-500/10' },
                  { value: dashboardStats.inquiries.pending, label: 'Pendientes', color: 'text-yellow-600', gradient: 'from-yellow-500/10 via-yellow-400/5 to-orange-500/10', icon: Clock, hoverGradient: 'from-yellow-500/20 via-yellow-400/15 to-orange-500/10' },
                  { value: dashboardStats.inquiries.processed, label: 'Procesadas', color: 'text-green-600', gradient: 'from-green-500/10 via-green-400/5 to-emerald-500/10', icon: CheckCircle, hoverGradient: 'from-green-500/20 via-green-400/15 to-emerald-500/10' },
                  { value: dashboardStats.properties.totalViews, label: 'Vistas Propiedades', color: 'text-blue-600', gradient: 'from-blue-500/10 via-blue-400/5 to-indigo-500/10', icon: Eye, hoverGradient: 'from-blue-500/20 via-blue-400/15 to-indigo-500/10' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card 
                      key={stat.label}
                      className={`relative border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group cursor-pointer overflow-hidden rounded-2xl transition-all duration-1000 delay-500 ${
                        hasBeenInView ? 'animate-in fade-in slide-in-from-bottom-3' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ animationDelay: `${500 + index * 100}ms` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-100 transition-all duration-300`} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.hoverGradient} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                      
                      <CardContent className="relative z-10 p-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <Icon className={`h-7 w-7 ${stat.color} mr-3 group-hover:scale-110 transition-transform duration-300`} />
                          <div className={`text-4xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-lg text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-4 text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Error cargando estadísticas</p>
                </div>
              )}
            </div>

            {/* Recent Inquiries List */}
            <div className={`space-y-6 transition-all duration-1000 delay-700 ${
              hasBeenInView ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0 translate-y-4'
            }`}>
              {loadingStats ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-8">
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex items-start space-x-6 flex-1">
                        <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : allInquiries.length > 0 ? (
                allInquiries.slice(0, 3).map((inquiry, index) => {
                const getStatusColor = (status: string) => {
                  switch (status.toLowerCase()) {
                    case 'pendiente':
                      return 'bg-gradient-to-r from-yellow-500 to-orange-500';
                    case 'procesada':
                      return 'bg-gradient-to-r from-green-500 to-emerald-500';
                    case 'en proceso':
                      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
                    default:
                      return 'bg-gradient-to-r from-gray-500 to-slate-500';
                  }
                };

                return (
                  <Card 
                    key={inquiry.id} 
                    className={`group hover:shadow-2xl transition-all duration-500 border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 rounded-2xl overflow-hidden hover:scale-[1.01] hover:-translate-y-2 shadow-lg transition-all duration-1000 ${
                      hasBeenInView ? 'animate-in fade-in slide-in-from-left-3' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ animationDelay: `${800 + index * 150}ms` }}
                  >
                    <CardContent className="p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 flex items-start justify-between gap-8">
                        {/* Client Info */}
                        <div className="flex items-start space-x-6 flex-1">
                          <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl font-bold text-primary">
                              {inquiry.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-4">
                            <div className="flex items-center gap-4">
                              <h4 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                                {inquiry.name}
                              </h4>
                              <Badge className={`text-sm font-semibold text-white px-3 py-1 rounded-full border-0 ${getStatusColor(inquiry.status)} group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                                {inquiry.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Mail className="h-4 w-4 mr-2 text-primary" />
                                <span className="truncate">{inquiry.email}</span>
                              </div>
                              {inquiry.phone && (
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                  <Phone className="h-4 w-4 mr-2 text-primary" />
                                  <span>{inquiry.phone}</span>
                                </div>
                              )}
                            </div>

                            {/* Property Info */}
                            {inquiry.propertyId && (
                              <Card className="p-4 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 group-hover:border-primary/30 transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                  <Home className="h-4 w-4 text-primary" />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors duration-300">
                                      Propiedad #{inquiry.propertyId.slice(0, 8)}
                                    </h5>
                                  </div>
                                </div>
                              </Card>
                            )}

                            {/* Message Preview */}
                            <div className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                                {inquiry.message}
                              </p>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(inquiry.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3 flex-shrink-0">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              toast.success(`📋 Abriendo detalles de ${inquiry.name}`, {
                                description: 'Cargando información completa...',
                                duration: 2000,
                              });
                              setTimeout(() => {
                                navigateTo('consultas');
                              }, 1000);
                            }}
                            className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalle
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleInquiryAction('respond', inquiry.id, inquiry.name)}
                            className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg h-10"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Responder
                          </Button>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleInquiryAction('archive', inquiry.id, inquiry.name)}
                              disabled={archivedInquiries.includes(inquiry.id)}
                              className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-yellow-400 hover:text-yellow-600 shadow-lg h-10 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Archivar consulta"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleInquiryAction('delete', inquiry.id, inquiry.name)}
                              disabled={deletedInquiries.includes(inquiry.id)}
                              className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-red-300 hover:text-red-600 shadow-lg h-10 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Eliminar consulta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
              ) : (
                <Card className="p-12 text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay consultas disponibles</h3>
                  <p className="text-gray-500">Las consultas de clientes aparecerán aquí una vez que lleguen.</p>
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex justify-center pt-8 transition-all duration-1000 delay-1000 ${
              hasBeenInView ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex space-x-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    toast.info('🔍 Abriendo filtros avanzados', {
                      description: 'Redirigiendo a la página completa de consultas...',
                      duration: 2000,
                    });
                    setTimeout(() => {
                      navigateTo('consultas');
                    }, 1000);
                  }}
                  className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl px-8 py-4 text-lg group"
                >
                  <Filter className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Filtrar consultas
                </Button>
                <Button 
                  onClick={() => navigateTo('consultas')}
                  size="lg"
                  className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg group"
                >
                  <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Gestionar todas las consultas
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Property Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Propiedad</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la propiedad seleccionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Título</label>
                <Input defaultValue={selectedProperty.title} />
              </div>
              <div>
                <label className="block text-sm mb-2">Precio</label>
                <Input defaultValue={selectedProperty.price} />
              </div>
              <div>
                <label className="block text-sm mb-2">Ubicación</label>
                <Input defaultValue={selectedProperty.location} />
              </div>
              <div>
                <label className="block text-sm mb-2">Estado</label>
                <Select defaultValue={selectedProperty.status.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="vendida">Vendida</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Descripción</label>
                <Textarea rows={3} />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsModalOpen(false);
              toast.success('Propiedad actualizada correctamente');
            }}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Property Modal */}
      <NewPropertyModal
        isOpen={isNewPropertyModalOpen}
        onClose={() => setIsNewPropertyModalOpen(false)}
        onPropertyCreated={() => {
          loadDashboardData();
          toast.success('Propiedad creada exitosamente');
        }}
      />

      {/* All Properties Modal */}
      <AllPropertiesModal
        isOpen={isAllPropertiesModalOpen}
        onClose={() => setIsAllPropertiesModalOpen(false)}
      />

      {/* Email Marketing Modal */}
      <EmailMarketingModal
        isOpen={isEmailMarketingModalOpen}
        onClose={() => setIsEmailMarketingModalOpen(false)}
      />


    </div>
  );
}