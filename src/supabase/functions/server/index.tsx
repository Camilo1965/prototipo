import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// KV Store functions that interact with Supabase database
const supabaseKV = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const KV_TABLE = 'kv_store_5b516b3d';

const kvStore = {
  async get(key: string) {
    try {
      const { data, error } = await supabaseKV
        .from(KV_TABLE)
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        console.error('Error getting key:', key, error);
        return null;
      }

      // Si el valor ya es un objeto, devolverlo directamente
      // Si es una string, intentar parsearlo como JSON
      if (typeof data?.value === 'string') {
        try {
          return JSON.parse(data.value);
        } catch {
          return data.value; // Si no es JSON válido, devolver como string
        }
      }
      return data?.value || null;
    } catch (error) {
      console.error('Error processing value for key:', key, error);
      return null;
    }
  },

  async set(key: string, value: any) {
    try {
      const { error } = await supabaseKV
        .from(KV_TABLE)
        .upsert({
          key,
          value: JSON.stringify(value)
        });

      if (error) {
        console.error('Error setting key:', key, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error setting key:', key, error);
      return false;
    }
  },

  async del(key: string) {
    try {
      const { error } = await supabaseKV
        .from(KV_TABLE)
        .delete()
        .eq('key', key);

      if (error) {
        console.error('Error deleting key:', key, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting key:', key, error);
      return false;
    }
  },

  async getByPrefix(prefix: string) {
    try {
      const { data, error } = await supabaseKV
        .from(KV_TABLE)
        .select('key, value')
        .like('key', `${prefix}%`);

      if (error) {
        console.error('Error getting by prefix:', prefix, error);
        return [];
      }

      return (data || []).map(row => ({
        key: row.key,
        value: typeof row.value === 'string' ? 
          (() => {
            try {
              return JSON.parse(row.value);
            } catch {
              return row.value;
            }
          })() : row.value
      }));
    } catch (error) {
      console.error('Error getting by prefix:', prefix, error);
      return [];
    }
  },

  async mget(keys: string[]) {
    try {
      const { data, error } = await supabaseKV
        .from(KV_TABLE)
        .select('key, value')
        .in('key', keys);

      if (error) {
        console.error('Error getting multiple keys:', error);
        return [];
      }

      const resultMap = new Map();
      (data || []).forEach(row => {
        const value = typeof row.value === 'string' ? 
          (() => {
            try {
              return JSON.parse(row.value);
            } catch {
              return row.value;
            }
          })() : row.value;
        resultMap.set(row.key, value);
      });

      return keys.map(key => ({
        key,
        value: resultMap.get(key) || null
      }));
    } catch (error) {
      console.error('Error getting multiple keys:', error);
      return [];
    }
  },

  async mset(pairs: [string, any][]) {
    try {
      const records = pairs.map(([key, value]) => ({
        key,
        value: JSON.stringify(value)
      }));

      const { error } = await supabaseKV
        .from(KV_TABLE)
        .upsert(records);

      if (error) {
        console.error('Error setting multiple keys:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error setting multiple keys:', error);
      return false;
    }
  },

  async mdel(keys: string[]) {
    try {
      const { error } = await supabaseKV
        .from(KV_TABLE)
        .delete()
        .in('key', keys);

      if (error) {
        console.error('Error deleting multiple keys:', error);
        return [];
      }

      return keys.map(() => true);
    } catch (error) {
      console.error('Error deleting multiple keys:', error);
      return [];
    }
  }
};

// Configuración CORS y logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use('*', logger(console.log));

// Cliente Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Crear buckets de almacenamiento al iniciar
async function initializeStorage() {
  try {
    const bucketName = 'make-5b516b3d-properties';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`✅ Bucket ${bucketName} creado exitosamente`);
    }
  } catch (error) {
    console.error('❌ Error inicializando storage:', error);
  }
}

// Middleware de autenticación
async function authenticateUser(c: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Token de acceso requerido' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return c.json({ error: 'Token inválido' }, 401);
  }

  return user;
}

// ============= RUTAS DE AUTENTICACIÓN =============

// Registro de usuario
app.post('/make-server-5b516b3d/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password y nombre son requeridos' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirmar email
    });

    if (error) {
      console.error('Error en registro:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'Usuario registrado exitosamente',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.error('Error fatal en registro:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// ============= RUTAS DE PROPIEDADES =============

// Obtener todas las propiedades con filtros
app.get('/make-server-5b516b3d/properties', async (c) => {
  try {
    const properties = await kvStore.getByPrefix('property:');
    
    // Filtros de URL
    const { 
      type, location, bedrooms, bathrooms, status, condition,
      minPrice, maxPrice, minArea, amenities, features, security,
      search, sortBy, limit = '50'
    } = c.req.query();

    let filteredProperties = properties.map(prop => prop.value);

    // Aplicar filtros
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProperties = filteredProperties.filter(prop => 
        prop.title?.toLowerCase().includes(searchLower) ||
        prop.location?.toLowerCase().includes(searchLower) ||
        prop.description?.toLowerCase().includes(searchLower)
      );
    }

    if (type && type !== 'all') {
      filteredProperties = filteredProperties.filter(prop => prop.type === type);
    }

    if (location && location !== 'all') {
      filteredProperties = filteredProperties.filter(prop => prop.location === location);
    }

    if (bedrooms && bedrooms !== 'all') {
      const bedroomCount = parseInt(bedrooms);
      filteredProperties = filteredProperties.filter(prop => prop.bedrooms >= bedroomCount);
    }

    if (bathrooms && bathrooms !== 'all') {
      const bathroomCount = parseInt(bathrooms);
      filteredProperties = filteredProperties.filter(prop => prop.bathrooms >= bathroomCount);
    }

    if (status && status !== 'all') {
      filteredProperties = filteredProperties.filter(prop => prop.status === status);
    }

    if (condition && condition !== 'all') {
      filteredProperties = filteredProperties.filter(prop => prop.condition === condition);
    }

    if (minPrice) {
      filteredProperties = filteredProperties.filter(prop => prop.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filteredProperties = filteredProperties.filter(prop => prop.price <= parseInt(maxPrice));
    }

    if (minArea) {
      filteredProperties = filteredProperties.filter(prop => prop.area >= parseInt(minArea));
    }

    // Filtros por arrays (amenidades, características, seguridad)
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filteredProperties = filteredProperties.filter(prop =>
        amenitiesArray.every(amenity => prop.amenities?.includes(amenity))
      );
    }

    if (features) {
      const featuresArray = features.split(',');
      filteredProperties = filteredProperties.filter(prop =>
        featuresArray.every(feature => prop.features?.includes(feature))
      );
    }

    if (security) {
      const securityArray = security.split(',');
      filteredProperties = filteredProperties.filter(prop =>
        securityArray.every(sec => prop.security?.includes(sec))
      );
    }

    // Ordenamiento
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          filteredProperties.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-desc':
          filteredProperties.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'area-desc':
          filteredProperties.sort((a, b) => (b.area || 0) - (a.area || 0));
          break;
        case 'views-desc':
          filteredProperties.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'recent':
        default:
          filteredProperties.sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
      }
    }

    // Límite de resultados
    const limitNum = parseInt(limit);
    if (limitNum > 0) {
      filteredProperties = filteredProperties.slice(0, limitNum);
    }

    return c.json({
      properties: filteredProperties,
      total: filteredProperties.length,
      filters: { type, location, bedrooms, bathrooms, status, condition, minPrice, maxPrice }
    });
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Obtener propiedad por ID
app.get('/make-server-5b516b3d/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const property = await kvStore.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Propiedad no encontrada' }, 404);
    }

    // Incrementar vistas
    property.views = (property.views || 0) + 1;
    await kvStore.set(`property:${id}`, property);

    return c.json({ property });
  } catch (error) {
    console.error('Error obteniendo propiedad:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Crear nueva propiedad (requiere autenticación)
app.post('/make-server-5b516b3d/properties', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user; // Error de autenticación

    const propertyData = await c.req.json();
    
    // Validar datos requeridos
    const requiredStringFields = ['title', 'location', 'type'];
    for (const field of requiredStringFields) {
      if (!propertyData[field] || typeof propertyData[field] !== 'string' || propertyData[field].trim() === '') {
        return c.json({ error: `Campo requerido: ${field}` }, 400);
      }
    }

    // Validar campos numéricos requeridos
    const requiredNumberFields = ['price', 'bedrooms', 'bathrooms', 'area'];
    for (const field of requiredNumberFields) {
      if (propertyData[field] === undefined || propertyData[field] === null || 
          typeof propertyData[field] !== 'number' || propertyData[field] <= 0) {
        return c.json({ error: `Campo requerido: ${field} (debe ser un número mayor a 0)` }, 400);
      }
    }

    // Generar ID único
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const property = {
      id,
      ...propertyData,
      createdAt: now,
      updatedAt: now,
      createdBy: user.id,
      views: 0,
      status: propertyData.status || 'Disponible'
    };

    await kvStore.set(`property:${id}`, property);

    return c.json({ 
      message: 'Propiedad creada exitosamente',
      property 
    }, 201);
  } catch (error) {
    console.error('Error creando propiedad:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Actualizar propiedad
app.put('/make-server-5b516b3d/properties/:id', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user;

    const id = c.req.param('id');
    const updateData = await c.req.json();
    
    const existingProperty = await kvStore.get(`property:${id}`);
    if (!existingProperty) {
      return c.json({ error: 'Propiedad no encontrada' }, 404);
    }

    const updatedProperty = {
      ...existingProperty,
      ...updateData,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    await kvStore.set(`property:${id}`, updatedProperty);

    return c.json({ 
      message: 'Propiedad actualizada exitosamente',
      property: updatedProperty 
    });
  } catch (error) {
    console.error('Error actualizando propiedad:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Eliminar propiedad
app.delete('/make-server-5b516b3d/properties/:id', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user;

    const id = c.req.param('id');
    const property = await kvStore.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Propiedad no encontrada' }, 404);
    }

    await kvStore.del(`property:${id}`);

    return c.json({ message: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando propiedad:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// ============= RUTAS DE CONSULTAS/INQUIRIES =============

// Crear nueva consulta
app.post('/make-server-5b516b3d/inquiries', async (c) => {
  try {
    const inquiryData = await c.req.json();
    
    const requiredFields = ['name', 'email', 'message'];
    for (const field of requiredFields) {
      if (!inquiryData[field]) {
        return c.json({ error: `Campo requerido: ${field}` }, 400);
      }
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const inquiry = {
      id,
      ...inquiryData,
      status: 'Pendiente',
      createdAt: now,
      updatedAt: now
    };

    await kvStore.set(`inquiry:${id}`, inquiry);

    return c.json({ 
      message: 'Consulta enviada exitosamente',
      inquiry 
    }, 201);
  } catch (error) {
    console.error('Error creando consulta:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Obtener todas las consultas (requiere autenticación)
app.get('/make-server-5b516b3d/inquiries', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user;

    const inquiries = await kvStore.getByPrefix('inquiry:');
    const inquiriesList = inquiries.map(inq => inq.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ inquiries: inquiriesList });
  } catch (error) {
    console.error('Error obteniendo consultas:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Actualizar estado de consulta
app.put('/make-server-5b516b3d/inquiries/:id/status', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user;

    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const inquiry = await kvStore.get(`inquiry:${id}`);
    if (!inquiry) {
      return c.json({ error: 'Consulta no encontrada' }, 404);
    }

    const updatedInquiry = {
      ...inquiry,
      status,
      updatedAt: new Date().toISOString()
    };

    await kvStore.set(`inquiry:${id}`, updatedInquiry);

    return c.json({ 
      message: 'Estado actualizado exitosamente',
      inquiry: updatedInquiry 
    });
  } catch (error) {
    console.error('Error actualizando consulta:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// ============= RUTAS DE SUBIDA DE ARCHIVOS =============

// Subir imagen
app.post('/make-server-5b516b3d/upload', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user;

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No se proporcionó archivo' }, 400);
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Tipo de archivo no permitido' }, 400);
    }

    // Generar nombre único
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `properties/${fileName}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('make-5b516b3d-properties')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Error subiendo archivo:', error);
      return c.json({ error: 'Error subiendo archivo' }, 500);
    }

    // Generar URL firmada
    const { data: signedUrl } = await supabase.storage
      .from('make-5b516b3d-properties')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 año

    return c.json({
      message: 'Archivo subido exitosamente',
      url: signedUrl?.signedUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Error en subida de archivo:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// ============= RUTAS DE ESTADÍSTICAS =============

// Dashboard de estadísticas
app.get('/make-server-5b516b3d/dashboard/stats', async (c) => {
  try {
    const user = await authenticateUser(c);
    if (user.status) return user;

    const [properties, inquiries] = await Promise.all([
      kvStore.getByPrefix('property:'),
      kvStore.getByPrefix('inquiry:')
    ]);

    const propertiesList = properties.map(p => p.value);
    const inquiriesList = inquiries.map(i => i.value);

    // Estadísticas de propiedades
    const totalProperties = propertiesList.length;
    const availableProperties = propertiesList.filter(p => p.status === 'Disponible').length;
    const soldProperties = propertiesList.filter(p => p.status === 'Vendido').length;
    const totalViews = propertiesList.reduce((sum, p) => sum + (p.views || 0), 0);

    // Estadísticas de consultas
    const totalInquiries = inquiriesList.length;
    const pendingInquiries = inquiriesList.filter(i => i.status === 'Pendiente').length;
    const processedInquiries = inquiriesList.filter(i => i.status === 'Procesada').length;

    // Estadísticas por tipo de propiedad
    const propertyTypeStats = propertiesList.reduce((stats, property) => {
      const type = property.type || 'Sin definir';
      stats[type] = (stats[type] || 0) + 1;
      return stats;
    }, {});

    return c.json({
      properties: {
        total: totalProperties,
        available: availableProperties,
        sold: soldProperties,
        totalViews
      },
      inquiries: {
        total: totalInquiries,
        pending: pendingInquiries,
        processed: processedInquiries
      },
      propertyTypeStats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});

// Ruta de salud
app.get('/make-server-5b516b3d/health', (c) => {
  return c.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'InmoPlus API'
  });
});

// Inicializar storage, datos de ejemplo y usuario admin
await initializeStorage();
await initializeSampleData();
await createAdminUser();

console.log('🚀 InmoPlus Backend iniciado exitosamente');

Deno.serve(app.fetch);

// Función para poblar datos de ejemplo
async function initializeSampleData() {
  try {
    // Solo poblar si no hay datos
    const existingProperties = await kvStore.getByPrefix('property:');
    console.log(`🔍 Propiedades existentes encontradas: ${existingProperties.length}`);
    
    if (existingProperties.length === 0) {
      console.log('📋 Poblando datos de ejemplo...');
      
      // Propiedades de ejemplo
      const sampleProperties = [
      {
        id: '1',
        title: 'Casa Moderna en Zona Rosa',
        description: 'Hermosa casa moderna completamente renovada en el corazón de Bogotá. Cuenta con acabados de lujo, cocina integral, amplios espacios y excelente iluminación natural.',
        price: 450000000,
        location: 'Zona Rosa',
        type: 'casa',
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=800'
        ],
        amenities: ['parking', 'security', 'elevator', 'garden'],
        features: ['balcony', 'master_suite', 'walk_in_closet'],
        security: ['alarm', 'cameras', 'doorman'],
        status: 'Disponible',
        condition: 'Nuevo',
        views: 245,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Apartamento Lujoso Chapinero',
        description: 'Elegante apartamento en la zona más exclusiva de Bogotá. Diseño contemporáneo con acabados premium, terraza con vista panorámica y ubicación privilegiada.',
        price: 380000000,
        location: 'Chapinero',
        type: 'apartamento',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
        ],
        amenities: ['pool', 'gym', 'security', 'elevator', 'terrace'],
        features: ['fireplace', 'walk_in_closet', 'laundry'],
        security: ['concierge', 'gated', 'cameras'],
        status: 'Disponible',
        condition: 'Como nuevo',
        views: 189,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '3',
        title: 'Villa con Jardín Chía',
        description: 'Impresionante villa familiar con jardín privado y piscina. Ideal para familias que buscan tranquilidad y espacios amplios sin alejarse de la ciudad.',
        price: 720000000,
        location: 'Chía',
        type: 'chalet',
        bedrooms: 5,
        bathrooms: 4,
        area: 280,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
        ],
        amenities: ['pool', 'garden', 'parking', 'security', 'storage'],
        features: ['fireplace', 'gym', 'laundry', 'master_suite'],
        security: ['alarm', 'cameras', 'gated'],
        status: 'Disponible',
        condition: 'Nuevo',
        views: 312,
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-08T10:00:00Z'
      },
      {
        id: '4',
        title: 'Oficina Ejecutiva Usaquén',
        description: 'Oficina completamente equipada en edificio empresarial de primer nivel. Perfecta para empresas en crecimiento que buscan ubicación estratégica.',
        price: 180000000,
        location: 'Usaquén',
        type: 'oficina',
        bedrooms: 0,
        bathrooms: 2,
        area: 95,
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
          'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800'
        ],
        amenities: ['elevator', 'air_conditioning', 'wifi', 'parking'],
        features: ['balcony'],
        security: ['doorman', 'cameras'],
        status: 'Disponible',
        condition: 'Buen estado',
        views: 156,
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z'
      },
      {
        id: '5',
        title: 'Ático Exclusivo La Candelaria',
        description: 'Exclusivo ático con terraza panorámica y vista a los cerros orientales. Ubicado en zona histórica con acceso a cultura y gastronomía.',
        price: 520000000,
        location: 'La Candelaria',
        type: 'apartamento',
        bedrooms: 2,
        bathrooms: 2,
        area: 110,
        images: [
          'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=800',
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'
        ],
        amenities: ['terrace', 'elevator', 'air_conditioning', 'storage'],
        features: ['master_suite', 'walk_in_closet', 'fireplace'],
        security: ['concierge', 'cameras', 'alarm'],
        status: 'Disponible',
        condition: 'Como nuevo',
        views: 425,
        createdAt: '2024-01-03T10:00:00Z',
        updatedAt: '2024-01-03T10:00:00Z'
      },
      {
        id: '6',
        title: 'Casa Familiar Cajicá',
        description: 'Perfecta casa familiar con jardín y garaje doble. Ubicada en conjunto cerrado con zonas recreativas y excelente valorización.',
        price: 350000000,
        location: 'Cajicá',
        type: 'casa',
        bedrooms: 4,
        bathrooms: 3,
        area: 160,
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1558618047-fd4a5b8d4c78?w=800',
          'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800'
        ],
        amenities: ['garden', 'parking', 'storage', 'security'],
        features: ['laundry', 'fireplace', 'balcony'],
        security: ['alarm', 'gated'],
        status: 'Disponible',
        condition: 'Buen estado',
        views: 198,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      }
    ];

    // Guardar propiedades
    for (const property of sampleProperties) {
      await kvStore.set(`property:${property.id}`, property);
    }

    // Consultas de ejemplo
    const sampleInquiries = [
      {
        id: '1',
        name: 'María García',
        email: 'maria.garcia@email.com',
        phone: '+57 300 123 4567',
        message: 'Estoy interesada en la casa moderna de Zona Rosa. ¿Podríamos agendar una visita para este fin de semana?',
        propertyId: '1',
        status: 'Pendiente',
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z'
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+57 310 987 6543',
        message: 'Me gustaría conocer más detalles sobre el apartamento en Chapinero. ¿Cuáles son las condiciones de financiación?',
        status: 'Pendiente',
        createdAt: '2024-01-15T15:30:00Z',
        updatedAt: '2024-01-15T15:30:00Z'
      }
    ];

    // Guardar consultas
    for (const inquiry of sampleInquiries) {
      await kvStore.set(`inquiry:${inquiry.id}`, inquiry);
    }

    console.log(`✅ Datos de ejemplo cargados: ${sampleProperties.length} propiedades, ${sampleInquiries.length} consultas`);
  } else {
    console.log('✅ Datos ya existentes en la base de datos');
  }
  } catch (error) {
    console.error('❌ Error inicializando datos de ejemplo:', error);
  }
}

// Función para crear usuario admin
async function createAdminUser() {
  try {
    console.log('👤 Creando usuario admin...');

    // Intentar crear usuario admin directamente
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@inmoplus.com',
      password: 'admin123',
      user_metadata: { 
        name: 'Administrador InmoPlus',
        role: 'admin'
      },
      email_confirm: true // Auto-confirmar email
    });

    if (error) {
      // Si el error es que el usuario ya existe, está bien
      if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
        console.log('✅ Usuario admin ya existe');
        return;
      }
      console.error('❌ Error creando usuario admin:', error);
      return;
    }

    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Email: admin@inmoplus.com');
    console.log('🔑 Contraseña: admin123');
  } catch (error) {
    console.error('❌ Error en createAdminUser:', error);
  }
}