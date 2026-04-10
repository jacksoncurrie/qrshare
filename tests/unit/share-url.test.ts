import {
  buildShareUrl,
  extractPayloadFromInput,
  normalizeDirectUrl,
} from '@/lib/share-url'

describe('share url helpers', () => {
  it('builds a local development url', () => {
    expect(buildShareUrl('v1.p.aGVsbG8', 'http://localhost:4173')).toBe(
      'http://localhost:4173/view#v1.p.aGVsbG8',
    )
  })

  it('includes the configured base path in production-style urls', () => {
    vi.stubEnv('BASE_URL', '/qrshare/')

    expect(buildShareUrl('v1.p.aGVsbG8', 'https://example.com')).toBe(
      'https://example.com/qrshare/view#v1.p.aGVsbG8',
    )

    vi.unstubAllEnvs()
  })

  it('extracts a payload from a full url or raw payload', () => {
    expect(extractPayloadFromInput('v1.p.aGVsbG8')).toBe('v1.p.aGVsbG8')
    expect(
      extractPayloadFromInput('https://example.com/view#v1.p.aGVsbG8'),
    ).toBe('v1.p.aGVsbG8')
    expect(extractPayloadFromInput('https://example.com/view')).toBe('')
  })

  it('normalizes valid direct urls and rejects unsupported protocols', () => {
    expect(normalizeDirectUrl('https://example.com/test?q=1')).toBe(
      'https://example.com/test?q=1',
    )
    expect(normalizeDirectUrl('mailto:test@example.com')).toBe('')
    expect(normalizeDirectUrl('not a url')).toBe('')
  })
})
