import {
  encodePayload,
  getPayloadMetrics,
  parsePayload,
  PayloadError,
} from '@/lib/payload'

describe('payload', () => {
  it('round trips a payload', () => {
    const encoded = encodePayload('hello world')
    expect(parsePayload(encoded.encodedPayload)).toMatchObject({
      mode: 'plain',
      text: 'hello world',
      encodedPayload: encoded.encodedPayload,
    })
  })

  it('rejects unsupported versions', () => {
    expect(() => parsePayload('v2.p.aGVsbG8')).toThrow(PayloadError)
    try {
      parsePayload('v2.p.aGVsbG8')
    } catch (error) {
      expect(error).toMatchObject({ code: 'unsupported_version' })
    }
  })

  it('rejects unsupported modes', () => {
    expect(() => parsePayload('v1.x.aGVsbG8')).toThrow(PayloadError)
  })

  it('rejects empty input and oversized payloads', () => {
    expect(() => encodePayload('   ')).toThrow(PayloadError)
    expect(() => encodePayload('a'.repeat(801))).toThrow(PayloadError)
  })

  it('calculates payload metrics', () => {
    expect(getPayloadMetrics('a'.repeat(500))).toEqual({
      byteLength: 500,
      warning: true,
      allowed: true,
    })
  })
})
