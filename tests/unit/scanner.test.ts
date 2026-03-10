import { createScannerAdapter } from '@/lib/scanner'

const startMock = vi.fn()
const stopMock = vi.fn()
const destroyMock = vi.fn()
const setInversionModeMock = vi.fn()

vi.mock('qr-scanner', () => ({
  default: vi.fn(function MockQrScanner() {
    return {
      start: startMock,
      stop: stopMock,
      destroy: destroyMock,
      setInversionMode: setInversionModeMock,
    }
  }),
}))

describe('scanner adapter', () => {
  beforeEach(() => {
    startMock.mockReset()
    stopMock.mockReset()
    destroyMock.mockReset()
    setInversionModeMock.mockReset()

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: vi.fn(),
      },
    })
  })

  it('configures the scanner to read both regular and inverted qr codes', () => {
    const videoElement = document.createElement('video')

    createScannerAdapter(
      videoElement,
      () => undefined,
      () => undefined,
    )

    expect(setInversionModeMock).toHaveBeenCalledWith('both')
  })
})
