import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  User,
  MapPin,
  Star,
  Reply,
  Archive,
  Trash2,
  Calendar,
  X,
  SortAsc,
  SortDesc,
  Building,
  AlertCircle,
  CheckCircle2,
  Timer,
  TrendingUp,
  FileText,
  Send,
  ArrowLeft,
  Eye,
  Edit3,
  Sparkles,
  Activity,
  BarChart3,
  Zap,
  Target,
  Home
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useRouter } from '../hooks/useRouter';

interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyTitle: string;
  propertyImage: string;
  inquiryType: string;
  message: string;
  status: string;
  priority: string;
  dateCreated: string;
  lastResponse: string;
  responseTime: number; // hours
  agent: string;
  source: string;
  budget: string;
  location: string;
}

// Mock data
const allInquiries: Inquiry[] = [
  {
    id: '1',
    clientName: 'María González',
    clientEmail: 'maria.gonzalez@email.com',
    clientPhone: '+57 300 123 4567',
    propertyTitle: 'Casa Moderna en Centro',
    propertyImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100',
    inquiryType: 'Visita',
    message: 'Me interesa mucho esta propiedad. ¿Podríamos agendar una visita para este fin de semana? Me gustaría conocer más detalles sobre el inmueble y la zona.',
    status: 'Pendiente',
    priority: 'Alta',
    dateCreated: '2024-01-15T10:30:00',
    lastResponse: '2024-01-15T14:20:00',
    responseTime: 4,
    agent: 'Ana García',
    source: 'Web',
    budget: 'COP $300,000,000 - $400,000,000',
    location: 'Madrid Centro'
  },
  {
    id: '2',
    clientName: 'Carlos Rodríguez',
    clientEmail: 'carlos.rodriguez@email.com',
    clientPhone: '+57 301 234 5678',
    propertyTitle: 'Apartamento Lujoso Salamanca',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100',
    inquiryType: 'Información',
    message: 'Quisiera más información sobre los gastos adicionales, el proceso de compra y las opciones de financiación disponibles para esta propiedad.',
    status: 'Respondida',
    priority: 'Media',
    dateCreated: '2024-01-14T15:45:00',
    lastResponse: '2024-01-14T16:30:00',
    responseTime: 1,
    agent: 'Carlos Ruiz',
    source: 'Teléfono',
    budget: 'COP $400,000,000 - $500,000,000',
    location: 'Salamanca'
  },
  {
    id: '3',
    clientName: 'Laura Martínez',
    clientEmail: 'laura.martinez@email.com',
    clientPhone: '+57 302 345 6789',
    propertyTitle: 'Villa con Jardín Las Rozas',
    propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100',
    inquiryType: 'Negociación',
    message: 'Estoy muy interesada en la propiedad. ¿Hay posibilidad de negociar el precio? Me gustaría hacer una oferta formal si es posible.',
    status: 'En proceso',
    priority: 'Alta',
    dateCreated: '2024-01-13T09:15:00',
    lastResponse: '2024-01-14T11:00:00',
    responseTime: 26,
    agent: 'María López',
    source: 'Referido',
    budget: 'COP $600,000,000 - $800,000,000',
    location: 'Las Rozas'
  },
  {
    id: '4',
    clientName: 'Andrés Silva',
    clientEmail: 'andres.silva@email.com',
    clientPhone: '+57 303 456 7890',
    propertyTitle: 'Ático con Terraza Retiro',
    propertyImage: 'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=100',
    inquiryType: 'Financiación',
    message: '¿Qué opciones de financiación tienen disponibles? Necesito información sobre créditos hipotecarios y requisitos para el proceso.',
    status: 'Pendiente',
    priority: 'Media',
    dateCreated: '2024-01-12T16:20:00',
    lastResponse: '',
    responseTime: 0,
    agent: 'David Martín',
    source: 'Social Media',
    budget: 'COP $800,000,000+',
    location: 'Retiro'
  },
  {
    id: '5',
    clientName: 'Patricia Jiménez',
    clientEmail: 'patricia.jimenez@email.com',
    clientPhone: '+57 304 567 8901',
    propertyTitle: 'Casa Familiar Pozuelo',
    propertyImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100',
    inquiryType: 'Visita',
    message: 'Buenos días, me gustaría agendar una cita para ver la propiedad entre semana si es posible. Estoy disponible por las tardes.',
    status: 'Archivada',
    priority: 'Baja',
    dateCreated: '2024-01-10T12:00:00',
    lastResponse: '2024-01-11T10:30:00',
    responseTime: 22,
    agent: 'Ana García',
    source: 'Web',
    budget: 'COP $500,000,000 - $600,000,000',
    location: 'Pozuelo'
  },
  {
    id: '6',
    clientName: 'Roberto Fernández',
    clientEmail: 'roberto.fernandez@email.com',
    clientPhone: '+57 305 678 9012',
    propertyTitle: 'Oficina Moderna Chamberí',
    propertyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100',
    inquiryType: 'Información',
    message: 'Estoy buscando una oficina para mi empresa. ¿Podrían enviarme más detalles sobre servicios incluidos y disponibilidad?',
    status: 'Respondida',
    priority: 'Media',
    dateCreated: '2024-01-09T14:30:00',
    lastResponse: '2024-01-09T16:45:00',
    responseTime: 2,
    agent: 'Carlos Ruiz',
    source: 'Email',
    budget: 'COP $200,000,000 - $300,000,000',
    location: 'Chamberí'
  }
];

