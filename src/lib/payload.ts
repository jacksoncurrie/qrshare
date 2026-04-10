import {
  PAYLOAD_MAX_BYTES,
  PAYLOAD_MODE_PLAIN,
  PAYLOAD_WARNING_BYTES,
  PROTOCOL_VERSION,
} from '@/lib/constants'
import {
  decodeBase64UrlToUtf8,
  encodeUtf8ToBase64Url,
  getUtf8ByteLength,
} from '@/lib/base64url'

export type PayloadMode = 'plain'

export type PayloadErrorCode =
  | 'empty_input'
  | 'payload_too_large'
  | 'invalid_direct_url'
  | 'invalid_format'
  | 'unsupported_version'
  | 'unsupported_mode'
  | 'invalid_base64'
  | 'decode_failed'
  | 'unsupported_qr_content'

export class PayloadError extends Error {
  readonly code: PayloadErrorCode

  constructor(code: PayloadErrorCode, message?: string) {
    super(message ?? code)
    this.code = code
    this.name = 'PayloadError'
  }
}

export function getPayloadMetrics(text: string): {
  byteLength: number
  warning: boolean
  allowed: boolean
} {
  const byteLength = getUtf8ByteLength(text)

  return {
    byteLength,
    warning: byteLength >= PAYLOAD_WARNING_BYTES,
    allowed: byteLength <= PAYLOAD_MAX_BYTES,
  }
}

export function encodePayload(text: string): {
  encodedPayload: string
  byteLength: number
} {
  if (!text.trim()) {
    throw new PayloadError('empty_input')
  }

  const metrics = getPayloadMetrics(text)

  if (!metrics.allowed) {
    throw new PayloadError('payload_too_large')
  }

  return {
    byteLength: metrics.byteLength,
    encodedPayload: `${PROTOCOL_VERSION}.${PAYLOAD_MODE_PLAIN}.${encodeUtf8ToBase64Url(text)}`,
  }
}

function normalizePayloadInput(input: string): string {
  return input.trim().replace(/^#/u, '')
}

export function parsePayload(input: string): {
  mode: PayloadMode
  text: string
  encodedPayload: string
} {
  const normalized = normalizePayloadInput(input)

  if (!normalized) {
    throw new PayloadError('invalid_format')
  }

  const parts = normalized.split('.')

  if (parts.length !== 3) {
    throw new PayloadError('invalid_format')
  }

  const [version, mode, payload] = parts

  if (version !== PROTOCOL_VERSION) {
    throw new PayloadError('unsupported_version')
  }

  if (mode !== PAYLOAD_MODE_PLAIN) {
    throw new PayloadError('unsupported_mode')
  }

  try {
    return {
      mode: 'plain',
      text: decodeBase64UrlToUtf8(payload),
      encodedPayload: normalized,
    }
  } catch (error) {
    if (error instanceof TypeError || error instanceof DOMException) {
      throw new PayloadError('invalid_base64')
    }

    throw new PayloadError('decode_failed')
  }
}

export function getPayloadErrorMessage(code: PayloadErrorCode): string {
  switch (code) {
    case 'empty_input':
      return 'Enter some text before generating a QR code.'
    case 'payload_too_large':
      return 'Text is too large to generate QR code.'
    case 'invalid_direct_url':
      return 'Enter a valid URL including http:// or https://.'
    case 'invalid_format':
      return 'That QR Share payload is not in a valid format.'
    case 'unsupported_version':
      return 'This QR Share link uses a payload version that v1 does not support.'
    case 'unsupported_mode':
      return 'This QR Share link uses a payload mode that v1 does not support.'
    case 'invalid_base64':
      return 'This QR Share payload is corrupted or incomplete.'
    case 'decode_failed':
      return 'QR Share could not decode that payload.'
    case 'unsupported_qr_content':
      return 'This QR code is not a QR Share link or payload.'
  }
}
