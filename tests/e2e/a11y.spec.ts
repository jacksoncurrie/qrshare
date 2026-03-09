import { expect, test } from '@playwright/test'

test('main controls are keyboard reachable', async ({ page }) => {
  await page.goto('.')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'QR Share' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Scan' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'View source on GitHub' }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: /Switch to .* mode/ }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Text to share')).toBeFocused()
})
