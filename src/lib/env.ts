export function getBasePath(): string {
  return import.meta.env.BASE_URL
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
