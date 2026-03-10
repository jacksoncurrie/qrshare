import QRCode from 'qrcode'

export type QrCodeColors = {
  dark: string
  light: string
}

const defaultColors: QrCodeColors = {
  dark: '#171717',
  light: '#f1efe8',
}

export function getQrCodeOptions(colors: QrCodeColors = defaultColors) {
  return {
    errorCorrectionLevel: 'M' as const,
    margin: 1,
    width: 336,
    color: {
      dark: colors.dark,
      light: colors.light,
    },
  }
}

export async function createQrCodeDataUrl(
  value: string,
  colors?: QrCodeColors,
): Promise<string> {
  return QRCode.toDataURL(value, getQrCodeOptions(colors))
}
