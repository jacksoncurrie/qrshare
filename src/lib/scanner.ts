import QrScanner from 'qr-scanner'

type ScannerErrorCode =
  | 'permission_denied'
  | 'no_camera'
  | 'unsupported_browser'
  | 'scan_failed'

export class ScannerError extends Error {
  readonly code: ScannerErrorCode

  constructor(code: ScannerErrorCode, message?: string) {
    super(message ?? code)
    this.code = code
    this.name = 'ScannerError'
  }
}

export interface ScannerAdapter {
  start(): Promise<void>
  stop(): void
  destroy(): void
}

declare global {
  interface Window {
    __qrShareScannerMockResult?: string
  }
}

function mapScannerError(error: unknown): ScannerError {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase()

  if (message.includes('permission')) {
    return new ScannerError('permission_denied')
  }

  if (message.includes('camera') && message.includes('not found')) {
    return new ScannerError('no_camera')
  }

  return new ScannerError('scan_failed')
}

export function getScannerErrorMessage(code: ScannerErrorCode): string {
  switch (code) {
    case 'permission_denied':
      return 'Camera access was denied. You can still paste a QR Share link or payload.'
    case 'no_camera':
      return 'No camera was found on this device.'
    case 'unsupported_browser':
      return 'This browser does not support camera scanning.'
    case 'scan_failed':
      return 'QR Share could not start the scanner.'
  }
}

export function createScannerAdapter(
  videoElement: HTMLVideoElement,
  onDecode: (value: string) => void,
  onError: (error: ScannerError) => void,
): ScannerAdapter {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new ScannerError('unsupported_browser')
  }

  if (window.__qrShareScannerMockResult) {
    let started = false

    return {
      async start() {
        started = true
        queueMicrotask(() => {
          if (started && window.__qrShareScannerMockResult) {
            onDecode(window.__qrShareScannerMockResult)
          }
        })
      },
      stop() {
        started = false
      },
      destroy() {
        started = false
      },
    }
  }

  const scanner = new QrScanner(
    videoElement,
    (result) => {
      onDecode(typeof result === 'string' ? result : result.data)
    },
    {
      returnDetailedScanResult: true,
      preferredCamera: 'environment',
      onDecodeError: () => undefined,
      highlightScanRegion: false,
      highlightCodeOutline: false,
    },
  )
  scanner.setInversionMode('both')

  return {
    async start() {
      try {
        await scanner.start()
      } catch (error) {
        const mapped = mapScannerError(error)
        onError(mapped)
        throw mapped
      }
    },
    stop() {
      scanner.stop()
    },
    destroy() {
      scanner.destroy()
    },
  }
}
