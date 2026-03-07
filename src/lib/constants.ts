export const APP_NAME = 'QR Share'
export const REPO_SLUG = 'proxisend'
export const PROTOCOL_VERSION = 'v1'
export const PAYLOAD_MODE_PLAIN = 'p'
export const PAYLOAD_WARNING_BYTES = 500
export const PAYLOAD_MAX_BYTES = 800
export const COPY_SUCCESS_TIMEOUT_MS = 2000
export const APP_REPO_URL = 'https://github.com/jacksoncurrie/proxisend'
export const ROUTES = {
  create: '/create',
  view: '/view',
} as const

export const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.create]: `${APP_NAME} - Create`,
  [ROUTES.view]: `${APP_NAME} - View`,
  notFound: `${APP_NAME} - Not Found`,
}
