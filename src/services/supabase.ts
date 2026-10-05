import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';

import { AppState, Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = (
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or Supabase public key');
}

try {
  const parsedUrl = new URL(supabaseUrl);
  if (parsedUrl.protocol !== 'https:') throw new Error();
} catch {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL must be a valid HTTPS URL');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: globalThis.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (/failed to fetch|network request failed|networkerror/i.test(message)) {
    return 'No se pudo conectar con Supabase. Verificá la URL del proyecto, que el proyecto esté activo y tu conexión a internet.';
  }
  return message || 'No se pudo completar la autenticación.';
};

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
