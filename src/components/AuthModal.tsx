import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner@2.0.3';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { signIn, signUp, loading, error, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados del formulario
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validaciones
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};

    if (!loginForm.email) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (!loginForm.password) {
      errors.password = 'La contraseña es requerida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};

    if (!registerForm.name) {
      errors.name = 'El nombre es requerido';
    } else if (registerForm.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!registerForm.email) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(registerForm.email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (!registerForm.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!validatePassword(registerForm.password)) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejadores
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateLoginForm()) return;

    try {
      await signIn(loginForm.email, loginForm.password);
      toast.success('¡Bienvenido! Has iniciado sesión correctamente');
      onClose();
      resetForms();
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateRegisterForm()) return;

    try {
      await signUp(registerForm.email, registerForm.password, registerForm.name);
      toast.success('¡Cuenta creada exitosamente! Ya puedes acceder al panel de administración');
      onClose();
      resetForms();
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    clearError();
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'login' | 'register');
    clearError();
    setFormErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Acceso a InmoPlus
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Inicia sesión o crea una cuenta para acceder al panel de administración
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardDescription>
                  Ingresa tus credenciales para acceder al panel de administración
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                        value={loginForm.email}
                        onChange={(e) => {
                          setLoginForm(prev => ({ ...prev, email: e.target.value }));
                          if (formErrors.email) {
                            setFormErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                        value={loginForm.password}
                        onChange={(e) => {
                          setLoginForm(prev => ({ ...prev, password: e.target.value }));
                          if (formErrors.password) {
                            setFormErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-500">{formErrors.password}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardDescription>
                  Crea tu cuenta para administrar propiedades
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre completo"
                        className={`pl-10 ${formErrors.name ? 'border-red-500' : ''}`}
                        value={registerForm.name}
                        onChange={(e) => {
                          setRegisterForm(prev => ({ ...prev, name: e.target.value }));
                          if (formErrors.name) {
                            setFormErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                        value={registerForm.email}
                        onChange={(e) => {
                          setRegisterForm(prev => ({ ...prev, email: e.target.value }));
                          if (formErrors.email) {
                            setFormErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm(prev => ({ ...prev, password: e.target.value }));
                          if (formErrors.password) {
                            setFormErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-500">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                        value={registerForm.confirmPassword}
                        onChange={(e) => {
                          setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                          if (formErrors.confirmPassword) {
                            setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }
                        }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-600">
          <p>
            Al crear una cuenta, aceptas nuestros términos y condiciones
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}