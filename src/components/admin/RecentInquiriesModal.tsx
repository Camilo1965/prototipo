import { useState, useEffect } from 'react';
// DEPRECATED: This modal has been replaced by InquiriesPage for better UX
// This file is kept for compatibility but should not be used
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
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
  MoreHorizontal,
  Calendar,
  X,
  SortAsc,
  SortDesc,
  Building,
  AlertCircle,
  CheckCircle2,
  Timer,
  Users,
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
  Target
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

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

interface RecentInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function RecentInquiriesModal({ isOpen, onClose }: RecentInquiriesModalProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(allInquiries);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>(allInquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'reply'>('list');
  const [isAnimating, setIsAnimating] = useState(false);
  
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
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentView(newView);
      if (inquiry) setSelectedInquiry(inquiry);
      if (newView === 'reply') setResponseText('');
      setIsAnimating(false);
    }, 150);
  };

  const handleInquiryAction = (action: string, inquiryId: string) => {
    const inquiry = inquiries.find(i => i.id === inquiryId);
    
    switch (action) {
      case 'reply':
        handleViewChange('reply', inquiry);
        break;
      case 'view':
        handleViewChange('detail', inquiry);
        break;
      case 'archive':
        if (inquiry) {
          setInquiries(prev => 
            prev.map(i => i.id === inquiryId ? { ...i, status: 'Archivada' } : i)
          );
          toast.success(`Consulta de ${inquiry.clientName} archivada`, {
            icon: '📥',
            duration: 3000,
          });
        }
        break;
      case 'delete':
        if (inquiry) {
          setInquiries(prev => prev.filter(i => i.id !== inquiryId));
          toast.warning(`Consulta de ${inquiry.clientName} eliminada`, {
            icon: '🗑️',
            duration: 3000,
          });
        }
        break;
      default:
        toast.info('Acción en desarrollo', { icon: '🚧' });
    }
  };

  const handleSendResponse = () => {
    if (!selectedInquiry || !responseText.trim()) {
      toast.error('Por favor escribe una respuesta', { icon: '⚠️' });
      return;
    }

    setIsAnimating(true);
    
    setTimeout(() => {
      // Update inquiry status
      setInquiries(prev => 
        prev.map(i => 
          i.id === selectedInquiry.id 
            ? { ...i, status: 'Respondida', lastResponse: new Date().toISOString() } 
            : i
        )
      );

      toast.success(`Respuesta enviada a ${selectedInquiry.clientName}`, {
        icon: '✉️',
        duration: 4000,
      });
      
      handleViewChange('list');
    }, 300);
  };

  const getStatsData = () => {
    const total = filteredInquiries.length;
    const pending = filteredInquiries.filter(i => i.status === 'Pendiente').length;
    const responded = filteredInquiries.filter(i => i.status === 'Respondida').length;
    const highPriority = filteredInquiries.filter(i => i.priority === 'Alta').length;
    
    return { total, pending, responded, highPriority };
  };

  const stats = getStatsData();

  // Reset view when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('list');
      setSelectedInquiry(null);
      setResponseText('');
      setIsAnimating(false);
    }
  }, [isOpen]);

  const renderListView = () => (
    <div className={`flex flex-col h-full transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header */}
      <div className="flex-shrink-0 px-10 py-8 border-b bg-gradient-to-br from-slate-50/80 via-white to-blue-50/50 dark:from-slate-900/80 dark:via-slate-800 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-700">
          <div className="flex items-center space-x-6">
            <div className="relative p-4 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl shadow-lg ring-1 ring-primary/10 hover:scale-105 transition-all duration-300 group">
              <MessageCircle className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <DialogTitle className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                Gestión de Consultas
              </DialogTitle>
              <DialogDescription className="text-xl mt-3 text-slate-600 dark:text-slate-300">
                Administra todas las consultas e inquietudes de los clientes
              </DialogDescription>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
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
                  className="relative border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group cursor-pointer overflow-hidden rounded-2xl animate-in fade-in slide-in-from-top-3 duration-500"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  {/* Background gradient that covers full card */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-100 transition-all duration-300`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.hoverGradient} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                  
                  <CardContent className="relative z-10 p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Icon className={`h-6 w-6 ${stat.color} mr-3 group-hover:scale-110 transition-transform duration-300`} />
                      <div className={`text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-base font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Search - FIXED LAYOUT */}
      <div className="flex-shrink-0 px-10 py-6 border-b bg-gradient-to-r from-slate-50/50 via-white/80 to-slate-50/50 dark:from-slate-900/50 dark:via-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
          {/* Main search and quick filters row */}
          <div className="flex items-center gap-6">
            {/* Search - takes remaining space */}
            <div className="flex-1 relative group min-w-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-hover:text-primary transition-colors duration-300 z-10" />
                <Input
                  placeholder="Buscar por cliente, email, propiedad o mensaje..."
                  className="pl-12 h-14 text-base bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 focus:border-primary hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl resize-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Filters - fixed widths */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-40 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status} className="rounded-lg hover:bg-primary/5">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-36 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {priorityOptions.map(priority => (
                    <SelectItem key={priority} value={priority} className="rounded-lg hover:bg-primary/5">{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-14 px-6 border-2 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:border-primary/50 flex-shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                Más filtros
                {showFilters && <X className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            {/* Sort Controls - fixed widths */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="recent" className="rounded-lg hover:bg-primary/5">Más recientes</SelectItem>
                  <SelectItem value="priority" className="rounded-lg hover:bg-primary/5">Prioridad</SelectItem>
                  <SelectItem value="responseTime" className="rounded-lg hover:bg-primary/5">Tiempo resp.</SelectItem>
                  <SelectItem value="name" className="rounded-lg hover:bg-primary/5">Nombre cliente</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-14 w-14 border-2 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:border-primary/50 flex-shrink-0"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="animate-in slide-in-from-top-2 fade-in duration-300 border-2 border-dashed border-primary/30 dark:border-primary/20 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      Tipo de consulta
                    </label>
                    <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                      <SelectTrigger className="h-12 rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-white/90 dark:bg-slate-800/90">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        {inquiryTypes.map(type => (
                          <SelectItem key={type} value={type} className="rounded-lg hover:bg-primary/5">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      Agente asignado
                    </label>
                    <Select value={filters.agent} onValueChange={(value) => handleFilterChange('agent', value)}>
                      <SelectTrigger className="h-12 rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-white/90 dark:bg-slate-800/90">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        {agents.map(agent => (
                          <SelectItem key={agent} value={agent} className="rounded-lg hover:bg-primary/5">{agent}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-primary" />
                      Fuente de contacto
                    </label>
                    <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                      <SelectTrigger className="h-12 rounded-xl border-2 hover:border-primary/50 transition-all duration-300 bg-white/90 dark:bg-slate-800/90">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        {sources.map(source => (
                          <SelectItem key={source} value={source} className="rounded-lg hover:bg-primary/5">{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={clearFilters} 
                      className="w-full h-12 hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl bg-white/90 dark:bg-slate-800/90"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Content Area - SCROLLABLE */}
      <div className="flex-1 overflow-y-auto">
        {filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-12 animate-in fade-in scale-in-75 duration-500">
            <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full mb-8 shadow-xl">
              <MessageCircle className="h-20 w-20 text-slate-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
              No se encontraron consultas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md text-lg">
              No hay consultas que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
            </p>
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl px-8 py-3"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="p-10 space-y-8">
            <div className="grid gap-8">
              {filteredInquiries.map((inquiry, index) => {
                const responseStatus = getResponseTimeStatus(inquiry.responseTime);
                const StatusIcon = responseStatus.icon;
                
                return (
                  <Card 
                    key={inquiry.id} 
                    className="group hover:shadow-2xl transition-all duration-500 border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 rounded-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-3 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-10 relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 flex items-start justify-between gap-10">
                        {/* Left: Client Info */}
                        <div className="flex items-start space-x-8 flex-1">
                          <Avatar className="h-24 w-24 ring-2 ring-primary/20 flex-shrink-0 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-110 shadow-xl">
                            <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} />
                            <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary/20 to-blue-500/20">
                              {inquiry.clientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0 space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                              <h4 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                                {inquiry.clientName}
                              </h4>
                              <Badge className={`text-xs font-semibold px-3 py-1 rounded-full border-2 ${getPriorityColor(inquiry.priority)} group-hover:scale-105 transition-transform duration-300`}>
                                <Star className="h-3 w-3 mr-1" />
                                {inquiry.priority}
                              </Badge>
                              <Badge className={`text-xs font-semibold text-white px-3 py-1 rounded-full border-0 ${getStatusColor(inquiry.status)} group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                                {inquiry.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8 mb-6">
                              <div className="space-y-3">
                                <div className="flex items-center text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                                  <Mail className="h-5 w-5 mr-3 text-primary" />
                                  <span className="truncate">{inquiry.clientEmail}</span>
                                </div>
                                <div className="flex items-center text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                                  <Phone className="h-5 w-5 mr-3 text-primary" />
                                  <span>{inquiry.clientPhone}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Presupuesto:</div>
                                <div className="text-base font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                  {inquiry.budget}
                                </div>
                              </div>
                            </div>

                            {/* Property Info */}
                            <Card className="p-6 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-800/80 rounded-xl border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary/30 transition-all duration-300 backdrop-blur-sm">
                              <div className="flex items-center space-x-6">
                                <ImageWithFallback
                                  src={inquiry.propertyImage}
                                  alt={inquiry.propertyTitle}
                                  className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors duration-300">
                                    {inquiry.propertyTitle}
                                  </h5>
                                  <div className="flex items-center text-base text-slate-600 dark:text-slate-400 mt-2">
                                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                                    <span className="truncate">{inquiry.location}</span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-3">
                                    <Badge variant="outline" className="text-xs font-semibold rounded-full border-2 hover:border-primary/50 transition-colors duration-300">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {inquiry.inquiryType}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs font-semibold rounded-full border-2 hover:border-primary/50 transition-colors duration-300">
                                      <Building className="h-3 w-3 mr-1" />
                                      {inquiry.source}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </Card>

                            {/* Message */}
                            <Card className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all duration-300 backdrop-blur-sm">
                              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300">
                                {inquiry.message}
                              </p>
                            </Card>

                            {/* Metadata */}
                            <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span className="font-medium">{formatDate(inquiry.dateCreated)}</span>
                                </div>
                                <div className="flex items-center group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                  <User className="h-4 w-4 mr-2 text-primary" />
                                  <span className="font-medium">{inquiry.agent}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Response Status & Actions */}
                        <div className="flex flex-col items-end space-y-6 flex-shrink-0">
                          <Card className={`p-4 rounded-xl border-2 ${responseStatus.bg} ${responseStatus.color} border-current/20 group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <StatusIcon className={`h-6 w-6 mr-2 ${responseStatus.color}`} />
                                <span className={`text-base font-bold ${responseStatus.color}`}>
                                  {responseStatus.text}
                                </span>
                              </div>
                              <div className="text-sm font-medium opacity-80">
                                {inquiry.responseTime === 0 ? 'Sin responder' : `${inquiry.responseTime}h respuesta`}
                              </div>
                            </div>
                          </Card>

                          <div className="flex flex-col space-y-3 w-40">
                            <Button 
                              size="sm" 
                              onClick={() => handleInquiryAction('view', inquiry.id)}
                              variant="outline"
                              className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm h-12"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalle
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleInquiryAction('reply', inquiry.id)}
                              className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                            >
                              <Reply className="h-4 w-4 mr-2" />
                              Responder
                            </Button>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleInquiryAction('archive', inquiry.id)}
                                className="hover:scale-105 transition-all duration-300 flex-1 rounded-xl border-2 hover:border-yellow-400 hover:text-yellow-600 shadow-lg hover:shadow-xl"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleInquiryAction('delete', inquiry.id)}
                                className="hover:scale-105 transition-all duration-300 hover:text-red-600 hover:border-red-300 flex-1 rounded-xl border-2 shadow-lg hover:shadow-xl"
                              >
                                <Trash2 className="h-4 w-4" />
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
      <div className={`flex flex-col h-full transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Header */}
        <div className="flex-shrink-0 px-10 py-8 border-b bg-gradient-to-br from-slate-50/80 via-white to-blue-50/50 dark:from-slate-900/80 dark:via-slate-800 dark:to-blue-950/30 relative overflow-hidden animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewChange('list')}
                className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm h-12 px-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la lista
              </Button>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20 shadow-xl">
                  <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary/20 to-blue-500/20">
                    {selectedInquiry.clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    {selectedInquiry.clientName}
                  </DialogTitle>
                  <DialogDescription className="text-xl text-slate-600 dark:text-slate-300 mt-1">
                    Consulta sobre: <span className="font-semibold text-primary">{selectedInquiry.propertyTitle}</span>
                  </DialogDescription>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => handleViewChange('reply', selectedInquiry)}
              className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-12 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              <Reply className="h-4 w-4 mr-2" />
              Responder consulta
            </Button>
          </div>
        </div>

        {/* Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Client Information */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email</label>
                    <p className="text-base font-medium">{selectedInquiry.clientEmail}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Teléfono</label>
                    <p className="text-base font-medium">{selectedInquiry.clientPhone}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Presupuesto</label>
                    <p className="text-base font-bold text-primary">{selectedInquiry.budget}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Fuente</label>
                    <Badge variant="outline" className="mt-1 font-semibold rounded-full border-2">
                      <Building className="h-3 w-3 mr-1" />
                      {selectedInquiry.source}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Building className="h-5 w-5 mr-3 text-primary" />
                  Propiedad de Interés
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center space-x-8">
                  <ImageWithFallback
                    src={selectedInquiry.propertyImage}
                    alt={selectedInquiry.propertyTitle}
                    className="w-32 h-32 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{selectedInquiry.propertyTitle}</h3>
                    <div className="flex items-center text-slate-600 dark:text-slate-400 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-lg">{selectedInquiry.location}</span>
                    </div>
                    <div className="flex space-x-4">
                      <Badge variant="outline" className="font-semibold rounded-full border-2">
                        <FileText className="h-3 w-3 mr-1" />
                        {selectedInquiry.inquiryType}
                      </Badge>
                      <Badge className={`font-semibold rounded-full border-2 ${getPriorityColor(selectedInquiry.priority)}`}>
                        <Star className="h-3 w-3 mr-1" />
                        Prioridad {selectedInquiry.priority}
                      </Badge>
                      <Badge className={`text-white font-semibold rounded-full ${getStatusColor(selectedInquiry.status)} shadow-lg`}>
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <MessageCircle className="h-5 w-5 mr-3 text-primary" />
                  Consulta del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{selectedInquiry.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* Response Status */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  Estado de Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-3">
                      <StatusIcon className={`h-6 w-6 mr-3 ${responseStatus.color}`} />
                      <span className={`text-xl font-bold ${responseStatus.color}`}>
                        {responseStatus.text}
                      </span>
                    </div>
                    <div className="text-base text-slate-500 dark:text-slate-400">
                      {selectedInquiry.responseTime === 0 ? 'Aún no se ha respondido' : `Tiempo de respuesta: ${selectedInquiry.responseTime} horas`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Agente asignado</div>
                    <div className="text-lg font-bold">{selectedInquiry.agent}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-400">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  Cronología
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                    <div>
                      <div className="text-base font-semibold">Consulta recibida</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(selectedInquiry.dateCreated)}
                      </div>
                    </div>
                  </div>
                  {selectedInquiry.lastResponse && (
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                      <div>
                        <div className="text-base font-semibold">Último contacto</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
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
      <div className={`flex flex-col h-full transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Header */}
        <div className="flex-shrink-0 px-10 py-8 border-b bg-gradient-to-br from-slate-50/80 via-white to-blue-50/50 dark:from-slate-900/80 dark:via-slate-800 dark:to-blue-950/30 relative overflow-hidden animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewChange('detail', selectedInquiry)}
                className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm h-12 px-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al detalle
              </Button>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl shadow-lg">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Responder a {selectedInquiry.clientName}
                  </DialogTitle>
                  <DialogDescription className="text-xl text-slate-600 dark:text-slate-300 mt-1">
                    Consulta sobre: <span className="font-semibold text-primary">{selectedInquiry.propertyTitle}</span>
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
            {/* Original Message */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <MessageCircle className="h-5 w-5 mr-3 text-primary" />
                  Consulta original
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{selectedInquiry.message}</p>
                </div>
                <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Enviado el {formatDate(selectedInquiry.dateCreated)}
                </div>
              </CardContent>
            </Card>

            {/* Response Form */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Edit3 className="h-5 w-5 mr-3 text-primary" />
                  Tu respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <label className="text-base font-semibold mb-4 block text-slate-700 dark:text-slate-300">
                    Mensaje de respuesta
                  </label>
                  <Textarea 
                    placeholder="Escribe tu respuesta aquí..."
                    className="min-h-[200px] resize-none border-2 focus:border-primary rounded-xl text-base p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center">
                    <span>{responseText.length}/1000 caracteres</span>
                    <div className="flex items-center text-green-600">
                      <Sparkles className="h-4 w-4 mr-1" />
                      <span>Respuesta en tiempo real</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewChange('detail', selectedInquiry)}
                    className="hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-slate-400 shadow-lg hover:shadow-xl px-8 py-3"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSendResponse}
                    disabled={!responseText.trim()}
                    className="hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar respuesta
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Sparkles className="h-5 w-5 mr-3 text-primary" />
                  Plantillas rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="text-left justify-start h-auto p-6 hover:scale-105 transition-all duration-300 rounded-xl border-2 hover:border-primary/50 shadow-lg hover:shadow-xl group animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setResponseText(template.template)}
                      >
                        <div className="flex items-start space-x-4 w-full">
                          <div className={`p-3 bg-gradient-to-br ${template.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {template.title}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none !w-[97vw] !h-[97vh] !max-h-none p-0 overflow-hidden left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] fixed animate-in fade-in zoom-in-95 duration-300 rounded-2xl shadow-2xl">
        {currentView === 'list' && renderListView()}
        {currentView === 'detail' && renderDetailView()}
        {currentView === 'reply' && renderReplyView()}
      </DialogContent>
    </Dialog>
  );
}