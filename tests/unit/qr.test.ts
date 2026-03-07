import { getQrCodeOptions } from '@/lib/qr'

describe('qr helpers', () => {
  it('returns a stable qr configuration', () => {
    expect(getQrCodeOptions()).toEqual({
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 288,
      color: {
        dark: '#0f172a',
        light: '#f8fafc',
      },
    })
  })
})
