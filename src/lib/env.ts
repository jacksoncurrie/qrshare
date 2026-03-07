import { REPO_SLUG } from '@/lib/constants'

export const productionBasePath = `/${REPO_SLUG}/`

export function getBasePath(): string {
  return import.meta.env.BASE_URL
}

export function getCanonicalAppUrl(): string {
  return `https://jacksoncurrie.github.io${productionBasePath}`
}

export function getAppOrigin(explicitOrigin?: string): string {
  if (explicitOrigin) {
    return explicitOrigin
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }

  return 'https://jacksoncurrie.github.io'
}
