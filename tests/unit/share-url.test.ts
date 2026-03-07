import { buildShareUrl, extractPayloadFromInput } from '@/lib/share-url'

describe('share url helpers', () => {
  it('builds a local development url', () => {
    expect(buildShareUrl('v1.p.aGVsbG8', 'http://localhost:4173')).toBe(
      'http://localhost:4173/view#v1.p.aGVsbG8',
    )
  })

  it('extracts a payload from a full url or raw payload', () => {
    expect(extractPayloadFromInput('v1.p.aGVsbG8')).toBe('v1.p.aGVsbG8')
    expect(
      extractPayloadFromInput('https://example.com/view#v1.p.aGVsbG8'),
    ).toBe('v1.p.aGVsbG8')
    expect(extractPayloadFromInput('https://example.com/view')).toBe('')
  })
})
