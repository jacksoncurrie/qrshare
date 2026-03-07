import { expect, test } from '@playwright/test'

test('main controls are keyboard reachable', async ({ page }) => {
  await page.goto('.')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'QR Share' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Create', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'View', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Text to share')).toBeFocused()
})
