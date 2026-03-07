import { expect, test } from '@playwright/test'

test('create screen loads and generates a qr share link', async ({ page }) => {
  await page.goto('.')

  await expect(
    page.getByRole('heading', { name: 'Generate a QR Share link' }),
  ).toBeVisible()
  await page.getByLabel('Text to share').fill('hello from playwright')
  await page.getByRole('button', { name: 'Generate QR' }).click()

  await expect(page.getByLabel('Share URL')).toHaveValue(/\/view#v1\.p\./)
  await expect(
    page.getByAltText('QR code for opening the shared text in QR Share'),
  ).toBeVisible()
})
