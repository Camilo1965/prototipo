import { propertiesAPI, inquiriesAPI } from './api';

export const sampleProperties = [
  {
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
    status: 'Disponible' as const,
    condition: 'Nuevo'
  },
  {
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
    status: 'Disponible' as const,
    condition: 'Como nuevo'
  },
  {
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
    status: 'Disponible' as const,
    condition: 'Nuevo'
  },
  {
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
    status: 'Disponible' as const,
    condition: 'Buen estado'
  },
  {
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
    status: 'Disponible' as const,
    condition: 'Como nuevo'
  },
  {
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
    status: 'Disponible' as const,
    condition: 'Buen estado'
  },
  {
    title: 'Penthouse Zona Norte',
    description: 'Espectacular penthouse con doble altura y terraza privada. Acabados de primera calidad y vista panorámica de 360 grados.',
    price: 950000000,
    location: 'Zona Norte',
    type: 'apartamento',
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800'
    ],
    amenities: ['pool', 'gym', 'terrace', 'elevator', 'parking'],
    features: ['master_suite', 'walk_in_closet', 'gym', 'fireplace'],
    security: ['concierge', 'cameras', 'gated', 'alarm'],
    status: 'Disponible' as const,
    condition: 'Nuevo'
  },
  {
    title: 'Local Comercial Centro',
    description: 'Excelente local comercial en zona de alto flujo peatonal. Ideal para retail, restaurante o servicios. Completamente adecuado.',
    price: 280000000,
    location: 'La Candelaria',
    type: 'local',
    bedrooms: 0,
    bathrooms: 1,
    area: 85,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      'https://images.unsplash.com/photo-1515568800411-89f9c03c9e52?w=800'
    ],
    amenities: ['air_conditioning', 'wifi', 'storage'],
    features: [],
    security: ['alarm', 'cameras'],
    status: 'Disponible' as const,
    condition: 'Buen estado'
  }
];

export const sampleInquiries = [
  {
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+57 300 123 4567',
    message: 'Estoy interesada en la casa moderna de Zona Rosa. ¿Podríamos agendar una visita para este fin de semana?',
    propertyId: '1'
  },
  {
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+57 310 987 6543',
    message: 'Me gustaría conocer más detalles sobre el apartamento en Chapinero. ¿Cuáles son las condiciones de financiación?'
  },
  {
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+57 320 555 7890',
    message: 'Busco una oficina en Usaquén para mi empresa. El local que tienen se ve interesante, ¿podemos hablar?'
  },
  {
    name: 'Diego Herrera',
    email: 'diego.herrera@email.com',
    message: 'Excelente página web. Me interesa invertir en propiedades en Chía. ¿Tienen más opciones disponibles?'
  },
  {
    name: 'Laura Sánchez',
    email: 'laura.sanchez@email.com',
    phone: '+57 305 111 2233',
    message: 'El penthouse de Zona Norte me parece perfecto. ¿Cuándo podríamos hacer una cita para verlo?'
  }
];

// Función para poblar la base de datos con datos de ejemplo
export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando población de base de datos...');
    
    // Crear propiedades de ejemplo
    const propertyPromises = sampleProperties.map(async (property, index) => {
      try {
        await new Promise(resolve => setTimeout(resolve, index * 200)); // Evitar saturar la API
        const result = await propertiesAPI.create(property);
        console.log(`✅ Propiedad creada: ${property.title}`);
        return result;
      } catch (error) {
        console.warn(`⚠️ Error creando propiedad ${property.title}:`, error);
        return null;
      }
    });

    // Crear consultas de ejemplo
    const inquiryPromises = sampleInquiries.map(async (inquiry, index) => {
      try {
        await new Promise(resolve => setTimeout(resolve, index * 100));
        const result = await inquiriesAPI.create(inquiry);
        console.log(`✅ Consulta creada: ${inquiry.name}`);
        return result;
      } catch (error) {
        console.warn(`⚠️ Error creando consulta de ${inquiry.name}:`, error);
        return null;
      }
    });

    // Esperar a que se completen todas las operaciones
    const [properties, inquiries] = await Promise.all([
      Promise.all(propertyPromises),
      Promise.all(inquiryPromises)
    ]);

    const createdProperties = properties.filter(p => p !== null).length;
    const createdInquiries = inquiries.filter(i => i !== null).length;

    console.log(`🎉 Base de datos poblada exitosamente:`);
    console.log(`   📋 ${createdProperties} propiedades creadas`);
    console.log(`   💬 ${createdInquiries} consultas creadas`);

    return {
      success: true,
      propertiesCreated: createdProperties,
      inquiriesCreated: createdInquiries
    };

  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para verificar si la base de datos necesita ser poblada
export async function checkAndSeedDatabase() {
  try {
    const response = await propertiesAPI.getAll({ limit: 1 });
    
    if (!response.properties || response.properties.length === 0) {
      console.log('📋 Base de datos vacía, poblando con datos de ejemplo...');
      return await seedDatabase();
    } else {
      console.log(`✅ Base de datos ya contiene ${response.total} propiedades`);
      return { success: true, alreadySeeded: true };
    }
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
    return { success: false, error: 'Error verificando base de datos' };
  }
}

export default { seedDatabase, checkAndSeedDatabase, sampleProperties, sampleInquiries };