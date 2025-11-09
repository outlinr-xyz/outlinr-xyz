/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  lemonSqueezy: {
    apiKey: string;
  };
  app: {
    name: string;
    supportEmail: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as string;
}

function getOptionalEnvVar(key: string, defaultValue: string): string {
  const value = import.meta.env[key];
  return (value as string) || defaultValue;
}

export const env: EnvConfig = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  lemonSqueezy: {
    apiKey: getEnvVar('VITE_LEMON_SQUEEZY_API_KEY'),
  },
  app: {
    name: getOptionalEnvVar('VITE_APP_NAME', 'Outlinr'),
    supportEmail: getOptionalEnvVar('VITE_SUPPORT_EMAIL', 'admin@outlinr.xyz'),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (env.isDevelopment) {
  console.log('Environment loaded:', {
    supabaseUrl: env.supabase.url,
    appName: env.app.name,
    mode: env.isDevelopment ? 'development' : 'production',
  });
}
