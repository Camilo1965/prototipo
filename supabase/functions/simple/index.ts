import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  views: number;
  agent: string;
  createdAt: string;
  images?: string[];
  description?: string;
  amenities?: string[];
  features?: string[];
  security?: string[];
  condition?: string;
}

interface Inquiry {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  priority?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  try {
    // Initialize Supabase client
    const supabaseAdmin = createClient(
      (globalThis as any).Deno?.env.get('SUPABASE_URL') ?? '',
      (globalThis as any).Deno?.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Health check route
    if (path === '/simple' || path === '/simple/' || path === '/simple/health') {
      return new Response(
        JSON.stringify({
          status: 'OK',
          message: 'InmoPlus API funcionando correctamente',
          timestamp: new Date().toISOString(),
          path: path
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get all properties
    if (path === '/simple/make-server-5b516b3d/properties' && req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('kv_store_5b516b3d')
        .select('key, value')
        .like('key', 'property:%')

      if (error) {
        throw error
      }

      const properties = (data || []).map((row: any) => {
        try {
          return typeof row.value === 'string' ? JSON.parse(row.value) : row.value
        } catch {
          return row.value
        }
      })

      // Ordenar por fecha de creación más reciente
      properties.sort((a: Property, b: Property) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )

      return new Response(
        JSON.stringify({
          properties: properties,
          total: properties.length
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get single property by ID
    if (path.startsWith('/simple/make-server-5b516b3d/properties/') && req.method === 'GET') {
      const id = path.split('/').pop()
      
      const { data, error } = await supabaseAdmin
        .from('kv_store_5b516b3d')
        .select('value')
        .eq('key', `property:${id}`)
        .single()

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Propiedad no encontrada' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        )
      }

      const property = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
      
      // Incrementar vistas
      property.views = (property.views || 0) + 1
      await supabaseAdmin
        .from('kv_store_5b516b3d')
        .update({ value: JSON.stringify(property) })
        .eq('key', `property:${id}`)

      return new Response(
        JSON.stringify({ property }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Create new property
    if (path === '/simple/make-server-5b516b3d/properties' && req.method === 'POST') {
      const body = await req.json()
      
      // Get current counter
      const { data: counterData, error: counterError } = await supabaseAdmin
        .from('kv_store_5b516b3d')
        .select('value')
        .eq('key', 'property_counter')
        .single()

      let counter = 0
      if (!counterError && counterData?.value) {
        try {
          counter = typeof counterData.value === 'string' ? 
            JSON.parse(counterData.value) : counterData.value
        } catch {
          counter = 0
        }
      }

      // Increment counter
      counter++
      
      // Update counter in database
      await supabaseAdmin
        .from('kv_store_5b516b3d')
        .upsert({
          key: 'property_counter',
          value: JSON.stringify(counter)
        })

      // Generate ID
      const id = `PROP-${counter.toString().padStart(3, '0')}`
      const now = new Date().toISOString()

      const property = {
        id,
        ...body,
        createdAt: now,
        updatedAt: now,
        views: 0,
        status: body.status || 'Disponible'
      }

      // Save property
      const { error: saveError } = await supabaseAdmin
        .from('kv_store_5b516b3d')
        .upsert({
          key: `property:${id}`,
          value: JSON.stringify(property)
        })

      if (saveError) {
        throw saveError
      }

      return new Response(
        JSON.stringify({
          message: 'Propiedad creada exitosamente',
          property
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // Dashboard stats route
    if (path === '/simple/make-server-5b516b3d/dashboard/stats' && req.method === 'GET') {
      const [propertiesData, inquiriesData] = await Promise.all([
        supabaseAdmin.from('kv_store_5b516b3d').select('key, value').like('key', 'property:%'),
        supabaseAdmin.from('kv_store_5b516b3d').select('key, value').like('key', 'inquiry:%')
      ])

      const properties = (propertiesData.data || []).map((row: any) => {
        try {
          return typeof row.value === 'string' ? JSON.parse(row.value) : row.value
        } catch {
          return row.value
        }
      })

      const inquiries = (inquiriesData.data || []).map((row: any) => {
        try {
          return typeof row.value === 'string' ? JSON.parse(row.value) : row.value
        } catch {
          return row.value
        }
      })

      // Calculate stats
      const totalProperties = properties.length
      const availableProperties = properties.filter((p: Property) => p.status === 'Disponible').length
      const soldProperties = properties.filter((p: Property) => p.status === 'Vendido').length
      const totalViews = properties.reduce((sum: number, p: Property) => sum + (p.views || 0), 0)

      const totalInquiries = inquiries.length
      const pendingInquiries = inquiries.filter((i: Inquiry) => i.status === 'Pendiente').length
      const processedInquiries = inquiries.filter((i: Inquiry) => i.status === 'Procesada').length

      // Property type stats
      const propertyTypeStats = properties.reduce((stats: any, property: Property) => {
        const type = property.type || 'Sin definir'
        stats[type] = (stats[type] || 0) + 1
        return stats
      }, {})

      return new Response(
        JSON.stringify({
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
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Health check route
    if (path === '/simple/make-server-5b516b3d/health' && req.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'OK',
          message: 'InmoPlus API funcionando correctamente',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Default 404 response
    return new Response(
      JSON.stringify({
        error: 'Ruta no encontrada',
        path: path,
        method: req.method
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error?.message || 'Error desconocido'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})