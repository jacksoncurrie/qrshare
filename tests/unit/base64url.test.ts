import {
  decodeBase64UrlToUtf8,
  encodeUtf8ToBase64Url,
  getUtf8ByteLength,
} from '@/lib/base64url'

describe('base64url', () => {
  it('round trips ASCII, Unicode, emoji, and multiline text', () => {
    const samples = ['hello', 'héllo', 'emoji 👋', 'line one\nline two']

    for (const sample of samples) {
      expect(decodeBase64UrlToUtf8(encodeUtf8ToBase64Url(sample))).toBe(sample)
    }
  })

  it('returns utf-8 byte length', () => {
    expect(getUtf8ByteLength('abc')).toBe(3)
    expect(getUtf8ByteLength('👋')).toBe(4)
  })

  it('throws for invalid base64url input', () => {
    expect(() => decodeBase64UrlToUtf8('*bad*')).toThrow()
  })
})