const inquiryTypes = ['Todas', 'Visita', 'Información', 'Negociación', 'Financiación'];
const statusOptions = ['Todos', 'Pendiente', 'Respondida', 'En proceso', 'Archivada'];
const priorityOptions = ['Todas', 'Alta', 'Media', 'Baja'];
const agents = ['Todos', 'Ana García', 'Carlos Ruiz', 'María López', 'David Martín'];
const sources = ['Todas', 'Web', 'Teléfono', 'Referido', 'Social Media', 'Email'];

export function InquiriesPage() {
  const { navigateTo } = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>(allInquiries);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>(allInquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'reply'>('list');
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  // Debug: Mostrar toast de inicialización
  useEffect(() => {
    console.log('🚀 InquiriesPage inicializada con', allInquiries.length, 'consultas');
    toast.info('📋 Página de consultas cargada', {
      description: `${allInquiries.length} consultas encontradas`,
      duration: 2000,
    });
  }, []);
  
  const [filters, setFilters] = useState({
    type: 'Todas',
    status: 'Todos',
    priority: 'Todas',
    agent: 'Todos',
    source: 'Todas'
  });

  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...inquiries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inquiry => 
        inquiry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'Todas') {
      filtered = filtered.filter(inquiry => inquiry.inquiryType === filters.type);
    }

    // Status filter
    if (filters.status !== 'Todos') {
      filtered = filtered.filter(inquiry => inquiry.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'Todas') {
      filtered = filtered.filter(inquiry => inquiry.priority === filters.priority);
    }

    // Agent filter
    if (filters.agent !== 'Todos') {
      filtered = filtered.filter(inquiry => inquiry.agent === filters.agent);
    }

    // Source filter
    if (filters.source !== 'Todas') {
      filtered = filtered.filter(inquiry => inquiry.source === filters.source);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case 'priority':
          const priorityOrder = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
                     (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
          break;
        case 'responseTime':
          comparison = a.responseTime - b.responseTime;
          break;
        case 'recent':
        default:
          comparison = new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, filters, sortBy, sortOrder]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    toast.info(`🔍 Filtro aplicado: ${key} = ${value}`, {
      duration: 2000,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: 'Todas',
      status: 'Todos',
      priority: 'Todas',
      agent: 'Todos',
      source: 'Todas'
    });
    setSearchTerm('');
    toast.success('🔄 Filtros restablecidos', {
      description: 'Mostrando todas las consultas',
      duration: 3000,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'respondida':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'en proceso':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'archivada':
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'text-red-600 bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:text-red-400 dark:from-red-950 dark:to-red-900 dark:border-red-800';
      case 'media':
        return 'text-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:text-yellow-400 dark:from-yellow-950 dark:to-yellow-900 dark:border-yellow-800';
      case 'baja':
        return 'text-green-600 bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:text-green-400 dark:from-green-950 dark:to-green-900 dark:border-green-800';
      default:
        return 'text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:text-gray-400 dark:from-gray-950 dark:to-gray-900 dark:border-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResponseTimeStatus = (hours: number) => {
    if (hours === 0) return { text: 'Sin respuesta', color: 'text-red-500', icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-950/20' };
    if (hours <= 2) return { text: 'Excelente', color: 'text-green-500', icon: CheckCircle2, bg: 'bg-green-50 dark:bg-green-950/20' };
    if (hours <= 24) return { text: 'Bueno', color: 'text-yellow-500', icon: Timer, bg: 'bg-yellow-50 dark:bg-yellow-950/20' };
    return { text: 'Tardío', color: 'text-red-500', icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-950/20' };
  };

  const handleViewChange = (newView: 'list' | 'detail' | 'reply', inquiry?: Inquiry) => {
    console.log(`Cambiando vista a: ${newView}`, inquiry ? `para ${inquiry.clientName}` : '');
    setIsAnimating(true);
    
    // Toast de feedback inmediato
    if (newView === 'detail' && inquiry) {
      toast.loading('📋 Cargando detalles...', { id: 'view-change', duration: 1000 });
    } else if (newView === 'reply' && inquiry) {
      toast.loading('✏️ Preparando respuesta...', { id: 'view-change', duration: 1000 });
    } else if (newView === 'list') {
      toast.loading('📝 Volviendo a la lista...', { id: 'view-change', duration: 1000 });
    }
    
    setTimeout(() => {
      setCurrentView(newView);
      if (inquiry) setSelectedInquiry(inquiry);
      if (newView === 'reply') setResponseText('');
      setIsAnimating(false);
      
      // Toast de confirmación
      setTimeout(() => {
        if (newView === 'detail' && inquiry) {
          toast.success(`📋 Detalles cargados para ${inquiry.clientName}`, { id: 'view-change' });
        } else if (newView === 'reply' && inquiry) {
          toast.success(`✏️ Editor listo para responder a ${inquiry.clientName}`, { id: 'view-change' });
        } else if (newView === 'list') {
          toast.success('📝 Lista de consultas actualizada', { id: 'view-change' });
        }
      }, 100);
    }, 300);
  };

  const handleInquiryAction = (action: string, inquiryId: string) => {
    console.log(`🚀 Ejecutando acción: ${action} para consulta ID: ${inquiryId}`);
    
    // Log del estado actual
    console.log('Estado actual inquiries:', inquiries.length);
    console.log('Estado actual currentView:', currentView);
    
    const inquiry = inquiries.find(i => i.id === inquiryId);
    
    if (!inquiry) {
      console.error('❌ Consulta no encontrada:', inquiryId);
      toast.error('❌ Error: Consulta no encontrada', {
        description: `No se pudo encontrar la consulta con ID: ${inquiryId}`,
        duration: 3000,
      });
      return;
    }
    
    console.log('✅ Consulta encontrada:', inquiry.clientName);
    
    try {
      switch (action) {
        case 'reply':
          console.log('📝 Iniciando respuesta para:', inquiry.clientName);
          setSelectedInquiry(inquiry);
          setCurrentView('reply');
          setResponseText('');
          toast.success(`✏️ Editor de respuesta abierto para ${inquiry.clientName}`, {
            description: 'Ya puedes escribir tu respuesta',
            duration: 3000,
          });
          break;
          
        case 'view':
          console.log('👁️ Viendo detalles para:', inquiry.clientName);
          setSelectedInquiry(inquiry);
          setCurrentView('detail');
          toast.success(`👁️ Mostrando detalles de ${inquiry.clientName}`, {
            description: 'Información completa cargada',
            duration: 2000,
          });
          break;
          
        case 'archive':
          console.log('📥 Archivando consulta:', inquiry.clientName);
          setInquiries(prev => {
            const updated = prev.map(i => i.id === inquiryId ? { ...i, status: 'Archivada' } : i);
            console.log('Inquiries after archive:', updated.find(u => u.id === inquiryId)?.status);
            return updated;
          });
          toast.success(`✅ Consulta archivada`, {
            description: `${inquiry.clientName} movido a archivados`,
            duration: 4000,
          });
          break;
          
        case 'delete':
          console.log('🗑️ Intentando eliminar consulta:', inquiry.clientName);
          const confirmed = window.confirm(
            `¿Eliminar la consulta de ${inquiry.clientName}?\n\n` + 
            `Esta acción no se puede deshacer.`
          );
          
          if (confirmed) {
            console.log('✅ Eliminación confirmada');
            setInquiries(prev => {
              const filtered = prev.filter(i => i.id !== inquiryId);
              console.log('Inquiries after delete:', filtered.length);
              return filtered;
            });
            toast.success(`🗑️ Consulta eliminada`, {
              description: `${inquiry.clientName} eliminado permanentemente`,
              duration: 4000,
            });
          } else {
            console.log('❌ Eliminación cancelada');
            toast.info('Eliminación cancelada', {
              description: 'La consulta no se ha eliminado',
              duration: 2000,
            });
          }
          break;
          
        default:
          console.log('⚠️ Acción no reconocida:', action);
          toast.warning('🚧 Acción en desarrollo', { 
            description: `La acción "${action}" aún no está implementada`,
            duration: 3000,
          });
      }
    } catch (error) {
      console.error('❌ Error ejecutando acción:', error);
      toast.error('❌ Error ejecutando acción', {
        description: 'Por favor intenta de nuevo',
        duration: 3000,
      });
    }
  };

  const handleSendResponse = () => {
    if (!selectedInquiry || !responseText.trim()) {
      toast.error('⚠️ Por favor escribe una respuesta antes de enviar', {
        description: 'El campo de respuesta no puede estar vacío',
        duration: 3000,
      });
      return;
    }

    if (responseText.trim().length < 10) {
      toast.error('⚠️ La respuesta es muy corta', {
        description: 'Por favor escribe una respuesta más detallada (mínimo 10 caracteres)',
        duration: 3000,
      });
      return;
    }

    setIsAnimating(true);
    
    // Simular envío con delay realista
    setTimeout(() => {
      // Update inquiry status
      setInquiries(prev => 
        prev.map(i => 
          i.id === selectedInquiry.id 
            ? { 
                ...i, 
                status: 'Respondida', 
                lastResponse: new Date().toISOString(),
                responseTime: Math.round((new Date().getTime() - new Date(i.dateCreated).getTime()) / (1000 * 60 * 60))
              } 
            : i
        )
      );

      toast.success(`✅ Respuesta enviada exitosamente a ${selectedInquiry.clientName}`, {
        description: `Email enviado a ${selectedInquiry.clientEmail}`,
        icon: '📧',
        duration: 5000,
      });
      
      // Volver a la lista después de un momento
      setTimeout(() => {
        handleViewChange('list');
      }, 1000);
    }, 1500);
  };

  const getStatsData = () => {
    const total = filteredInquiries.length;
    const pending = filteredInquiries.filter(i => i.status === 'Pendiente').length;
    const responded = filteredInquiries.filter(i => i.status === 'Respondida').length;
    const highPriority = filteredInquiries.filter(i => i.priority === 'Alta').length;
    
    return { total, pending, responded, highPriority };
  };

  const stats = getStatsData();

  const renderListView = () => (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/20 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header */}
      <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-700">
            {/* Left side - Title and navigation */}
            <div className="flex items-center space-x-8">
              <Button 
                variant="outline" 
                onClick={() => navigateTo('admin')}
                className="h-14 px-6 border-2 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl backdrop-blur-sm hover:border-primary/50 group"
              >
                <ArrowLeft className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Panel Admin
              </Button>
              
              <div className="flex items-center space-x-6">
                <div className="relative p-5 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl shadow-xl ring-1 ring-primary/10 hover:scale-105 transition-all duration-300 group">
                  <MessageCircle className="h-14 w-14 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                    Gestión de Consultas
                  </h1>
                  <p className="text-2xl text-slate-600 dark:text-slate-300">
                    Administra todas las consultas e inquietudes de los clientes
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats Cards with more space */}
            <div className="grid grid-cols-4 gap-8">
              {[
                { value: stats.total, label: 'Total', color: 'text-primary', gradient: 'from-primary/10 via-primary/5 to-blue-500/10', icon: Activity, hoverGradient: 'from-primary/20 via-blue-500/15 to-purple-500/10' },
                { value: stats.pending, label: 'Pendientes', color: 'text-yellow-600', gradient: 'from-yellow-500/10 via-yellow-400/5 to-orange-500/10', icon: Clock, hoverGradient: 'from-yellow-500/20 via-yellow-400/15 to-orange-500/10' },
                { value: stats.responded, label: 'Respondidas', color: 'text-green-600', gradient: 'from-green-500/10 via-green-400/5 to-emerald-500/10', icon: CheckCircle2, hoverGradient: 'from-green-500/20 via-green-400/15 to-emerald-500/10' },
                { value: stats.highPriority, label: 'Alta Prioridad', color: 'text-red-600', gradient: 'from-red-500/10 via-red-400/5 to-pink-500/10', icon: AlertCircle, hoverGradient: 'from-red-500/20 via-red-400/15 to-pink-500/10' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={stat.label}
                    className="relative border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group cursor-pointer overflow-hidden rounded-2xl animate-in fade-in slide-in-from-top-3 duration-500"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    {/* Background gradient that covers full card */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-100 transition-all duration-300`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.hoverGradient} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                    
                    <CardContent className="relative z-10 p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Icon className={`h-7 w-7 ${stat.color} mr-3 group-hover:scale-110 transition-transform duration-300`} />
                        <div className={`text-4xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
            {/* Main search and filters row - ALL SAME WIDTH */}
            <div className="flex items-center gap-6">
              {/* Search - takes remaining space */}
              <div className="flex-1 relative group min-w-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6 group-hover:text-primary transition-colors duration-300 z-10" />
                  <Input
                    placeholder="Buscar por cliente, email, propiedad o mensaje..."
                    className="pl-14 h-16 text-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 focus:border-primary hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl resize-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* ALL FILTERS SAME WIDTH */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-44 h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl text-lg">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status} className="rounded-lg hover:bg-primary/5 text-base py-3">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                  <SelectTrigger className="w-44 h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl text-lg">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority} className="rounded-lg hover:bg-primary/5 text-base py-3">{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger className="w-44 h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl text-lg">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {inquiryTypes.map(type => (
                      <SelectItem key={type} value={type} className="rounded-lg hover:bg-primary/5 text-base py-3">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-44 h-16 px-6 border-2 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:border-primary/50 flex-shrink-0 text-lg relative"
                >
                  <Filter className="h-5 w-5 mr-3" />
                  Más filtros
                  {showFilters && <X className="h-5 w-5 ml-3" />}
                  {/* Active filters indicator */}
                  {Object.values(filters).filter(f => f !== 'Todas' && f !== 'Todos').length > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                      {Object.values(filters).filter(f => f !== 'Todas' && f !== 'Todos').length}
                    </div>
                  )}
                </Button>
              </div>

              {/* Sort Controls - SAME WIDTH AS FILTERS */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    <SelectItem value="recent" className="rounded-lg hover:bg-primary/5 text-base py-3">Más recientes</SelectItem>
                    <SelectItem value="priority" className="rounded-lg hover:bg-primary/5 text-base py-3">Prioridad</SelectItem>
                    <SelectItem value="responseTime" className="rounded-lg hover:bg-primary/5 text-base py-3">Tiempo resp.</SelectItem>
                    <SelectItem value="name" className="rounded-lg hover:bg-primary/5 text-base py-3">Nombre cliente</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="h-16 w-16 border-2 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:border-primary/50 flex-shrink-0"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-6 w-6" /> : <SortDesc className="h-6 w-6" />}
                </Button>

                {/* Quick Clear Filters Button */}
                {(searchTerm || Object.values(filters).some(f => f !== 'Todas' && f !== 'Todos')) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-44 h-16 border-2 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl bg-red-50 dark:bg-red-950/20 backdrop-blur-sm hover:border-red-400 text-red-600 hover:text-red-700 text-lg"
                  >
                    <X className="h-5 w-5 mr-3" />
                    Limpiar todo
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="animate-in slide-in-from-top-2 fade-in duration-300 border-2 border-dashed border-primary/30 dark:border-primary/20 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl">
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-4">
                      <label className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <User className="h-5 w-5 mr-3 text-primary" />
                        Agente asignado
                      </label>
                      <Select value={filters.agent} onValueChange={(value) => handleFilterChange('agent', value)}>
                        <SelectTrigger className="h-14 rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-white/90 dark:bg-slate-800/90 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2">
                          {agents.map(agent => (
                            <SelectItem key={agent} value={agent} className="rounded-lg hover:bg-primary/5 text-base py-3">{agent}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <Building className="h-5 w-5 mr-3 text-primary" />
                        Fuente de contacto
                      </label>
                      <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                        <SelectTrigger className="h-14 rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-white/90 dark:bg-slate-800/90 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2">
                          {sources.map(source => (
                            <SelectItem key={source} value={source} className="rounded-lg hover:bg-primary/5 text-base py-3">{source}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-primary" />
                        Período
                      </label>
                      <Select defaultValue="ultimo_mes">
                        <SelectTrigger className="h-14 rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-white/90 dark:bg-slate-800/90 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2">
                          <SelectItem value="hoy" className="rounded-lg hover:bg-primary/5 text-base py-3">Hoy</SelectItem>
                          <SelectItem value="esta_semana" className="rounded-lg hover:bg-primary/5 text-base py-3">Esta semana</SelectItem>
                          <SelectItem value="ultimo_mes" className="rounded-lg hover:bg-primary/5 text-base py-3">Último mes</SelectItem>
                          <SelectItem value="ultimo_trimestre" className="rounded-lg hover:bg-primary/5 text-base py-3">Último trimestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={clearFilters} 
                        className="w-full h-14 hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl bg-white/90 dark:bg-slate-800/90 text-base"
                      >
                        <X className="h-5 w-5 mr-3" />
                        Limpiar filtros
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Content Area - PERFECT SCROLL */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in scale-in-75 duration-500">
            <div className="p-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full mb-12 shadow-xl">
              <MessageCircle className="h-24 w-24 text-slate-400 animate-pulse" />
            </div>
            <h3 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
              No se encontraron consultas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-md text-xl">
              No hay consultas que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
            </p>
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl px-12 py-4 text-lg"
            >
              <X className="h-5 w-5 mr-3" />
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredInquiries.map((inquiry, index) => {
              const responseStatus = getResponseTimeStatus(inquiry.responseTime);
              const StatusIcon = responseStatus.icon;
              
              return (
                <Card 
                  key={inquiry.id} 
                  className="group hover:shadow-2xl transition-all duration-500 border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 rounded-2xl overflow-hidden hover:scale-[1.01] hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500 shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-12 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex items-start justify-between gap-12">
                      {/* Left: Client Info */}
                      <div className="flex items-start space-x-10 flex-1">
                        <Avatar className="h-28 w-28 ring-2 ring-primary/20 flex-shrink-0 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-110 shadow-xl">
                          <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} />
                          <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-blue-500/20">
                            {inquiry.clientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 space-y-8">
                          <div className="flex items-center gap-6 mb-6">
                            <h4 className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {inquiry.clientName}
                            </h4>
                            <Badge className={`text-sm font-semibold px-4 py-2 rounded-full border-2 ${getPriorityColor(inquiry.priority)} group-hover:scale-105 transition-transform duration-300`}>
                              <Star className="h-4 w-4 mr-2" />
                              {inquiry.priority}
                            </Badge>
                            <Badge className={`text-sm font-semibold text-white px-4 py-2 rounded-full border-0 ${getStatusColor(inquiry.status)} group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-10 mb-8">
                            <div className="space-y-4">
                              <div className="flex items-center text-lg text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                                <Mail className="h-6 w-6 mr-4 text-primary" />
                                <span className="truncate">{inquiry.clientEmail}</span>
                              </div>
                              <div className="flex items-center text-lg text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                                <Phone className="h-6 w-6 mr-4 text-primary" />
                                <span>{inquiry.clientPhone}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="text-base font-semibold text-slate-500 dark:text-slate-400">Presupuesto:</div>
                              <div className="text-lg font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                {inquiry.budget}
                              </div>
                            </div>
                          </div>

                          {/* Property Info */}
                          <Card className="p-8 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-800/80 rounded-xl border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary/30 transition-all duration-300 backdrop-blur-sm shadow-lg">
                            <div className="flex items-center space-x-8">
                              <ImageWithFallback
                                src={inquiry.propertyImage}
                                alt={inquiry.propertyTitle}
                                className="w-24 h-24 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xl text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors duration-300">
                                  {inquiry.propertyTitle}
                                </h5>
                                <div className="flex items-center text-lg text-slate-600 dark:text-slate-400 mt-3">
                                  <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-primary" />
                                  <span className="truncate">{inquiry.location}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                  <Badge variant="outline" className="text-sm font-semibold rounded-full border-2 hover:border-primary/50 transition-colors duration-300 px-3 py-1">
                                    <FileText className="h-4 w-4 mr-2" />
                                    {inquiry.inquiryType}
                                  </Badge>
                                  <Badge variant="outline" className="text-sm font-semibold rounded-full border-2 hover:border-primary/50 transition-colors duration-300 px-3 py-1">
                                    <Building className="h-4 w-4 mr-2" />
                                    {inquiry.source}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>

                          {/* Message */}
                          <Card className="p-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all duration-300 backdrop-blur-sm shadow-lg">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300">
                              {inquiry.message}
                            </p>
                          </Card>

                          {/* Metadata */}
                          <div className="flex justify-between items-center text-base text-slate-500 dark:text-slate-400 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center space-x-8">
                              <div className="flex items-center group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                <Calendar className="h-5 w-5 mr-3 text-primary" />
                                <span className="font-medium">{formatDate(inquiry.dateCreated)}</span>
                              </div>
                              <div className="flex items-center group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                <User className="h-5 w-5 mr-3 text-primary" />
                                <span className="font-medium">{inquiry.agent}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Response Status & Actions */}
                      <div className="flex flex-col items-end space-y-8 flex-shrink-0">
                        <Card className={`p-6 rounded-xl border-2 ${responseStatus.bg} ${responseStatus.color} border-current/20 group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-3">
                              <StatusIcon className={`h-7 w-7 mr-3 ${responseStatus.color}`} />
                              <span className={`text-lg font-bold ${responseStatus.color}`}>
                                {responseStatus.text}
                              </span>
                            </div>
                            <div className="text-base font-medium opacity-80">
                              {inquiry.responseTime === 0 ? 'Sin responder' : `${inquiry.responseTime}h respuesta`}
                            </div>
                          </div>
                        </Card>

                        <div className="flex flex-col space-y-4 w-48">
                          <Button 
                            size="lg" 
                            onClick={() => handleInquiryAction('view', inquiry.id)}
                            variant="outline"
                            className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm h-14 text-base"
                          >
                            <Eye className="h-5 w-5 mr-3" />
                            Ver detalle
                          </Button>
                          <Button 
                            size="lg" 
                            onClick={() => handleInquiryAction('reply', inquiry.id)}
                            className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-14 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-base"
                          >
                            <Reply className="h-5 w-5 mr-3" />
                            Responder
                          </Button>
                          <div className="flex space-x-3">
                            <Button 
                              size="lg" 
                              variant="outline" 
                              onClick={() => handleInquiryAction('archive', inquiry.id)}
                              className="hover:scale-105 transition-all duration-300 flex-1 rounded-xl border-2 hover:border-yellow-400 hover:text-yellow-600 shadow-lg hover:shadow-xl h-14"
                            >
                              <Archive className="h-5 w-5" />
                            </Button>
                            <Button 
                              size="lg" 
                              variant="outline" 
                              onClick={() => handleInquiryAction('delete', inquiry.id)}
                              className="hover:scale-105 transition-all duration-300 hover:text-red-600 hover:border-red-300 flex-1 rounded-xl border-2 shadow-lg hover:shadow-xl h-14"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedInquiry) return null;
    
    const responseStatus = getResponseTimeStatus(selectedInquiry.responseTime);
    const StatusIcon = responseStatus.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/20 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Header */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5" />
          <div className="relative max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-500">
              <div className="flex items-center space-x-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => handleViewChange('list')}
                  className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm h-14 px-8"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Volver a la lista
                </Button>
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20 ring-2 ring-primary/20 shadow-xl">
                    <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-blue-500/20">
                      {selectedInquiry.clientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      {selectedInquiry.clientName}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mt-2">
                      Consulta sobre: <span className="font-semibold text-primary">{selectedInquiry.propertyTitle}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleViewChange('reply', selectedInquiry)}
                size="lg"
                className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-14 px-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg"
              >
                <Reply className="h-5 w-5 mr-3" />
                Responder consulta
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="space-y-10">
            {/* Client Information */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <User className="h-6 w-6 mr-4 text-primary" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-slate-500 dark:text-slate-400">Email</label>
                    <p className="text-lg font-medium">{selectedInquiry.clientEmail}</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-slate-500 dark:text-slate-400">Teléfono</label>
                    <p className="text-lg font-medium">{selectedInquiry.clientPhone}</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-slate-500 dark:text-slate-400">Presupuesto</label>
                    <p className="text-lg font-bold text-primary">{selectedInquiry.budget}</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-slate-500 dark:text-slate-400">Fuente</label>
                    <Badge variant="outline" className="mt-2 font-semibold rounded-full border-2 px-4 py-2">
                      <Building className="h-4 w-4 mr-2" />
                      {selectedInquiry.source}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Building className="h-6 w-6 mr-4 text-primary" />
                  Propiedad de Interés
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="flex items-center space-x-10">
                  <ImageWithFallback
                    src={selectedInquiry.propertyImage}
                    alt={selectedInquiry.propertyTitle}
                    className="w-40 h-40 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-4">{selectedInquiry.propertyTitle}</h3>
                    <div className="flex items-center text-slate-600 dark:text-slate-400 mb-6">
                      <MapPin className="h-5 w-5 mr-3" />
                      <span className="text-xl">{selectedInquiry.location}</span>
                    </div>
                    <div className="flex space-x-6">
                      <Badge variant="outline" className="font-semibold rounded-full border-2 px-4 py-2">
                        <FileText className="h-4 w-4 mr-2" />
                        {selectedInquiry.inquiryType}
                      </Badge>
                      <Badge className={`font-semibold rounded-full border-2 px-4 py-2 ${getPriorityColor(selectedInquiry.priority)}`}>
                        <Star className="h-4 w-4 mr-2" />
                        Prioridad {selectedInquiry.priority}
                      </Badge>
                      <Badge className={`text-white font-semibold rounded-full px-4 py-2 ${getStatusColor(selectedInquiry.status)} shadow-lg`}>
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MessageCircle className="h-6 w-6 mr-4 text-primary" />
                  Consulta del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="p-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{selectedInquiry.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* Response Status */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Clock className="h-6 w-6 mr-4 text-primary" />
                  Estado de Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <StatusIcon className={`h-8 w-8 mr-4 ${responseStatus.color}`} />
                      <span className={`text-2xl font-bold ${responseStatus.color}`}>
                        {responseStatus.text}
                      </span>
                    </div>
                    <div className="text-lg text-slate-500 dark:text-slate-400">
                      {selectedInquiry.responseTime === 0 ? 'Aún no se ha respondido' : `Tiempo de respuesta: ${selectedInquiry.responseTime} horas`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-2">Agente asignado</div>
                    <div className="text-xl font-bold">{selectedInquiry.agent}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-400">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Calendar className="h-6 w-6 mr-4 text-primary" />
                  Cronología
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                    <div>
                      <div className="text-lg font-semibold">Consulta recibida</div>
                      <div className="text-base text-slate-500 dark:text-slate-400">
                        {formatDate(selectedInquiry.dateCreated)}
                      </div>
                    </div>
                  </div>
                  {selectedInquiry.lastResponse && (
                    <div className="flex items-center space-x-6">
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                      <div>
                        <div className="text-lg font-semibold">Último contacto</div>
                        <div className="text-base text-slate-500 dark:text-slate-400">
                          {formatDate(selectedInquiry.lastResponse)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderReplyView = () => {
    if (!selectedInquiry) return null;

    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/20 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Header */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5" />
          <div className="relative max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-500">
              <div className="flex items-center space-x-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => handleViewChange('detail', selectedInquiry)}
                  className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm h-14 px-8"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Volver al detalle
                </Button>
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl shadow-lg">
                    <Send className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      Responder a {selectedInquiry.clientName}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mt-2">
                      Consulta sobre: <span className="font-semibold text-primary">{selectedInquiry.propertyTitle}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
            {/* Original Message */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MessageCircle className="h-6 w-6 mr-4 text-primary" />
                  Consulta original
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="p-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{selectedInquiry.message}</p>
                </div>
                <div className="mt-6 text-base text-slate-500 dark:text-slate-400 flex items-center">
                  <Calendar className="h-5 w-5 mr-3" />
                  Enviado el {formatDate(selectedInquiry.dateCreated)}
                </div>
              </CardContent>
            </Card>

            {/* Response Form */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Edit3 className="h-6 w-6 mr-4 text-primary" />
                  Tu respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div>
                  <label className="text-lg font-semibold mb-6 block text-slate-700 dark:text-slate-300">
                    Mensaje de respuesta
                  </label>
                  <Textarea 
                    placeholder="Escribe tu respuesta aquí..."
                    className="min-h-[250px] resize-none border-2 focus:border-primary rounded-xl text-lg p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <div className="mt-4 text-base text-slate-500 dark:text-slate-400 flex justify-between items-center">
                    <span>{responseText.length}/1000 caracteres</span>
                    <div className="flex items-center text-green-600">
                      <Sparkles className="h-5 w-5 mr-2" />
                      <span>Respuesta en tiempo real</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-6">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => handleViewChange('detail', selectedInquiry)}
                    className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-slate-400 shadow-lg hover:shadow-xl px-10 py-4 text-lg"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSendResponse}
                    disabled={!responseText.trim()}
                    size="lg"
                    className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl px-10 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                    <Send className="h-5 w-5 mr-3" />
                    Enviar respuesta
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b p-8">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Sparkles className="h-6 w-6 mr-4 text-primary" />
                  Plantillas rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { 
                      title: 'Agendar visita', 
                      description: 'Para consultas de visitas',
                      template: 'Gracias por su interés en nuestra propiedad. Me complace informarle que está disponible para visitas. ¿Cuándo le vendría bien agendar una cita?',
                      icon: Calendar,
                      gradient: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      title: 'Enviar información', 
                      description: 'Para solicitudes de información',
                      template: 'Gracias por contactarnos. Le envío información detallada sobre la propiedad, incluyendo planos, características y documentación. ¿Tiene alguna pregunta específica?',
                      icon: FileText,
                      gradient: 'from-green-500 to-emerald-500'
                    },
                    { 
                      title: 'Negociación', 
                      description: 'Para consultas de precio',
                      template: 'Entendemos su interés en negociar. Revisaremos su propuesta con el propietario y le responderemos a la brevedad. ¿Podría especificar su oferta?',
                      icon: TrendingUp,
                      gradient: 'from-orange-500 to-red-500'
                    },
                    { 
                      title: 'Financiación', 
                      description: 'Para consultas de crédito',
                      template: 'Le ayudamos con las opciones de financiación. Trabajamos con varios bancos y podemos asesorarle en el proceso. ¿Cuál es su situación financiera actual?',
                      icon: BarChart3,
                      gradient: 'from-purple-500 to-pink-500'
                    }
                  ].map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <Button
                        key={template.title}
                        variant="outline"
                        className="text-left justify-start h-auto p-8 hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl group animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setResponseText(template.template)}
                      >
                        <div className="flex items-start space-x-6 w-full">
                          <div className={`p-4 bg-gradient-to-br ${template.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {template.title}
                            </div>
                            <div className="text-base text-slate-500 dark:text-slate-400 mt-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                              {template.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {currentView === 'list' && renderListView()}
      {currentView === 'detail' && renderDetailView()}
      {currentView === 'reply' && renderReplyView()}
    </>
  );
}