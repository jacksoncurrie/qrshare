import { getQrCodeOptions } from '@/lib/qr'

describe('qr helpers', () => {
  it('returns a stable qr configuration', () => {
    expect(getQrCodeOptions()).toEqual({
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 336,
      color: {
        dark: '#171717',
        light: '#f1efe8',
      },
    })
  })

  it('allows overriding qr colors', () => {
    expect(
      getQrCodeOptions({
        dark: '#222222',
        light: '#eeeeee',
      }),
    ).toEqual({
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 336,
      color: {
        dark: '#222222',
        light: '#eeeeee',
      },
    })
  })
})
