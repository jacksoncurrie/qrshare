import QRCode from 'qrcode'

export function getQrCodeOptions() {
  return {
    errorCorrectionLevel: 'M' as const,
    margin: 1,
    width: 288,
    color: {
      dark: '#0f172a',
      light: '#f8fafc',
    },
  }
}

export async function createQrCodeDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, getQrCodeOptions())
}
