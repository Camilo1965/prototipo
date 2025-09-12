import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const KV_TABLE = 'kv_store_5b516b3d';

export async function get(key: string) {
  try {
    const { data, error } = await supabase
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

    return data?.value ? JSON.parse(data.value) : null;
  } catch (error) {
    console.error('Error parsing value for key:', key, error);
    return null;
  }
}

export async function set(key: string, value: any) {
  try {
    const { error } = await supabase
      .from(KV_TABLE)
      .upsert({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
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
}

export async function del(key: string) {
  try {
    const { error } = await supabase
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
}

export async function getByPrefix(prefix: string) {
  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('key, value')
      .like('key', `${prefix}%`);

    if (error) {
      console.error('Error getting by prefix:', prefix, error);
      return [];
    }

    return (data || []).map(row => ({
      key: row.key,
      value: JSON.parse(row.value)
    }));
  } catch (error) {
    console.error('Error getting by prefix:', prefix, error);
    return [];
  }
}

export async function mget(keys: string[]) {
  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('key, value')
      .in('key', keys);

    if (error) {
      console.error('Error getting multiple keys:', error);
      return [];
    }

    const resultMap = new Map();
    (data || []).forEach(row => {
      resultMap.set(row.key, JSON.parse(row.value));
    });

    return keys.map(key => ({
      key,
      value: resultMap.get(key) || null
    }));
  } catch (error) {
    console.error('Error getting multiple keys:', error);
    return [];
  }
}

export async function mset(pairs: [string, any][]) {
  try {
    const records = pairs.map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
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
}

export async function mdel(keys: string[]) {
  try {
    const { error } = await supabase
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