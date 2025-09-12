import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  Mail, 
  Send, 
  Users, 
  Target, 
  Calendar,
  Eye,
  BarChart3,
  Settings,
  Image,
  Link,
  Type,
  Palette,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface EmailMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmailCampaign {
  subject: string;
  preheader: string;
  template: string;
  content: string;
  targetAudience: string[];
  properties: string[];
  sendTime: string;
  sendDate: string;
  trackOpens: boolean;
  trackClicks: boolean;
}

const emailTemplates = [
  {
    id: 'newsletter',
    name: 'Newsletter Mensual',
    description: 'Boletín con propiedades destacadas y novedades',
    preview: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300'
  },
  {
    id: 'new_property',
    name: 'Nueva Propiedad',
    description: 'Notificación de nueva propiedad disponible',
    preview: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300'
  },
  {
    id: 'price_update',
    name: 'Actualización de Precio',
    description: 'Notifica cambios de precio en propiedades',
    preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300'
  },
  {
    id: 'market_report',
    name: 'Informe de Mercado',
    description: 'Análisis mensual del mercado inmobiliario',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
  }
];

const audienceSegments = [
  { id: 'all_clients', name: 'Todos los clientes', count: 1250 },
  { id: 'buyers', name: 'Compradores activos', count: 340 },
  { id: 'sellers', name: 'Vendedores', count: 120 },
  { id: 'investors', name: 'Inversores', count: 85 },
  { id: 'vip_clients', name: 'Clientes VIP', count: 45 },
  { id: 'newsletter_subscribers', name: 'Suscriptores newsletter', count: 890 }
];

