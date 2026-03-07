const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder('utf-8', { fatal: true })

function encodeBase64(binary: string): string {
  if (typeof btoa === 'function') {
    return btoa(binary)
  }

  return Buffer.from(binary, 'binary').toString('base64')
}

function decodeBase64(base64: string): string {
  if (typeof atob === 'function') {
    return atob(base64)
  }

  return Buffer.from(base64, 'base64').toString('binary')
}

export function getUtf8ByteLength(value: string): number {
  return textEncoder.encode(value).byteLength
}

export function encodeUtf8ToBase64Url(value: string): string {
  const bytes = textEncoder.encode(value)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return encodeBase64(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '')
}

export function decodeBase64UrlToUtf8(value: string): string {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  )
  const binary = decodeBase64(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))

  return textDecoder.decode(bytes)
}
