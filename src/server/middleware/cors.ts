/**
 * CORS middleware for desktop and temporary open H5 access.
 */

<<<<<<< HEAD
import { isLoopbackHost } from '../h5AccessPolicy.js'

=======
>>>>>>> upstream/main
export function corsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin = origin || 'http://localhost:3000'
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function baseCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export type CorsResolution = {
  allowed: boolean
  rejected: boolean
  headers: Record<string, string>
}

export type CorsResolutionOptions = {
  h5Enabled?: boolean
  isOriginAllowed?: (origin: string) => Promise<boolean>
}

<<<<<<< HEAD
const LOCAL_ORIGINS = new Set([
  'http://tauri.localhost',
  'https://tauri.localhost',
  'tauri://localhost',
])
=======
const LOCAL_DESKTOP_ORIGINS = new Set(['file://'])
>>>>>>> upstream/main

function isLocalOrigin(origin?: string | null): boolean {
  if (!origin) {
    return true
  }

<<<<<<< HEAD
  if (LOCAL_ORIGINS.has(origin)) {
    return true
  }

  try {
    return isLoopbackHost(new URL(origin).hostname)
  } catch {
    return false
  }
=======
  return LOCAL_DESKTOP_ORIGINS.has(origin)
>>>>>>> upstream/main
}

export async function resolveCors(
  origin?: string | null,
  _requestOrigin?: string | null,
  options: CorsResolutionOptions = {},
): Promise<CorsResolution> {
  if (!origin) {
    return {
      allowed: true,
      rejected: false,
      headers: corsHeaders(origin),
    }
  }

  if (!options.h5Enabled || isLocalOrigin(origin)) {
    return {
      allowed: true,
      rejected: false,
      headers: {
        ...baseCorsHeaders(),
        'Access-Control-Allow-Origin': origin,
      },
    }
  }

  if (options.isOriginAllowed && await options.isOriginAllowed(origin)) {
    return {
      allowed: true,
      rejected: false,
      headers: {
        ...baseCorsHeaders(),
        'Access-Control-Allow-Origin': origin,
      },
    }
  }

  return {
    allowed: false,
    rejected: true,
    headers: baseCorsHeaders(),
  }
}
