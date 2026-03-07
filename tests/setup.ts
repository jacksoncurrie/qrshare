import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  window.location.hash = ''
  delete window.__qrShareScannerMockResult
})