const availableProperties = [
  { id: '1', title: 'Casa Moderna Centro', price: '€350,000', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100' },
  { id: '2', title: 'Apartamento Salamanca', price: '€480,000', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100' },
  { id: '3', title: 'Villa Las Rozas', price: '€720,000', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100' },
  { id: '4', title: 'Ático Retiro', price: '€890,000', image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=100' }
];

const campaignStats = [
  { label: 'Emails enviados', value: '2,450', icon: Send, color: 'text-blue-500' },
  { label: 'Tasa de apertura', value: '24.8%', icon: Eye, color: 'text-green-500' },
  { label: 'Clicks', value: '186', icon: Target, color: 'text-purple-500' },
  { label: 'Conversiones', value: '12', icon: TrendingUp, color: 'text-yellow-500' }
];

export function EmailMarketingModal({ isOpen, onClose }: EmailMarketingModalProps) {
  const [campaign, setCampaign] = useState<EmailCampaign>({
    subject: '',
    preheader: '',
    template: '',
    content: '',
    targetAudience: [],
    properties: [],
    sendTime: '10:00',
    sendDate: '',
    trackOpens: true,
    trackClicks: true
  });

  const [currentTab, setCurrentTab] = useState('template');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleCampaignChange = (field: keyof EmailCampaign, value: any) => {
    setCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAudienceToggle = (audienceId: string) => {
    setCampaign(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audienceId)
        ? prev.targetAudience.filter(id => id !== audienceId)
        : [...prev.targetAudience, audienceId]
    }));
  };

  const handlePropertyToggle = (propertyId: string) => {
    setCampaign(prev => ({
      ...prev,
      properties: prev.properties.includes(propertyId)
        ? prev.properties.filter(id => id !== propertyId)
        : [...prev.properties, propertyId]
    }));
  };

  const getTotalRecipients = () => {
    return audienceSegments
      .filter(segment => campaign.targetAudience.includes(segment.id))
      .reduce((total, segment) => total + segment.count, 0);
  };

  const handleSendCampaign = async () => {
    if (!campaign.subject || !campaign.template || campaign.targetAudience.length === 0) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Campaña enviada exitosamente', {
        description: `Se han enviado ${getTotalRecipients()} emails`
      });
      
      setShowStats(true);
      
    } catch (error) {
      toast.error('Error al enviar la campaña');
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleCampaign = async () => {
    if (!campaign.sendDate) {
      toast.error('Selecciona una fecha para programar');
      return;
    }

    toast.success('Campaña programada', {
      description: `Se enviará el ${new Date(campaign.sendDate).toLocaleDateString('es-ES')} a las ${campaign.sendTime}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Mail className="h-6 w-6 mr-2 text-primary" />
            Email Marketing
          </DialogTitle>
          <DialogDescription>
            Crea y gestiona campañas de email marketing para tus clientes
          </DialogDescription>
        </DialogHeader>

        {showStats ? (
          // Stats View
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">¡Campaña Enviada!</h3>
              <p className="text-gray-600">Tu campaña ha sido enviada exitosamente</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {campaignStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <IconComponent className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl mb-1">{stat.value}</div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => setShowStats(false)}>
                Crear Nueva Campaña
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="template">Plantilla</TabsTrigger>
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="audience">Audiencia</TabsTrigger>
                <TabsTrigger value="properties">Propiedades</TabsTrigger>
                <TabsTrigger value="schedule">Programar</TabsTrigger>
              </TabsList>

              <div className="overflow-y-auto max-h-[60vh] mt-4">
                {/* Template Selection */}
                <TabsContent value="template" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg mb-2">Selecciona una plantilla</h3>
                    <p className="text-gray-600">Elige el tipo de email que quieres enviar</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {emailTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          campaign.template === template.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleCampaignChange('template', template.id)}
                      >
                        <div className="relative">
                          <ImageWithFallback
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          
                          {campaign.template === template.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Content */}
                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Asunto del email *</Label>
                      <Input
                        id="subject"
                        value={campaign.subject}
                        onChange={(e) => handleCampaignChange('subject', e.target.value)}
                        placeholder="Nueva propiedad disponible en Madrid Centro"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preheader">Preheader (vista previa)</Label>
                      <Input
                        id="preheader"
                        value={campaign.preheader}
                        onChange={(e) => handleCampaignChange('preheader', e.target.value)}
                        placeholder="Descubre esta increíble oportunidad..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Contenido del mensaje</Label>
                      <Textarea
                        id="content"
                        value={campaign.content}
                        onChange={(e) => handleCampaignChange('content', e.target.value)}
                        placeholder="Escribe el contenido de tu email aquí..."
                        rows={8}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isPreviewMode ? 'Editar' : 'Vista previa'}
                      </Button>

                      <div className="text-sm text-gray-600">
                        {campaign.content.length}/2000 caracteres
                      </div>
                    </div>

                    {isPreviewMode && (
                      <Card className="border-2 border-dashed">
                        <CardHeader>
                          <CardTitle className="text-sm text-gray-600">Vista previa del email</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 p-4 rounded">
                            <div className="mb-4">
                              <strong>Asunto:</strong> {campaign.subject || 'Sin asunto'}
                            </div>
                            <div className="whitespace-pre-wrap">
                              {campaign.content || 'Sin contenido'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Audience */}
                <TabsContent value="audience" className="space-y-6">
                  <div>
                    <h3 className="text-lg mb-4">Selecciona tu audiencia</h3>
                    <p className="text-gray-600 mb-6">
                      Elige los segmentos de clientes que recibirán este email
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {audienceSegments.map((segment) => (
                      <Card 
                        key={segment.id}
                        className={`cursor-pointer transition-all ${
                          campaign.targetAudience.includes(segment.id)
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleAudienceToggle(segment.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{segment.name}</h4>
                              <p className="text-sm text-gray-600">{segment.count} contactos</p>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-2" />
                              <Checkbox 
                                checked={campaign.targetAudience.includes(segment.id)}
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {campaign.targetAudience.length > 0 && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Target className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium">
                            Total de destinatarios: {getTotalRecipients().toLocaleString('es-ES')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Properties */}
                <TabsContent value="properties" className="space-y-6">
                  <div>
                    <h3 className="text-lg mb-4">Propiedades destacadas</h3>
                    <p className="text-gray-600 mb-6">
                      Selecciona las propiedades que quieres incluir en el email
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableProperties.map((property) => (
                      <Card 
                        key={property.id}
                        className={`cursor-pointer transition-all ${
                          campaign.properties.includes(property.id)
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handlePropertyToggle(property.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <ImageWithFallback
                              src={property.image}
                              alt={property.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{property.title}</h4>
                              <p className="text-sm text-gray-600">{property.price}</p>
                            </div>
                            <Checkbox 
                              checked={campaign.properties.includes(property.id)}
                              onChange={() => {}}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {campaign.properties.length > 0 && (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="font-medium">
                            {campaign.properties.length} propiedad(es) seleccionada(s)
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Schedule */}
                <TabsContent value="schedule" className="space-y-6">
                  <div>
                    <h3 className="text-lg mb-4">Programar envío</h3>
                    <p className="text-gray-600 mb-6">
                      Elige cuándo quieres enviar tu campaña
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sendDate">Fecha de envío</Label>
                      <Input
                        id="sendDate"
                        type="date"
                        value={campaign.sendDate}
                        onChange={(e) => handleCampaignChange('sendDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sendTime">Hora de envío</Label>
                      <Select value={campaign.sendTime} onValueChange={(value) => handleCampaignChange('sendTime', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="18:00">18:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Configuración de seguimiento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Rastrear aperturas</Label>
                          <p className="text-sm text-gray-600">Saber cuando los destinatarios abren el email</p>
                        </div>
                        <Switch
                          checked={campaign.trackOpens}
                          onCheckedChange={(checked) => handleCampaignChange('trackOpens', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Rastrear clicks</Label>
                          <p className="text-sm text-gray-600">Saber qué enlaces son clickeados</p>
                        </div>
                        <Switch
                          checked={campaign.trackClicks}
                          onCheckedChange={(checked) => handleCampaignChange('trackClicks', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Mejor hora para enviar</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Los martes y miércoles entre 10:00-12:00 tienen las mejores tasas de apertura
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer Actions */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {campaign.targetAudience.length > 0 && (
                    <span>📊 {getTotalRecipients().toLocaleString('es-ES')} destinatarios</span>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  
                  {campaign.sendDate && (
                    <Button variant="outline" onClick={handleScheduleCampaign}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Programar
                    </Button>
                  )}

                  <Button onClick={handleSendCampaign} disabled={isSending}>
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Ahora
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}