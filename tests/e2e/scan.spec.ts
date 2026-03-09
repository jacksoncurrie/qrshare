import { expect, test } from '@playwright/test'

test('scanner flow decodes a mocked qr result', async ({ page }) => {
  await page.addInitScript(() => {
    window.__qrShareScannerMockResult =
      'https://jacksoncurrie.github.io/qrshare/view#v1.p.c2NhbiByZXN1bHQ'
  })

  await page.goto('.')
  await page.getByRole('link', { name: 'Scan' }).click()
  await expect(page.getByLabel('Decoded text')).toHaveValue('scan result')
})
