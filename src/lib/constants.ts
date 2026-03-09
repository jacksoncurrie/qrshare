export const APP_NAME = 'QR Share'
export const REPO_SLUG = 'qrshare'
export const APP_AUTHOR_NAME = 'Jackson'
export const APP_AUTHOR_URL = 'https://github.com/jacksoncurrie'
export const PROTOCOL_VERSION = 'v1'
export const PAYLOAD_MODE_PLAIN = 'p'
export const PAYLOAD_WARNING_BYTES = 500
export const PAYLOAD_MAX_BYTES = 800
export const COPY_SUCCESS_TIMEOUT_MS = 2000
export const APP_REPO_URL = 'https://github.com/jacksoncurrie/qrshare'
export const ROUTES = {
  create: '/create',
  scan: '/scan',
  view: '/view',
} as const

export const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.create]: `${APP_NAME} - Create`,
  [ROUTES.scan]: `${APP_NAME} - Scan`,
  [ROUTES.view]: `${APP_NAME} - View`,
  notFound: `${APP_NAME} - Not Found`,
}
