import { projectId, publicAnonKey } from './supabase/info';

// Configuración base de la API
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5b516b3d`;

// Token de autenticación (se actualiza cuando el usuario se loguea)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

// Cliente HTTP configurado
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getHeaders(includeAuth = false): HeadersInit {
    const headers = { ...this.defaultHeaders };
    
    if (includeAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (!includeAuth) {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
    
    return headers;
  }

  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (contentType?.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
      }
      
      console.error(`API Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  async get(endpoint: string, includeAuth = false) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(includeAuth),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint: string, data: any, includeAuth = false) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put(endpoint: string, data: any, includeAuth = true) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint: string, includeAuth = true) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(includeAuth),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  async uploadFile(file: File, includeAuth = true) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers: HeadersInit = {};
      if (includeAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();

// ============= TIPOS DE DATOS =============

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images?: string[];
  amenities?: string[];
  features?: string[];
  security?: string[];
  status: 'Disponible' | 'Vendido' | 'Reservado';
  condition?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  status: 'Pendiente' | 'Procesada' | 'Cerrada';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
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
  propertyTypeStats: Record<string, number>;
}

export interface PropertyFilters {
  search?: string;
  type?: string;
  location?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  amenities?: string[];
  features?: string[];
  security?: string[];
  sortBy?: string;
  limit?: number;
}

// ============= API DE AUTENTICACIÓN =============

export const authAPI = {
  async register(email: string, password: string, name: string) {
    return await apiClient.post('/auth/register', { email, password, name });
  }
};

// ============= API DE PROPIEDADES =============

export const propertiesAPI = {
  async getAll(filters: PropertyFilters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          if (Array.isArray(value)) {
            queryParams.set(key, value.join(','));
          } else {
            queryParams.set(key, String(value));
          }
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in propertiesAPI.getAll:', error);
      
      // Return fallback data structure when API fails
      return {
        properties: [],
        total: 0,
        filters: {},
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  async getById(id: string) {
    return await apiClient.get(`/properties/${id}`);
  },

  async create(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    return await apiClient.post('/properties', propertyData, true);
  },

  async update(id: string, propertyData: Partial<Property>) {
    return await apiClient.put(`/properties/${id}`, propertyData, true);
  },

  async delete(id: string) {
    return await apiClient.delete(`/properties/${id}`, true);
  }
};

// ============= API DE CONSULTAS =============

export const inquiriesAPI = {
  async create(inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    return await apiClient.post('/inquiries', inquiryData);
  },

  async getAll() {
    return await apiClient.get('/inquiries', true);
  },

  async updateStatus(id: string, status: Inquiry['status']) {
    return await apiClient.put(`/inquiries/${id}/status`, { status }, true);
  }
};

// ============= API DE ARCHIVOS =============

export const filesAPI = {
  async uploadImage(file: File) {
    return await apiClient.uploadFile(file, true);
  }
};

// ============= API DE DASHBOARD =============

export const dashboardAPI = {
  async getStats(): Promise<DashboardStats> {
    return await apiClient.get('/dashboard/stats', true);
  }
};

// ============= API DE SALUD =============

export const healthAPI = {
  async check() {
    try {
      return await apiClient.get('/health');
    } catch (error) {
      console.warn('Health check failed:', error);
      return { status: 'DOWN', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

// Exportar cliente por defecto
export default apiClient;

// ============= UTILIDADES =============

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

// Manejo de errores global
window.addEventListener('unhandledrejection', (event) => {
  console.error('API Error no manejado:', event.reason);
  // Aquí podrías enviar errores a un servicio de logging
});

export { apiClient };