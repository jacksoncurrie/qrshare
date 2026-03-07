import { mount } from '@vue/test-utils'
import CameraScanner from '@/components/CameraScanner.vue'

const startMock = vi.fn()
const stopMock = vi.fn()
const destroyMock = vi.fn()

vi.mock('@/lib/scanner', () => ({
  ScannerError: class ScannerError extends Error {
    constructor(code) {
      super(code)
      this.code = code
    }
  },
  getScannerErrorMessage: (code: string) =>
    code === 'permission_denied'
      ? 'Camera access was denied. You can still paste a QR Share link or payload.'
      : code,
  createScannerAdapter: vi.fn(() => ({
    start: startMock,
    stop: stopMock,
    destroy: destroyMock,
  })),
}))

describe('CameraScanner', () => {
  it('shows a permission denied state', async () => {
    startMock.mockRejectedValueOnce({ code: 'permission_denied' })
    const wrapper = mount(CameraScanner)

    await wrapper.get('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Camera access was denied')
  })
})
