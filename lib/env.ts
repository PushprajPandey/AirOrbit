const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

type RequiredEnvKey = (typeof required)[number];

function guardEnv(): Record<RequiredEnvKey, string> {
  const missing: string[] = [];
  const values = {} as Record<RequiredEnvKey, string>;

  for (const key of required) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    } else {
      values[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Add them to .env.local or your deployment platform before building.'
    );
  }

  return values;
}

export const env = guardEnv();

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

export function getSupabaseStorageHost(): string | null {
  try {
    const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
    return url.hostname;
  } catch {
    return null;
  }
}
