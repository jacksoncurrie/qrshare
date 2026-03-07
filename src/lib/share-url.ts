import { ROUTES } from '@/lib/constants'
import { getAppOrigin, getBasePath } from '@/lib/env'

export function buildShareUrl(encodedPayload: string, origin?: string): string {
  const baseUrl = new URL(getBasePath(), `${getAppOrigin(origin)}/`)
  const viewUrl = new URL(ROUTES.view.replace(/^\//u, ''), baseUrl)
  viewUrl.hash = encodedPayload
  return viewUrl.toString()
}

export function extractPayloadFromInput(input: string): string {
  const trimmed = input.trim()

  if (!trimmed) {
    return ''
  }

  if (trimmed.startsWith('#v1.')) {
    return trimmed.slice(1)
  }

  if (trimmed.startsWith('v1.')) {
    return trimmed
  }

  try {
    const parsed = new URL(trimmed)
    return parsed.hash.replace(/^#/u, '')
  } catch {
    return ''
  }
}
